import { FOIL, type Tone } from './types';

/** Points along a half-ellipse from left spring point to right spring point. */
function archPoints(cx: number, baseY: number, rx: number, ry: number, n: number) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = Math.PI - (i / n) * Math.PI;
    return [cx + rx * Math.cos(t), baseY - ry * Math.sin(t)] as const;
  });
}

/** Multi-foil (cusped) arch: each lobe bulges outward, cusps point inward. */
function cuspedArch(cx: number, baseY: number, rx: number, ry: number, lobes: number, bulge = 0.62) {
  const pts = archPoints(cx, baseY, rx, ry, lobes);
  const first = pts[0];
  if (!first) return '';
  let d = `M${first[0].toFixed(1)} ${first[1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const p = pts[i];
    if (!prev || !p) continue;
    const chord = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    const r = chord * bulge;
    d += ` A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  }
  return d;
}

const OUTER = cuspedArch(200, 168, 172, 128, 9);
const INNER = cuspedArch(200, 168, 158, 114, 9, 0.6);

interface JharokhaCrownProps {
  tone?: Tone;
  className?: string;
}

/**
 * Crown of a Rajasthani jharokha: cusped arch with chhatri finial, spandrel
 * florals and lotus capitals. The pillars are drawn separately (CSS) so the
 * frame can stretch to any content height.
 */
export function JharokhaCrown({ tone = 'paper', className = '' }: JharokhaCrownProps) {
  const paint = FOIL[tone];
  return (
    <svg viewBox="0 -34 400 206" aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
        {/* frame */}
        <path d="M14 172V12h372v160" strokeWidth="1.6" />
        <path d="M22 172V20h356v152" strokeWidth=".7" />
        {/* arch */}
        <path d={OUTER} strokeWidth="1.8" />
        <path d={INNER} strokeWidth=".8" opacity=".8" />
        {/* spandrel florals */}
        <path d="M40 34c18 2 30 12 34 28-12-6-24-8-34-4 6-8 6-16 0-24z" strokeWidth="1" />
        <path d="M360 34c-18 2-30 12-34 28 12-6 24-8 34-4-6-8-6-16 0-24z" strokeWidth="1" />
        <path d="M52 92c-6-12-2-26 10-32M348 92c6-12 2-26-10-32" strokeWidth=".9" />
        <path d="M96 30c10-6 22-6 30 2M304 30c-10-6-22-6-30 2" strokeWidth=".9" />
        {/* chhatri finial above the frame */}
        <path d="M170 12c2-16 14-26 30-28 16 2 28 12 30 28" strokeWidth="1.4" />
        <path d="M182 12c1-10 8-17 18-18 10 1 17 8 18 18" strokeWidth=".8" />
        <path d="M200-16v-12" strokeWidth="1.2" />
        <path d="M160 12h80" strokeWidth="1.4" />
      </g>
      <g fill={paint}>
        <circle cx="200" cy="-30" r="2.6" />
        <circle cx="200" cy="-20" r="1.6" />
        <circle cx="62" cy="58" r="2" />
        <circle cx="338" cy="58" r="2" />
        <circle cx="200" cy="54" r="2.4" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={152 + i * 16} cy="4" r="1.3" />
        ))}
        {/* lotus capitals */}
        <path d="M6 172c4-8 10-12 16-12s12 4 16 12z" opacity=".9" />
        <path d="M362 172c4-8 10-12 16-12s12 4 16 12z" opacity=".9" />
      </g>
    </svg>
  );
}

/** Pillar base — small plinth with lotus. */
export function JharokhaBase({ tone = 'paper', className = '' }: JharokhaCrownProps) {
  const paint = FOIL[tone];
  return (
    <svg viewBox="0 0 400 30" aria-hidden="true" focusable="false" className={className}>
      <g fill="none" stroke={paint} strokeLinecap="round">
        <path d="M6 4h388M14 12h372" strokeWidth="1.2" />
        <path d="M2 22h396" strokeWidth=".7" />
      </g>
      <g fill={paint}>
        <path d="M184 12c4-7 10-10 16-10s12 3 16 10z" />
        <circle cx="160" cy="12" r="1.4" />
        <circle cx="240" cy="12" r="1.4" />
      </g>
    </svg>
  );
}
