import { AnimatePresence, m } from 'framer-motion';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useGuestName } from '../hooks/useGuestName';
import { useHideOnScrollDown } from '../hooks/useScrollDirection';
import { lazyWithRetry } from '../lib/lazyWithRetry';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import { WeddingIntro } from './intro/WeddingIntro';
import { MusicToggle } from './ui/MusicToggle';
import { ScrollProgress } from './ui/ScrollProgress';
import { ShareButton } from './ui/ShareButton';

/** The page below the opening is its own chunk; prefetched while the envelope shows. */
const loadSiteContent = () => import('./SiteContent');
// If the page files changed after a redeploy, reload once — straight to the
// invitation, since the guest has already opened the envelope.
const SiteContent = lazyWithRetry(
  () => loadSiteContent().then((mod) => ({ default: mod.SiteContent })),
  () => {
    writeStorage('session', STORAGE_KEYS.opened, '1');
  },
);

type Mode = 'intro' | 'revealing' | 'site';

/**
 * Switches between the sealed opening and the invitation page.
 * A refresh within the same visit skips straight to the page.
 */
export function Invitation() {
  const [mode, setMode] = useState<Mode>(() =>
    readStorage('session', STORAGE_KEYS.opened) === '1' ? 'site' : 'intro',
  );
  const [replayKey, setReplayKey] = useState(0);
  const cameFromIntro = useRef(false);
  const guestName = useGuestName();
  const fabHidden = useHideOnScrollDown();

  const handleReveal = useCallback(() => {
    window.scrollTo(0, 0);
    setMode((m) => (m === 'intro' ? 'revealing' : m));
  }, []);

  const handleDone = useCallback(() => {
    writeStorage('session', STORAGE_KEYS.opened, '1');
    cameFromIntro.current = true;
    setMode('site');
  }, []);

  const replay = useCallback(() => {
    removeStorage('session', STORAGE_KEYS.opened);
    window.scrollTo(0, 0);
    setReplayKey((k) => k + 1);
    setMode('intro');
  }, []);

  // Warm the page chunk while the guest admires the envelope.
  useEffect(() => {
    if (mode !== 'intro') return;
    const t = window.setTimeout(() => {
      // a failed prefetch is retried (and recovered) when the page actually mounts
      loadSiteContent().catch(() => undefined);
    }, 1500);
    return () => {
      window.clearTimeout(t);
    };
  }, [mode]);

  // Lock page scrolling while the sealed invitation is showing.
  useEffect(() => {
    document.body.classList.toggle('is-locked', mode !== 'site');
    return () => {
      document.body.classList.remove('is-locked');
    };
  }, [mode]);

  // Move focus to the couple's names once the opening completes.
  useEffect(() => {
    if (mode !== 'site' || !cameFromIntro.current) return;
    cameFromIntro.current = false;
    document.getElementById('couple-names')?.focus({ preventScroll: true });
  }, [mode]);

  return (
    <>
      {mode !== 'site' ? (
        <WeddingIntro key={replayKey} guestName={guestName} onReveal={handleReveal} onDone={handleDone} />
      ) : null}
      {mode === 'site' ? (
        <header>
          <ScrollProgress />
        </header>
      ) : null}
      {mode !== 'intro' ? (
        <Suspense fallback={<div aria-hidden="true" className="tex-paper screen-h" />}>
          <SiteContent ready={mode === 'site'} onReplay={replay} />
        </Suspense>
      ) : null}
      <AnimatePresence>
        {mode === 'site' ? (
          <m.div
            key="fab"
            className="fixed z-40 flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={fabHidden ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ right: 'max(1rem, var(--safe-right))', bottom: 'max(1rem, var(--safe-bottom))', pointerEvents: fabHidden ? 'none' : undefined }}
          >
            <ShareButton />
            <MusicToggle />
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
