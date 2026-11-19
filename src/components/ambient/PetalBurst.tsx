import { m } from 'framer-motion';
import { useMemo } from 'react';
import { mulberry32, range } from '../../lib/random';
import { MarigoldPetal, RosePetal } from '../ornaments/Petals';

interface PetalBurstProps {
  /** Origin within the positioned parent, in px. */
  x: number;
  y: number;
  count?: number;
  /** Spread radius in px. */
  spread?: number;
  seed?: number;
  onComplete?: () => void;
}

/** A one-shot burst of marigold & rose petals from a point (transform/opacity only). */
export function PetalBurst({ x, y, count = 14, spread = 160, seed = 3, onComplete }: PetalBurstProps) {
  const petals = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      // jittered angle + uneven distance so it reads as a toss, not a ring
      const angle = (i / count) * Math.PI * 2 + range(rand, -0.9, 0.9);
      const dist = range(rand, spread * 0.2, spread);
      const dx = Math.cos(angle) * dist;
      const lift = Math.sin(angle) * dist * 0.75 - range(rand, 30, 90);
      return {
        id: i,
        rose: rand() > 0.5,
        size: range(rand, 18, 30),
        flutter: range(rand, 180, 540) * (rand() > 0.5 ? 1 : -1),
        dx,
        lift,
        fall: lift + range(rand, 90, 180),
        rotate: range(rand, -320, 320),
        duration: range(rand, 1.1, 1.6),
      };
    });
  }, [count, spread, seed]);

  return (
    <div aria-hidden="true" className="decor absolute" style={{ left: x, top: y, width: 0, height: 0 }}>
      {petals.map((p, i) => (
        <m.span
          key={p.id}
          className="absolute block"
          style={{ width: p.size, left: -p.size / 2, top: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            x: p.dx,
            y: [0, p.lift, p.fall],
            opacity: [0, 1, 1, 0],
            scale: 1,
            rotate: p.rotate,
            rotateY: p.flutter,
          }}
          transition={{
            duration: p.duration,
            ease: [0.2, 0.7, 0.4, 1],
            y: { duration: p.duration, times: [0, 0.4, 1], ease: ['easeOut', 'easeIn'] },
            opacity: { duration: p.duration, times: [0, 0.08, 0.7, 1] },
          }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
        >
          {p.rose ? <RosePetal className="block h-auto w-full" /> : <MarigoldPetal className="block h-auto w-full" />}
        </m.span>
      ))}
    </div>
  );
}
