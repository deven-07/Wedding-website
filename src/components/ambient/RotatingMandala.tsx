import { MandalaRingSvg } from '../ornaments/Mandala';

interface RotatingMandalaProps {
  className?: string;
  /** Soft light rays fanning behind the mandala. */
  rays?: boolean;
  strokeWidth?: number;
}

const RING_ANIMATION = ['anim-spin-slow', 'anim-spin-rev', 'anim-spin-slower', 'anim-spin-rev'] as const;

/**
 * Layered mandala whose rings rotate in alternating directions
 * (120 s / 180 s / 240 s per turn). Each ring is its own SVG so the
 * rotation is a composited HTML transform. Paused off-screen through the
 * parent section; static under reduced motion.
 */
export function RotatingMandala({ className = '', rays = false, strokeWidth = 1 }: RotatingMandalaProps) {
  return (
    <div aria-hidden="true" className={`decor relative ${className}`}>
      {rays ? (
        <div
          className="anim-spin-slower absolute -inset-[30%] rounded-full"
          style={{
            background: 'repeating-conic-gradient(from 0deg, rgb(201 164 92 / 0.16) 0deg 3deg, transparent 3deg 15deg)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 15%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, #000 15%, transparent 100%)',
          }}
        />
      ) : null}
      {RING_ANIMATION.map((anim, i) => (
        <MandalaRingSvg
          key={i}
          index={i}
          strokeWidth={strokeWidth}
          className={`${anim} absolute inset-0 h-full w-full`}
        />
      ))}
    </div>
  );
}
