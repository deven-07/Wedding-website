import { m } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { LotusBloom } from '../ornaments/LotusBloom';

/** A small gold lotus with a soft double chevron — jumps to the celebrations. */
export function ScrollCue({ show, delay }: { show: boolean; delay: number }) {
  return (
    <m.button
      type="button"
      aria-label={wedding.ui.scrollCue}
      onClick={() => {
        document.getElementById('celebrations')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="group grid h-16 w-16 place-items-center rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8, delay }}
    >
      <span className="anim-bob flex flex-col items-center">
        <LotusBloom tone="paper" glow={false} className="h-7 w-9" />
        <svg viewBox="0 0 16 14" aria-hidden="true" className="mt-0.5 h-3.5 w-4 text-gold-deep">
          <path d="M2 2l6 5 6-5M2 7l6 5 6-5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </m.button>
  );
}
