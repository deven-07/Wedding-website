import { m, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { wedding } from '../../config/wedding';
import { isDesktop } from '../../lib/css';
import { ParallaxLayer } from '../ambient/ParallaxLayer';
import { RotatingMandala } from '../ambient/RotatingMandala';
import { TapPetals } from '../ambient/TapPetals';
import { Section } from '../layout/Section';
import { FourCorners } from '../ornaments/CornerFiligree';
import { Divider } from '../ornaments/Divider';
import { JharokhaBase, JharokhaCrown } from '../ornaments/JharokhaArch';
import { Paisley } from '../ornaments/Motifs';
import { Toran } from '../ornaments/Toran';
import { CoupleNames } from './CoupleNames';
import { ScrollCue } from './ScrollCue';

/**
 * Reveal sequence (seconds after `ready`):
 * invocation 0.1 → families 0.45 → invite 0.75 → DEVEN 1.05 → & 1.7 →
 * ADITI 2.05 → divider 2.7 → quote 3.0 → scroll cue 3.5
 */
const T = { invocation: 0.1, families: 0.45, invite: 0.75, divider: 2.7, quote: 3.0, cue: 3.5 } as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: (delay: number) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } }),
};

/** Thin pillar lines continuing the arch frame down the sides. */
function Pillars() {
  return (
    <div aria-hidden="true" className="decor absolute inset-0">
      <span className="absolute inset-y-0 left-[3.5%] w-[1.5px]" style={{ background: 'linear-gradient(var(--gold-deep), var(--gold-mid) 50%, var(--gold-deep))' }} />
      <span className="absolute inset-y-0 left-[5.5%] w-px bg-gold-deep/45" />
      <span className="absolute inset-y-0 right-[3.5%] w-[1.5px]" style={{ background: 'linear-gradient(var(--gold-deep), var(--gold-mid) 50%, var(--gold-deep))' }} />
      <span className="absolute inset-y-0 right-[5.5%] w-px bg-gold-deep/45" />
    </div>
  );
}

export function HeroSection({ ready }: { ready: boolean }) {
  const strands = isDesktop() ? 30 : 13;
  const tapRef = useRef<HTMLDivElement>(null);

  return (
    <Section
      id="hero"
      material="paper"
      edges="bottom"
      labelledBy="couple-names"
      className="screen-h flex flex-col"
      contentClassName="flex flex-1 flex-col"
      decor={
        <>
          <div className="absolute left-1/2 top-[56%] h-[min(150vw,58rem)] w-[min(150vw,58rem)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.16]">
            <RotatingMandala rays className="h-full w-full" strokeWidth={0.9} />
          </div>
          <div className="absolute inset-3 sm:inset-5">
            <FourCorners tone="paper" className="h-12 w-12 sm:h-20 sm:w-20" />
          </div>
          <ParallaxLayer speed={0.35} className="absolute inset-y-0 left-[4%] hidden w-24 xl:block">
            <Paisley tone="paper" className="absolute top-[34%] h-36 w-24 opacity-50" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.35} className="absolute inset-y-0 right-[4%] hidden w-24 xl:block">
            <Paisley tone="paper" className="absolute top-[34%] h-36 w-24 -scale-x-100 opacity-50" />
          </ParallaxLayer>
        </>
      }
    >
      <div ref={tapRef} className="relative flex flex-1 flex-col">
        <TapPetals target={tapRef} />
        <Toran strands={strands} className="decor block h-auto w-full" />

        <m.div
          className="safe-pad-x mx-auto flex w-full flex-1 flex-col items-center justify-center pb-4 pt-2"
          initial="hidden"
          animate={ready ? 'shown' : 'hidden'}
        >
          {/* jharokha frame */}
          <div
            className="relative w-full max-w-[min(42rem,max(22rem,72dvh))]"
            style={{ containerType: 'inline-size' }}
          >
            <JharokhaCrown className="decor block h-auto w-full" />
            <div className="relative" style={{ display: 'flow-root' }}>
              <Pillars />
              {/* the invocation sits inside the arch; the rest starts below the arch springs */}
              <div className="relative -mt-[23.5cqw] flex flex-col items-center px-[9%] pb-[6%] text-center">
                <m.p
                  variants={rise}
                  custom={T.invocation}
                  lang="sa"
                  className="text-[length:clamp(0.95rem,4.6cqw,1.5rem)] leading-normal tracking-[0.06em] text-maroon"
                >
                  {wedding.invocation}
                </m.p>
                <m.p variants={rise} custom={T.families} className="mt-[15cqw] text-lead text-burgundy">
                  {wedding.hero.familiesLine}
                </m.p>
                <m.p variants={rise} custom={T.invite} className="mt-1 text-balance text-lead text-burgundy">
                  {wedding.hero.inviteLine}
                </m.p>
                <div className="mt-[clamp(1rem,5cqw,2rem)]">
                  <CoupleNames ready={ready} />
                </div>
                <m.div variants={rise} custom={T.divider} className="mt-[clamp(1rem,5cqw,1.75rem)] w-full">
                  <Divider tone="paper" className="mx-auto h-5 w-[min(16rem,80%)]" />
                </m.div>
                <m.p variants={rise} custom={T.quote} className="quote mt-4 max-w-[22rem] text-burgundy">
                  {wedding.hero.quote}
                </m.p>
              </div>
            </div>
            <JharokhaBase className="decor block h-auto w-full" />
          </div>

          <div className="mt-3">
            <ScrollCue show={ready} delay={T.cue} />
          </div>
        </m.div>
      </div>
    </Section>
  );
}
