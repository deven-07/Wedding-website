import { AnimatePresence, m } from 'framer-motion';
import { Link2, MessageCircle, Share2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '../../config/wedding';
import { useToast } from '../../hooks/useToast';
import { canNativeShare, copyText, invitationUrl, shareText, whatsappUrl } from '../../lib/share';

const ROUND =
  'foil-border relative grid h-12 w-12 place-items-center rounded-full text-champagne shadow-[0_6px_20px_rgb(61_16_29/0.45)] transition-transform duration-200 hover:scale-105 active:scale-95';
const SURFACE = { ['--surface' as string]: '#3D101D' };

/**
 * Share group: the main button toggles two options —
 * WhatsApp (direct link) and Share (native share sheet on phones,
 * otherwise copies the link and shows a "Link copied" toast).
 */
export function ShareButton() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const share = async () => {
    const url = invitationUrl();
    if (canNativeShare()) {
      try {
        await navigator.share({ title: wedding.meta.title, text: shareText(), url });
        setOpen(false);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        // fall through to copying
      }
    }
    const ok = await copyText(url);
    toast(ok ? wedding.ui.linkCopied : wedding.ui.copyFailed);
    setOpen(false);
  };

  const Option = canNativeShare() ? Share2 : Link2;

  return (
    <div ref={rootRef} className="relative flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <m.div
            id="share-options"
            className="flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href={whatsappUrl(shareText(), invitationUrl())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={wedding.ui.shareWhatsApp}
              title={wedding.ui.shareWhatsApp}
              className={ROUND}
              style={SURFACE}
              onClick={() => {
                setOpen(false);
              }}
            >
              <MessageCircle aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <button
              type="button"
              aria-label={canNativeShare() ? wedding.ui.share : wedding.ui.copyLink}
              title={canNativeShare() ? wedding.ui.share : wedding.ui.copyLink}
              className={ROUND}
              style={SURFACE}
              onClick={() => {
                void share();
              }}
            >
              <Option aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </m.div>
        ) : null}
      </AnimatePresence>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="share-options"
        aria-label={wedding.ui.share}
        title={wedding.ui.share}
        className={ROUND}
        style={SURFACE}
        onClick={() => {
          setOpen((o) => !o);
        }}
      >
        {open ? (
          <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <Share2 aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
