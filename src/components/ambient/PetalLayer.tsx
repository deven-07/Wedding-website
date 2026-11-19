import { useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cssVars, isDesktop } from '../../lib/css';
import { mulberry32, range } from '../../lib/random';
import { MarigoldPetal, RosePetal } from '../ornaments/Petals';

interface PetalLayerProps {
  /** low = opening screen / dark sections, normal = celebratory sections */
  density?: 'low' | 'normal';
  seed?: number;
  className?: string;
}

const COUNTS = {
  low: { mobile: 6, desktop: 10 },
  normal: { mobile: 12, desktop: 25 },
} as const;

/**
 * CSS-animated falling petals (transform only). Never intercepts taps.
 * Pauses automatically through the parent's [data-ambient="paused"].
 * Renders nothing under prefers-reduced-motion.
 */
export function PetalLayer({ density = 'normal', seed = 11, className = '' }: PetalLayerProps) {
  const reduced = useReducedMotion();

  const petals = useMemo(() => {
    const rand = mulberry32(seed);
    const count = COUNTS[density][isDesktop() ? 'desktop' : 'mobile'];
    return Array.from({ length: count }, (_, i) => {
      const dur = range(rand, 11, 20);
      return {
        id: i,
        rose: rand() > 0.45,
        left: range(rand, 2, 96),
        size: range(rand, 11, 19),
        style: cssVars({
          '--dur': `${dur.toFixed(2)}s`,
          // negative delay so petals are already mid-fall on first paint
          '--delay': `${(-rand() * dur).toFixed(2)}s`,
          '--drift': `${range(rand, -60, 60).toFixed(0)}px`,
        }),
        innerStyle: cssVars({
          '--sway': `${range(rand, 14, 36).toFixed(0)}px`,
          '--sway-dur': `${range(rand, 3.2, 5.6).toFixed(2)}s`,
          '--rot-a': `${range(rand, -60, 0).toFixed(0)}deg`,
          '--rot-b': `${range(rand, 30, 120).toFixed(0)}deg`,
        }),
        opacity: range(rand, 0.55, 0.9),
      };
    });
  }, [density, seed]);

  if (reduced) return null;

  return (
    <div aria-hidden="true" className={`decor ambient-only absolute inset-0 overflow-hidden ${className}`}>
      {petals.map((p) => (
        <span key={p.id} className="petal" style={{ ...p.style, left: `${p.left}%`, width: p.size, opacity: p.opacity }}>
          <span className="petal-inner" style={p.innerStyle}>
            {p.rose ? <RosePetal /> : <MarigoldPetal />}
          </span>
        </span>
      ))}
    </div>
  );
}
