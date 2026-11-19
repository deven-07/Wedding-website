import { m } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { cssVars } from '../../lib/css';

export type SealState = 'intact' | 'cracking' | 'broken';

/* ---------------------------------------------------------------------- */
/* Geometry                                                               */
/* ---------------------------------------------------------------------- */

/** Irregular poured-wax outline (smoothed bumps around a circle). */
const BLOB = (() => {
  const n = 16;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 44 + Math.sin(i * 2.7) * 2.6 + Math.cos(i * 1.3) * 1.6;
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r] as const;
  });
  const mid = (i: number) => {
    const p = pts[i % n] ?? pts[0];
    const q = pts[(i + 1) % n] ?? pts[0];
    if (!p || !q) return [50, 50] as const;
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] as const;
  };
  const start = mid(n - 1);
  let d = `M${start[0].toFixed(2)} ${start[1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const e = mid(i);
    if (p) d += ` Q${p[0].toFixed(2)} ${p[1].toFixed(2)} ${e[0].toFixed(2)} ${e[1].toFixed(2)}`;
  }
  return `${d}Z`;
})();

const BEADS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  return [50 + Math.cos(a) * 38.2, 50 + Math.sin(a) * 38.2] as const;
});

/** Crack lines radiating from the centre (also the shard boundaries). */
const CRACK = 'M48 0 53 22 46 36 51 49M51 49 64 58 72 74 100 82M51 49 40 62 30 70 0 78';

/** Three shards as CSS polygons (percent of the seal box). */
const SHARDS = [
  { clip: 'polygon(48% 0, 53% 22%, 46% 36%, 51% 49%, 40% 62%, 30% 70%, 0 78%, 0 0)', x: -46, y: 150, r: -55 },
  { clip: 'polygon(48% 0, 100% 0, 100% 82%, 72% 74%, 64% 58%, 51% 49%, 46% 36%, 53% 22%)', x: 52, y: 170, r: 42 },
  { clip: 'polygon(0 78%, 30% 70%, 40% 62%, 51% 49%, 64% 58%, 72% 74%, 100% 82%, 100% 100%, 0 100%)', x: -8, y: 200, r: 16 },
] as const;

/* ---------------------------------------------------------------------- */

function SealArt() {
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden="true" focusable="false">
      <path d={BLOB} fill="url(#seal-wax)" />
      <path d={BLOB} fill="none" stroke="#754B36" strokeWidth=".7" opacity=".55" />
      {/* pressed recess */}
      <circle cx="50" cy="50" r="34.5" fill="url(#seal-press)" />
      <circle cx="50" cy="50" r="34.5" fill="none" stroke="#754B36" strokeWidth="1.1" opacity=".55" />
      <path d="M22 37a31 31 0 0 1 39-21" fill="none" stroke="#E8D6A3" strokeWidth="1" opacity=".5" />
      <circle cx="50" cy="50" r="30.5" fill="none" stroke="#754B36" strokeWidth=".55" opacity=".7" />
      {BEADS.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r=".85" fill="#754B36" opacity=".55" />
      ))}
      {/* monogram D ❀ A — embossed (shadow, highlight, face) */}
      <g fontFamily="Cinzel, 'Cinzel Fallback', Georgia, serif" fontSize="23" fontWeight="600" textAnchor="middle">
        <g fill="#754B36" opacity=".75" transform="translate(.7 .8)">
          <text x="30.5" y="58.2">D</text>
          <text x="69.5" y="58.2">A</text>
        </g>
        <g fill="#E8D6A3" opacity=".7" transform="translate(-.45 -.5)">
          <text x="30.5" y="58.2">D</text>
          <text x="69.5" y="58.2">A</text>
        </g>
        <g fill="#B48E52">
          <text x="30.5" y="58.2">D</text>
          <text x="69.5" y="58.2">A</text>
        </g>
      </g>
      <g transform="translate(50 50)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-3.6" rx="2.1" ry="3.4" transform={`rotate(${a})`} fill="#B48E52" stroke="#754B36" strokeWidth=".45" />
        ))}
        <circle r="1.5" fill="#E8D6A3" stroke="#754B36" strokeWidth=".4" />
      </g>
      {/* specular sheen */}
      <path d="M18 34c4-9 11-15 21-18" fill="none" stroke="#FFF8E9" strokeWidth="2.4" strokeLinecap="round" opacity=".28" />
    </svg>
  );
}

interface WaxSealProps {
  state: SealState;
  onActivate: () => void;
  className?: string;
}

/**
 * Gold wax seal with the "D ❀ A" monogram. Intact it is a button (tap to
 * open); cracking draws hairline cracks; broken splits into three shards
 * that fall away with rotation.
 */
export function WaxSeal({ state, onActivate, className = '' }: WaxSealProps) {
  if (state === 'broken') {
    return (
      <div aria-hidden="true" className={`decor relative ${className}`}>
        {SHARDS.map((s, i) => (
          <m.div
            key={i}
            className="absolute inset-0"
            style={{ clipPath: s.clip, filter: 'drop-shadow(0 4px 6px rgb(61 16 29 / 0.5))' }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: s.x, y: s.y, rotate: s.r, opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, ease: [0.55, 0, 0.9, 0.5], opacity: { duration: 0.5, times: [0, 0.6, 1] } }}
          >
            <SealArt />
          </m.div>
        ))}
        {/* gold flecks */}
        {[-34, -12, 14, 30, 44, -46].map((dx, i) => (
          <m.span
            key={`f${i}`}
            className="absolute left-1/2 top-1/2 block h-1 w-1 rounded-full bg-champagne"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: dx, y: [0, -20 - i * 4, 40 + i * 6], opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      disabled={state !== 'intact'}
      // pointer/touch shortcut only — the "OPEN WEDDING INVITATION" button is the accessible control
      aria-hidden="true"
      tabIndex={-1}
      title={wedding.ui.sealLabel}
      className={`group relative rounded-full ${className}`}
    >
      <span
        aria-hidden="true"
        className="anim-breathe absolute -inset-[35%] rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgb(232 214 163 / 0.45), rgb(201 164 92 / 0.15) 55%, transparent)' }}
      />
      <m.span
        className="relative block h-full w-full"
        style={{ filter: 'drop-shadow(0 5px 7px rgb(61 16 29 / 0.6))' }}
        animate={state === 'cracking' ? { rotate: [0, -3, 3, -2, 0], scale: [1, 1.04, 1] } : { rotate: 0 }}
        whileHover={state === 'intact' ? { scale: 1.06 } : undefined}
        whileTap={state === 'intact' ? { scale: 0.94 } : undefined}
        transition={{ duration: 0.14 }}
      >
        <SealArt />
        {state === 'cracking' ? (
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 h-full w-full">
            <path
              d={CRACK}
              pathLength={1}
              className="draw-in"
              style={cssVars({ '--draw-dur': '0.12s' })}
              fill="none"
              stroke="#3D101D"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
      </m.span>
    </button>
  );
}
