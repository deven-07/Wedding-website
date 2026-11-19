import { cssVars } from '../../lib/css';
import { FOIL, type Tone } from './types';

interface FlourishProps {
  /** Mirror horizontally (for the right-hand side of the "&"). */
  flip?: boolean;
  tone?: Tone;
  className?: string;
  /** Draw the stroke in (SVG pathLength) with this delay in seconds. */
  drawDelay?: number;
}

const PATH = 'M2 7c9 0 13-5 20-4.6 5 .4 5.4 6 1.4 6.2-3 .2-3-3.6-.4-3.4M22 2.4c8 .2 11 4.2 17 4.6';

/** Small calligraphic flourish that flanks the "&". Optionally draws itself in. */
export function Flourish({ flip = false, tone = 'dark', className = 'h-3 w-10', drawDelay }: FlourishProps) {
  const paint = FOIL[tone];
  return (
    <svg
      viewBox="0 0 42 12"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {drawDelay === undefined ? (
        <path d={PATH} fill="none" stroke={paint} strokeWidth="1.1" strokeLinecap="round" />
      ) : (
        <path
          d={PATH}
          pathLength={1}
          className="draw-in"
          style={cssVars({ '--draw-delay': `${drawDelay}s` })}
          fill="none"
          stroke={paint}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      )}
      <circle cx="40.5" cy="7" r="1.1" fill={paint} />
    </svg>
  );
}
