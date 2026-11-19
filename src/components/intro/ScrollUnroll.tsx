import { m } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { wedding } from '../../config/wedding';
import { FourCorners } from '../ornaments/CornerFiligree';
import { Divider } from '../ornaments/Divider';
import { Ganesha } from '../ornaments/Ganesha';

export type ScrollPhase = 'hidden' | 'emerge' | 'unroll' | 'reveal';

interface ScrollUnrollProps {
  phase: ScrollPhase;
  /** Vertical offset (px) of the envelope centre from the viewport centre. */
  fromY: number;
}

const UNROLL_S = 1.15;
const ROYAL_EASE = [0.65, 0.05, 0.36, 1] as const;

/** A rosewood rod with gold finials. */
function Rod({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute -left-4 -right-4 h-[18px] ${className}`} style={{ filter: 'drop-shadow(0 6px 6px rgb(0 0 0 / 0.45))' }}>
      <svg viewBox="0 0 100 18" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-[10px] inset-y-0 h-full w-[calc(100%-20px)]">
        <rect x="0" y="2" width="100" height="14" rx="3" fill="url(#rod-wood)" />
        <rect x="0" y="5.5" width="100" height="1" fill="#E8D6A3" opacity=".25" />
        <rect x="6" y="2" width="1.6" height="14" fill="url(#foil-grad-v)" />
        <rect x="92.4" y="2" width="1.6" height="14" fill="url(#foil-grad-v)" />
      </svg>
      {(['left-0', 'right-0'] as const).map((side) => (
        <svg key={side} viewBox="0 0 22 22" aria-hidden="true" className={`absolute top-1/2 h-[22px] w-[22px] -translate-y-1/2 ${side}`}>
          <circle cx="11" cy="11" r="8.5" fill="url(#seal-wax)" stroke="#754B36" strokeWidth=".8" />
          <circle cx="11" cy="11" r="4.6" fill="none" stroke="#754B36" strokeWidth=".7" opacity=".7" />
          <circle cx="11" cy="11" r="1.6" fill="#E8D6A3" />
        </svg>
      ))}
    </div>
  );
}

/**
 * The ivory scroll. It rises out of the envelope closed (rods together),
 * unrolls top-to-bottom (clip-path synced with the travelling bottom rod),
 * then expands to fill the screen while the rods slide away.
 */
export function ScrollUnroll({ phase, fromY }: ScrollUnrollProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState({ x: 1, y: 1 });

  // Measure the scale needed for the paper to cover the viewport.
  useLayoutEffect(() => {
    if (phase !== 'reveal' || !paperRef.current) return;
    const rect = paperRef.current.getBoundingClientRect();
    setFill({
      x: (window.innerWidth / rect.width) * 1.04,
      y: (window.innerHeight / rect.height) * 1.04,
    });
  }, [phase]);

  if (phase === 'hidden') return null;
  const open = phase === 'unroll' || phase === 'reveal';
  const reveal = phase === 'reveal';

  return (
    <div aria-hidden="true" className="decor fixed inset-0 z-20 grid place-items-center">
      <m.div
        className="relative w-[min(84vw,28rem)] land:w-[min(58vw,30rem)]"
        initial={{ y: fromY, scale: 0.72, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.45, 0, 0.15, 1], opacity: { duration: 0.15 } }}
      >
        {/* paper */}
        <m.div
          ref={paperRef}
          className="tex-paper relative h-[min(64dvh,36rem)] overflow-hidden land:h-[74dvh]"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)', scaleX: 1, scaleY: 1 }}
          animate={{
            clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
            scaleX: reveal ? fill.x : 1,
            scaleY: reveal ? fill.y : 1,
          }}
          transition={{
            clipPath: { duration: UNROLL_S, ease: ROYAL_EASE },
            scaleX: { duration: 0.45, ease: [0.3, 0, 0.15, 1] },
            scaleY: { duration: 0.45, ease: [0.3, 0, 0.15, 1] },
          }}
        >
          <m.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
            animate={{ opacity: reveal ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div aria-hidden="true" className="absolute inset-3">
              <FourCorners tone="paper" className="h-10 w-10" />
            </div>
            <Ganesha tone="paper" className="h-[clamp(56px,11dvh,88px)] w-[clamp(56px,11dvh,88px)]" />
            <p lang="sa" className="text-invocation text-maroon">
              {wedding.invocation}
            </p>
            <Divider tone="paper" className="h-4 w-[min(12rem,50vw)]" />
            <p className="font-serif text-weds italic text-gold-deep">
              {wedding.groom} <span className="italic">{wedding.joiner}</span> {wedding.bride}
            </p>
          </m.div>
        </m.div>

        {/* top rod (fixed) */}
        <m.div
          className="absolute inset-x-0 top-0"
          animate={reveal ? { y: '-60vh', opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.55, 0, 0.6, 1] }}
        >
          <Rod className="-top-[9px]" />
        </m.div>

        {/* bottom rod track: travels the full paper height while unrolling */}
        <m.div
          className="absolute inset-x-0 top-0 h-[min(64dvh,36rem)] land:h-[74dvh]"
          initial={{ y: '0%' }}
          animate={reveal ? { y: '100%', opacity: 0 } : { y: open ? '100%' : '0%', opacity: 1 }}
          transition={reveal ? { duration: 0.4 } : { duration: UNROLL_S, ease: ROYAL_EASE }}
        >
          {/* curl shading just above the roll */}
          <m.div
            className="absolute inset-x-0 -top-7 h-7"
            style={{ background: 'linear-gradient(to bottom, transparent, rgb(61 16 29 / 0.16) 75%, rgb(61 16 29 / 0.3))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: open && !reveal ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
          <m.div
            className="absolute inset-x-0 top-0"
            animate={reveal ? { y: '60vh' } : { y: 0 }}
            transition={{ duration: 0.5, ease: [0.55, 0, 0.6, 1] }}
          >
            <Rod className="-top-[9px]" />
          </m.div>
        </m.div>
      </m.div>
    </div>
  );
}
