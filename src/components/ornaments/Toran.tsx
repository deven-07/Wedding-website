import { useId } from 'react';

interface ToranProps {
  /** Number of hanging strands (scales with screen size). */
  strands?: number;
  className?: string;
  /** Paint the mango leaves for a light or dark surface. */
  surface?: 'paper' | 'dark';
}

const STEP = 44;

/**
 * Marigold toran: a rope of blooms with alternating long/short hanging
 * strands, mango leaves between them and gold bead tassels.
 */
export function Toran({ strands = 9, className = '', surface = 'paper' }: ToranProps) {
  const id = useId().replace(/:/g, '');
  const width = strands * STEP;
  const leaf = surface === 'paper' ? '#8A6140' : '#C9A45C';

  return (
    <svg
      viewBox={`0 0 ${width} 76`}
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <g id={`${id}-bloom`}>
          <circle r="7.4" fill="#D88B36" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i / 9) * Math.PI * 2;
            return <circle key={i} cx={(Math.cos(a) * 6).toFixed(2)} cy={(Math.sin(a) * 6).toFixed(2)} r="2.8" fill="#D88B36" />;
          })}
          <circle r="4.4" fill="#C9A45C" />
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i / 6) * Math.PI * 2 + 0.4;
            return <circle key={`i${i}`} cx={(Math.cos(a) * 3).toFixed(2)} cy={(Math.sin(a) * 3).toFixed(2)} r="1.5" fill="#D88B36" />;
          })}
          <circle r="1.4" fill="#8A6140" />
        </g>
        <path id={`${id}-leaf`} d="M0 0c5 6 6 16 0 24-6-8-5-18 0-24z" />
      </defs>

      {/* rope */}
      <path d={`M0 7H${width}`} stroke="#8A6140" strokeWidth="1.4" />

      {Array.from({ length: strands }, (_, i) => {
        const x = i * STEP + STEP / 2;
        const long = i % 2 === 0;
        const blooms = long ? 3 : 2;
        return (
          <g key={i}>
            {/* mango leaves on either side of the strand */}
            <g fill={leaf} opacity=".85">
              <use href={`#${id}-leaf`} transform={`translate(${x - STEP / 2} 9)`} />
              <path d={`M${x - STEP / 2} 10v20`} stroke="#3D101D" strokeWidth=".5" opacity=".35" />
            </g>
            <path d={`M${x} 7v${blooms * 13 + 6}`} stroke="#8A6140" strokeWidth=".8" />
            {Array.from({ length: blooms }, (_, k) => (
              <use key={k} href={`#${id}-bloom`} transform={`translate(${x} ${14 + k * 13}) scale(${1 - k * 0.06})`} />
            ))}
            {/* bead tassel */}
            <circle cx={x} cy={14 + blooms * 13} r="2" fill="#C9A45C" />
            <path d={`M${x - 2.5} ${17 + blooms * 13}h5l-2.5 7z`} fill="#C9A45C" />
          </g>
        );
      })}
      {/* blooms along the rope */}
      {Array.from({ length: strands * 2 + 1 }, (_, i) => (
        <use key={`r${i}`} href={`#${id}-bloom`} transform={`translate(${i * (STEP / 2)} 7) scale(.7)`} />
      ))}
    </svg>
  );
}
