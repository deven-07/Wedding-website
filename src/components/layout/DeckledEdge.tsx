import { useMemo } from 'react';

interface DeckledEdgeProps {
  /** Which edge of the parent section this sits on. */
  position: 'top' | 'bottom';
  /** Paper colour of the section the edge belongs to. */
  color?: 'ivory' | 'cream';
  seed?: number;
}

const COLORS = { ivory: '#FFF8E9', cream: '#F5EBD8' } as const;

/** Deterministic pseudo-random generator so the edge is stable across renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Soft hand-torn paper edge. It overhangs the neighbouring section by its own
 * height so paper appears laid over velvet.
 */
export function DeckledEdge({ position, color = 'ivory', seed = 7 }: DeckledEdgeProps) {
  const d = useMemo(() => {
    const rand = mulberry32(seed);
    const width = 1200;
    const steps = 140;
    let path = 'M0 0';
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = 5 + rand() * 7 + Math.sin(i * 0.37) * 1.6;
      path += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return `${path} L${width} 0 Z`;
  }, [seed]);

  const isTop = position === 'top';
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1200 16"
      preserveAspectRatio="none"
      className={`decor absolute left-0 z-10 h-3 w-full sm:h-4 ${isTop ? 'bottom-full' : 'top-full'}`}
      style={{
        transform: isTop ? 'scaleY(-1)' : undefined,
        filter: 'drop-shadow(0 2px 2px rgb(61 16 29 / 0.25))',
      }}
    >
      <path d={d} fill={COLORS[color]} />
    </svg>
  );
}
