import { m } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { GoldDust } from '../ambient/GoldDust';
import { PetalLayer } from '../ambient/PetalLayer';
import { RotatingMandala } from '../ambient/RotatingMandala';
import { Section } from '../layout/Section';
import { LotusBloom } from '../ornaments/LotusBloom';
import { SectionHeading } from '../ui/SectionHeading';
import { CountdownBox } from './CountdownBox';

/** "Counting Down to Forever" — live countdown to the Baarat Prasthan (IST). */
export default function WeddingCountdown() {
  const parts = useCountdown(wedding.countdown.target);
  const units = wedding.ui.countdownUnits;
  const done = parts?.done ?? false;

  return (
    <Section
      id="countdown"
      material="velvet-deep"
      damask
      vignette
      labelledBy="countdown-heading"
      decor={
        <>
          <div className="absolute left-1/2 top-1/2 h-[min(130vw,46rem)] w-[min(130vw,46rem)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.09]">
            <RotatingMandala className="h-full w-full" />
          </div>
          <GoldDust />
          {done ? <PetalLayer density="normal" seed={31} /> : null}
        </>
      }
    >
      <div className="container-prose max-w-[44rem] py-section">
        <SectionHeading id="countdown-heading" surface="dark">
          {wedding.countdown.heading}
        </SectionHeading>

        {done ? (
          <m.div
            className="mt-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <LotusBloom className="h-20 w-24" />
            <p className="foil-text shimmer mt-4 font-serif text-[length:clamp(1.75rem,7vw,3rem)] font-medium italic">
              {wedding.ui.celebrationsBegun}
            </p>
          </m.div>
        ) : (
          <div
            role="timer"
            aria-live="off"
            aria-busy={parts === null}
            className="mt-10 grid grid-cols-2 gap-3 xs:grid-cols-4 xs:gap-2 sm:mt-12 sm:gap-4"
          >
            <CountdownBox value={parts?.days ?? null} label={units.days} />
            <CountdownBox value={parts?.hours ?? null} label={units.hours} />
            <CountdownBox value={parts?.minutes ?? null} label={units.minutes} />
            <CountdownBox value={parts?.seconds ?? null} label={units.seconds} animate />
          </div>
        )}
      </div>
    </Section>
  );
}
