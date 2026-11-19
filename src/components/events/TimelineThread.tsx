import { m, useScroll, useSpring, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { RefObject } from 'react';

/** Two intertwined strands — reads as a twisted gold cord. */
function strand(phase: number): string {
  const steps = 160;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 1000;
    const x = 12 + Math.sin((i / steps) * Math.PI * 2 * 26 + phase) * 3.2;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(1)}`;
  }
  return d;
}
const STRAND_A = strand(0);
const STRAND_B = strand(Math.PI);

function Strand({ d, progress, width, opacity }: { d: string; progress: MotionValue<number>; width: number; opacity: number }) {
  return (
    <m.path
      d={d}
      fill="none"
      stroke="url(#foil-grad-v)"
      strokeWidth={width}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      opacity={opacity}
      style={{ pathLength: progress }}
    />
  );
}

/**
 * Gold cord that draws itself as the guest scrolls through the timeline
 * (scroll-linked pathLength). Fully drawn under reduced motion.
 */
export function TimelineThread({ target, className = '' }: { target: RefObject<HTMLElement | null>; className?: string }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start 70%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <svg
      viewBox="0 0 24 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`decor absolute w-6 ${className}`}
    >
      {/* faint full-length guide so the path ahead is hinted */}
      <path d="M12 0V1000" stroke="#C9A45C" strokeOpacity=".18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {reduced ? (
        <>
          <path d={STRAND_A} fill="none" stroke="url(#foil-grad-v)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <path d={STRAND_B} fill="none" stroke="url(#foil-grad-v)" strokeWidth="1" opacity=".7" vectorEffect="non-scaling-stroke" />
        </>
      ) : (
        <>
          <Strand d={STRAND_A} progress={progress} width={1.4} opacity={1} />
          <Strand d={STRAND_B} progress={progress} width={1} opacity={0.7} />
        </>
      )}
    </svg>
  );
}
