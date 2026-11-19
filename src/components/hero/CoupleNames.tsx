import { m, type Variants } from 'framer-motion';
import { coupleName, wedding } from '../../config/wedding';
import { Flourish } from '../ornaments/Flourish';

/** Seconds after the hero starts revealing (see HeroSection for the full sequence). */
const NAME_TIMING = { groom: 1.05, joiner: 1.7, bride: 2.05, stagger: 0.09 } as const;

const word: Variants = {
  hidden: {},
  shown: (delay: number) => ({ transition: { staggerChildren: NAME_TIMING.stagger, delayChildren: delay } }),
};
const letter: Variants = {
  hidden: { opacity: 0, y: '0.32em', scale: 0.86 },
  shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }),
};

function Word({ text, delay }: { text: string; delay: number }) {
  return (
    <m.span aria-hidden="true" className="relative block -mr-[0.18em] whitespace-nowrap" variants={word} custom={delay}>
      {Array.from(text).map((ch, i) => (
        <m.span key={`${ch}${i}`} variants={letter} className="foil-letter-paper inline-block">
          {ch}
        </m.span>
      ))}
    </m.span>
  );
}

interface CoupleNamesProps {
  /** Start the reveal (false keeps everything hidden, e.g. under the opening). */
  ready: boolean;
}

/**
 * The page's single h1: DEVEN / & / ADITI. Letters rise in one by one,
 * the flourishes around the calligraphic "&" draw themselves, and a soft light sheen
 * sweeps the foil lettering every few seconds.
 */
export function CoupleNames({ ready }: CoupleNamesProps) {
  return (
    <m.h1
      id="couple-names"
      tabIndex={-1}
      className="relative flex flex-col items-center font-serif text-[length:clamp(2.6rem,14.5cqw,6.5rem)] font-medium leading-none tracking-[0.18em] outline-none"
      initial="hidden"
      animate={ready ? 'shown' : 'hidden'}
    >
      <span className="sr-only">{coupleName}</span>
      <Word text={wedding.groom} delay={NAME_TIMING.groom} />
      <m.span
        aria-hidden="true"
        variants={fade}
        custom={NAME_TIMING.joiner}
        className="my-[0.04em] flex items-center gap-3 font-serif text-[0.82em] font-medium italic leading-[1.05] tracking-normal sm:gap-4"
      >
        {ready ? (
          <Flourish tone="paper" drawDelay={NAME_TIMING.joiner} className="h-3.5 w-11 sm:h-4 sm:w-14" />
        ) : (
          <span className="h-3.5 w-11 sm:h-4 sm:w-14" />
        )}
        <span className="foil-letter-paper px-[0.06em]">{wedding.joiner}</span>
        {ready ? (
          <Flourish tone="paper" flip drawDelay={NAME_TIMING.joiner} className="h-3.5 w-11 sm:h-4 sm:w-14" />
        ) : (
          <span className="h-3.5 w-11 sm:h-4 sm:w-14" />
        )}
      </m.span>
      <Word text={wedding.bride} delay={NAME_TIMING.bride} />
      {ready ? <span aria-hidden="true" className="sheen" /> : null}
    </m.h1>
  );
}
