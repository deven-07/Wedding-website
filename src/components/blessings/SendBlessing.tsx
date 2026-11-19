import { AnimatePresence, m } from 'framer-motion';
import { useMemo, useState } from 'react';
import { wedding } from '../../config/wedding';
import { cssVars } from '../../lib/css';
import { mulberry32, range } from '../../lib/random';
import { LotusBloom } from '../ornaments/LotusBloom';
import { Sparkle } from '../ornaments/Sparkle';

interface SendBlessingProps {
  sent: boolean;
  onSend: () => void;
}

/** Gold sparkles that rise from the flower as it opens. */
function RisingSparkles() {
  const items = useMemo(() => {
    const rand = mulberry32(17);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: range(rand, 22, 78),
      size: range(rand, 7, 14),
      style: cssVars({ '--dx': `${range(rand, -40, 40).toFixed(0)}px`, '--delay': `${range(rand, 0, 0.7).toFixed(2)}s` }),
    }));
  }, []);
  return (
    <span aria-hidden="true" className="decor absolute inset-x-0 bottom-1/3 h-0">
      {items.map((s) => (
        <span key={s.id} className="anim-rise absolute block" style={{ ...s.style, left: `${s.left}%`, width: s.size, height: s.size }}>
          <Sparkle fill="#C9A45C" className="h-full w-full" />
        </span>
      ))}
    </span>
  );
}

/**
 * A closed lotus bud the guest touches to send their blessing: it unfolds
 * into a full bloom, gold sparkles rise, a warm glow spreads (parent) and a
 * thank-you line appears. Remembered on the guest's device.
 */
export function SendBlessing({ sent, onSend }: SendBlessingProps) {
  const [justSent, setJustSent] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        aria-pressed={sent}
        onClick={() => {
          if (sent) return;
          setJustSent(true);
          onSend();
        }}
        className={`group relative grid h-36 w-40 place-items-center rounded-full transition-transform duration-300 ${
          sent ? 'cursor-default' : 'hover:scale-[1.04] active:scale-95'
        }`}
      >
        <span className="sr-only">{sent ? wedding.ui.blessingSentLabel : wedding.ui.blessingPrompt}</span>
        {!sent ? (
          <span aria-hidden="true" className="anim-breathe absolute inset-3 rounded-full border border-gold-deep/35" />
        ) : null}
        <LotusBloom open={sent} tone="paper" className="relative h-32 w-40" />
        {justSent ? <RisingSparkles /> : null}
      </button>
      <div className="mt-1 min-h-[3.5rem] text-center">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <m.p
              key="thanks"
              className="quote text-maroon"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: justSent ? 0.9 : 0 }}
            >
              {wedding.ui.blessingThanks}
            </m.p>
          ) : (
            <m.p key="prompt" aria-hidden="true" className="eyebrow anim-hint max-w-[17rem] text-gold-deep" exit={{ opacity: 0 }}>
              {wedding.ui.blessingPrompt}
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
