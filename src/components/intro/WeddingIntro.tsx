import { m, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { coupleName, wedding } from '../../config/wedding';
import { useMusic } from '../../hooks/useMusic';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { haptic } from '../../lib/haptics';
import { fillName } from '../../lib/sanitize';
import { GoldDust } from '../ambient/GoldDust';
import { PetalBurst } from '../ambient/PetalBurst';
import { PetalLayer } from '../ambient/PetalLayer';
import { Flourish } from '../ornaments/Flourish';
import { Ganesha } from '../ornaments/Ganesha';
import { GoldButton } from '../ui/GoldButton';
import { InvitationEnvelope } from './InvitationEnvelope';
import { ScrollUnroll, type ScrollPhase } from './ScrollUnroll';

/* ---------------------------------------------------------------------- */
/* Timeline                                                               */
/* ---------------------------------------------------------------------- */

type Stage = 'sealed' | 'crack' | 'split' | 'flap' | 'emerge' | 'unroll' | 'burst' | 'reveal' | 'fade' | 'done';

const ORDER: Stage[] = ['sealed', 'crack', 'split', 'flap', 'emerge', 'unroll', 'burst', 'reveal', 'done'];

/** [stage, ms after the tap] — total ≈ 3.5 s */
const TIMELINE: [Stage, number][] = [
  ['split', 130], // seal cracks into shards (≈0.5 s fall)
  ['flap', 480], // flap lifts in 3D (0.6 s), rolled scroll visible in the pocket
  ['emerge', 980], // envelope sinks, closed scroll rises out of it (0.6 s)
  ['unroll', 1560], // paper unrolls top → bottom (1.15 s)
  ['burst', 2600], // petals + gold flare (≈0.6 s)
  ['reveal', 2830], // scroll fills the screen, becomes the hero (0.6 s)
  ['done', 3500],
];

const REDUCED_FADE_MS = 600;

const textBlock: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
  gone: { opacity: 0, y: -14, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
};
/** Names: no opacity fade so they paint immediately (they are the LCP element). */
const namesItem: Variants = {
  hidden: { y: 10, scale: 0.985 },
  shown: { y: 0, scale: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  gone: {},
};
const textItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  gone: {},
};

interface WeddingIntroProps {
  guestName: string | null;
  /** Called when the page beneath should mount (start of the reveal). */
  onReveal: () => void;
  /** Called once the opening is complete (or skipped). */
  onDone: () => void;
}

/**
 * The sealed invitation: full-screen velvet, envelope with wax seal and the
 * "OPEN WEDDING INVITATION" button. Tapping runs the seal → flap → scroll →
 * petals sequence; a second tap (or Esc) skips straight to the hero.
 */
export function WeddingIntro({ guestName, onReveal, onDone }: WeddingIntroProps) {
  const [stage, setStage] = useState<Stage>('sealed');
  const [fromY, setFromY] = useState(0);
  const timers = useRef<number[]>([]);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const music = useMusic();
  const reduced = useReducedMotion();

  const clearTimers = () => {
    timers.current.forEach((t) => {
      window.clearTimeout(t);
    });
    timers.current = [];
  };

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    clearTimers();
    onReveal();
    setStage('done');
    music.fadeIn();
    onDone();
  }, [music, onDone, onReveal]);

  const open = useCallback(() => {
    if (stage !== 'sealed') return;
    music.start(); // inside the tap — required by iOS to allow audio
    haptic(14);

    if (reduced) {
      setStage('fade');
      onReveal();
      timers.current.push(window.setTimeout(finish, REDUCED_FADE_MS));
      return;
    }

    // Start the closed scroll inside the envelope: offset from where the
    // scroll's top rod will rest (paper is vertically centred).
    const rect = envelopeRef.current?.getBoundingClientRect();
    if (rect) {
      const h = window.innerHeight;
      const landscape = window.matchMedia('(orientation: landscape) and (max-height: 520px)').matches;
      const paperH = landscape ? 0.74 * h : Math.min(0.64 * h, 576);
      setFromY(rect.top + rect.height * 0.3 - (h - paperH) / 2);
    }
    setStage('crack');
    for (const [next, at] of TIMELINE) {
      timers.current.push(
        window.setTimeout(() => {
          if (next === 'done') {
            finish();
            return;
          }
          if (next === 'reveal') onReveal();
          setStage(next);
        }, at),
      );
    }
  }, [stage, music, reduced, onReveal, finish]);

  const animating = stage !== 'sealed' && stage !== 'done';

  // Esc skips the sequence for keyboard users.
  useEffect(() => {
    if (!animating) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [animating, finish]);

  useEffect(() => clearTimers, []);

  const idx = ORDER.indexOf(stage);
  const at = (s: Stage) => stage !== 'fade' && idx >= ORDER.indexOf(s);
  const leaving = stage === 'fade' || at('reveal');

  const scrollPhase: ScrollPhase = at('reveal')
    ? 'reveal'
    : at('unroll')
      ? 'unroll'
      : at('emerge')
        ? 'emerge'
        : 'hidden';

  return (
    <m.div
      className="fixed inset-0 z-50 overflow-hidden"
      // once the reveal starts the page beneath takes over for assistive tech
      aria-hidden={leaving ? true : undefined}
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={stage === 'fade' ? { duration: REDUCED_FADE_MS / 1000 } : { duration: 0.25, delay: 0.42 }}
    >
      {/* velvet backdrop */}
      <m.div
        className="tex-velvet tex-damask vignette absolute inset-0"
        animate={{ opacity: at('reveal') ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        <div
          aria-hidden="true"
          className="decor absolute left-1/2 top-[58%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgb(201 164 92 / 0.16), transparent)' }}
        />
        <GoldDust />
        <PetalLayer density="low" seed={5} />
      </m.div>

      {/* sealed invitation */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        <main
          className="safe-pad-x flex min-h-full flex-col items-center justify-center gap-[clamp(0.75rem,2.6dvh,1.75rem)] text-center land:grid land:grid-cols-2 land:items-center land:gap-8"
          style={{
            paddingTop: 'max(1rem, var(--safe-top))',
            paddingBottom: 'max(1rem, var(--safe-bottom))',
          }}
        >
          <m.header
            className="flex flex-col items-center gap-[clamp(0.25rem,1.1dvh,0.7rem)]"
            variants={textBlock}
            initial="hidden"
            animate={at('crack') ? 'gone' : 'shown'}
          >
            <m.div variants={textItem}>
              <Ganesha glow className="h-[clamp(52px,10dvh,88px)] w-[clamp(52px,10dvh,88px)]" />
            </m.div>
            <m.p variants={textItem} lang="sa" className="text-invocation text-champagne">
              {wedding.invocation}
            </m.p>
            <m.p
              variants={textItem}
              className="font-sans text-[length:clamp(0.66rem,2.5vw,0.8rem)] font-bold uppercase tracking-[0.14em] text-gold xs:tracking-[0.22em]"
            >
              {wedding.blessingLine}
            </m.p>
            <m.p variants={textItem} className="mt-[clamp(0.25rem,1.4dvh,1rem)] font-serif text-[length:clamp(1.05rem,4vw,1.35rem)] italic text-champagne">
              {wedding.teaser}
            </m.p>
            {guestName ? (
              <m.p variants={textItem} className="font-serif text-[length:clamp(1.15rem,4.4vw,1.5rem)] font-semibold text-champagne">
                {fillName(wedding.personal.greeting, guestName)}
              </m.p>
            ) : null}
            <m.p variants={namesItem} className="flex flex-col items-center leading-none">
              <span className="sr-only">{coupleName}</span>
              <span
                aria-hidden="true"
                className="foil-text shimmer -mr-[0.18em] font-serif text-[length:clamp(2.25rem,min(12vw,6.4dvh),4.75rem)] font-medium tracking-[0.18em]"
              >
                {wedding.groom}
              </span>
              <span
                aria-hidden="true"
                className="my-[0.02em] flex items-center gap-3 font-serif text-[length:clamp(1.9rem,min(10vw,5.4dvh),4rem)] font-medium italic leading-[1.05]"
              >
                <Flourish className="h-3 w-9" />
                <span className="foil-text px-[0.06em]">{wedding.joiner}</span>
                <Flourish flip className="h-3 w-9" />
              </span>
              <span
                aria-hidden="true"
                className="foil-text shimmer -mr-[0.18em] font-serif text-[length:clamp(2.25rem,min(12vw,6.4dvh),4.75rem)] font-medium tracking-[0.18em]"
              >
                {wedding.bride}
              </span>
            </m.p>
          </m.header>

          <div className="flex flex-col items-center gap-[clamp(0.9rem,2.6dvh,1.6rem)]">
            <m.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <InvitationEnvelope
                ref={envelopeRef}
                sealState={stage === 'sealed' ? 'intact' : stage === 'crack' ? 'cracking' : 'broken'}
                flapOpen={at('flap')}
                sunk={at('emerge')}
                onOpen={open}
              />
            </m.div>
            <m.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={at('crack') || stage === 'fade' ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: at('crack') ? 0 : 1.1 }}
            >
              <GoldButton
                glow
                onClick={open}
                disabled={stage !== 'sealed'}
                className="whitespace-nowrap !px-5 !tracking-[0.12em] xs:!px-7 xs:!tracking-[0.18em]"
              >
                {wedding.openButton}
              </GoldButton>
              <p className="anim-hint font-sans text-micro text-champagne/80">{wedding.ui.sealHint}</p>
            </m.div>
          </div>
        </main>
      </div>

      <ScrollUnroll phase={scrollPhase} fromY={fromY} />

      {/* petals + gold flare as the scroll finishes unrolling */}
      {at('burst') ? (
        <div aria-hidden="true" className="decor fixed inset-0 z-30">
          <m.div
            className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgb(255 248 233 / 0.95), rgb(232 214 163 / 0.65) 30%, rgb(201 164 92 / 0.25) 55%, transparent 72%)' }}
            initial={{ opacity: 0, scale: 0.25 }}
            animate={{ opacity: [0, 0.85, 0], scale: 1.35 }}
            transition={{ duration: 0.95, ease: 'easeOut', opacity: { duration: 0.95, times: [0, 0.3, 1] } }}
          />
          <PetalBurst
            x={window.innerWidth / 2}
            y={window.innerHeight * 0.45}
            count={24}
            spread={Math.min(window.innerWidth * 0.6, 300)}
            seed={9}
          />
        </div>
      ) : null}

      {/* while animating: tap anywhere (or press Esc) to skip */}
      {animating ? (
        <button
          type="button"
          onClick={finish}
          className="fixed inset-0 z-40 flex cursor-default items-end justify-center bg-transparent"
          style={{ paddingBottom: 'max(1.25rem, var(--safe-bottom))' }}
        >
          <span className="anim-hint rounded-full bg-burgundy/40 px-3 py-1 font-sans text-micro text-champagne/80">
            {wedding.ui.skipHint}
          </span>
        </button>
      ) : null}
    </m.div>
  );
}
