import type { ReactNode, SVGProps } from 'react';

const C = 200; // centre of the 400 × 400 viewBox

function around(count: number, render: (angle: number, i: number) => ReactNode): ReactNode[] {
  return Array.from({ length: count }, (_, i) => render((360 / count) * i, i));
}

/** Outer ring — 24 lotus petals with inner veins. */
function RingPetals() {
  return (
    <g>
      <circle cx={C} cy={C} r="150" />
      <circle cx={C} cy={C} r="196" strokeDasharray="1 5" />
      {around(24, (a) => (
        <g key={a} transform={`rotate(${a} ${C} ${C})`}>
          <path d="M200 10c11 14 13 27 0 40-13-13-11-26 0-40z" />
          <path d="M200 20c5 8 6 15 0 22-6-7-5-14 0-22z" opacity=".7" />
          <circle cx="200" cy="58" r="1.6" fill="currentColor" stroke="none" />
        </g>
      ))}
    </g>
  );
}

/** Bead ring between double lines. */
function RingBeads() {
  return (
    <g>
      <circle cx={C} cy={C} r="142" />
      <circle cx={C} cy={C} r="126" />
      {around(48, (a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={(C + Math.cos(rad) * 134).toFixed(2)}
            cy={(C + Math.sin(rad) * 134).toFixed(2)}
            r="2.4"
            fill="currentColor"
            stroke="none"
          />
        );
      })}
    </g>
  );
}

/** Paisley (buta) ring. */
function RingPaisley() {
  return (
    <g>
      <circle cx={C} cy={C} r="78" />
      {around(16, (a) => (
        <g key={a} transform={`rotate(${a} ${C} ${C})`}>
          <path d="M200 84c13 9 15 24 5 32-7 5-15 1-14-6 1-6 8-6 9-2" />
          <path d="M196 90c-6 6-6 14-1 20" opacity=".6" />
        </g>
      ))}
    </g>
  );
}

/** Centre — eight-point star rosette. */
function RingStar() {
  return (
    <g>
      {around(8, (a) => (
        <path key={a} transform={`rotate(${a} ${C} ${C})`} d="M200 128l9 42-9 22-9-22z" />
      ))}
      {around(8, (a) => (
        <path key={`s${a}`} transform={`rotate(${a + 22.5} ${C} ${C})`} d="M200 150l5 26-5 12-5-12z" opacity=".7" />
      ))}
      <circle cx={C} cy={C} r="30" />
      <circle cx={C} cy={C} r="18" strokeDasharray="2 3" />
      <circle cx={C} cy={C} r="5" fill="currentColor" stroke="none" />
    </g>
  );
}

const MANDALA_RINGS = [RingPetals, RingBeads, RingPaisley, RingStar] as const;

interface MandalaRingSvgProps {
  index: number;
  className?: string;
  strokeWidth?: number;
}

/** One ring as its own SVG so it can be rotated independently (HTML-level transform). */
export function MandalaRingSvg({ index, className = '', strokeWidth = 1 }: MandalaRingSvgProps) {
  const Ring = MANDALA_RINGS[index];
  if (!Ring) return null;
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Ring />
    </svg>
  );
}

/** Static full mandala (all rings in one SVG). */
export function Mandala({
  className = '',
  strokeWidth = 1,
  ...rest
}: { className?: string; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, 'children' | 'strokeWidth'>) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {MANDALA_RINGS.map((Ring, i) => (
        <Ring key={i} />
      ))}
    </svg>
  );
}
