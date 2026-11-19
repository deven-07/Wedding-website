import { useId, type CSSProperties } from 'react';
import { a11yProps, type OrnamentProps } from './types';

interface LotusBloomProps extends OrnamentProps {
  /** Bud (false) or fully opened flower (true). Petals unfold between the two. */
  open?: boolean;
  /** Soft golden halo behind the open flower. */
  glow?: boolean;
  /** 'dark' for velvet backgrounds, 'paper' for ivory (deeper gold for contrast). */
  tone?: 'dark' | 'paper';
}

const BASE = { x: 50, y: 64 };
const FRONT = [-52, -26, 0, 26, 52];
const BACK = [-66, -38, 38, 66];
const EASE = 'cubic-bezier(.22,1,.36,1)';

function petalStyle(angle: number, open: boolean, index: number): CSSProperties {
  // closed: petals cupped tightly together, slightly shorter — a bud
  const deg = open ? angle : angle * 0.1;
  const scale = open ? 1 : 0.86;
  return {
    transformBox: 'view-box',
    transformOrigin: `${BASE.x}px ${BASE.y}px`,
    transform: `rotate(${deg}deg) scale(${scale})`,
    transition: `transform 1.1s ${EASE} ${open ? index * 0.06 : 0}s`,
  };
}

/**
 * A gold lotus that unfolds from bud to bloom — the site's motif for
 * auspicious beginnings and blessings. Petals are individual shapes rotated
 * about the base (transform-only animation).
 */
export function LotusBloom({ open = true, glow = true, tone = 'dark', title, className = '', ...rest }: LotusBloomProps) {
  const id = useId().replace(/:/g, '');
  const front = tone === 'paper' ? 'url(#foil-grad-paper)' : 'url(#foil-grad-v)';
  const back = tone === 'paper' ? '#A67F4C' : '#A67F4C';
  const edge = tone === 'paper' ? '#754B36' : '#E8D6A3';

  return (
    <svg viewBox="0 0 100 80" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="#E8D6A3" stopOpacity=".8" />
          <stop offset=".5" stopColor="#C9A45C" stopOpacity=".25" />
          <stop offset="1" stopColor="#C9A45C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow ? (
        <circle
          cx="50"
          cy="40"
          r="40"
          fill={`url(#${id}-halo)`}
          style={{ opacity: open ? 1 : 0.25, transition: `opacity 1.4s ${EASE}` }}
        />
      ) : null}

      {/* water pads */}
      <g fill={back} opacity=".75">
        <path d="M14 70c10-6 24-7 36-2 12-5 26-4 36 2-12 4-60 4-72 0z" />
      </g>
      <g fill="none" stroke={back} strokeWidth=".8" strokeLinecap="round" opacity=".55">
        <path d="M22 76h20M58 76h20M34 79h32" />
      </g>

      {/* back petals */}
      {BACK.map((a, i) => (
        <path
          key={`b${a}`}
          d="M50 64C37 50 37 27 50 10c13 17 13 40 0 54z"
          fill={back}
          stroke={edge}
          strokeWidth=".5"
          strokeOpacity=".45"
          style={petalStyle(a, open, i)}
        />
      ))}
      {/* front petals */}
      {FRONT.map((a, i) => (
        <g key={`f${a}`} style={petalStyle(a, open, i + 2)}>
          <path d="M50 64C41 52 40 32 50 15c10 17 9 37 0 49z" fill={front} stroke={edge} strokeWidth=".5" strokeOpacity=".5" />
          <path d="M50 60c-1.6-11-1.6-24 0-37" fill="none" stroke="#FFF8E9" strokeWidth=".7" opacity=".35" />
        </g>
      ))}

      {/* stamens, visible once open */}
      <g fill="#FFF8E9" style={{ opacity: open ? 0.9 : 0, transition: `opacity .8s ${EASE} ${open ? 0.6 : 0}s` }}>
        <circle cx="46" cy="44" r="1.3" />
        <circle cx="50" cy="41.5" r="1.5" />
        <circle cx="54" cy="44" r="1.3" />
      </g>
    </svg>
  );
}
