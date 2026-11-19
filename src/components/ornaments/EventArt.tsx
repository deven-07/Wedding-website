import { useId } from 'react';
import { a11yProps, type OrnamentProps } from './types';

/* ---------------------------------------------------------------------- */
/* Shared bits                                                            */
/* ---------------------------------------------------------------------- */

function Bloom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="9" fill="#D88B36" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={(Math.cos(a) * 7.4).toFixed(2)} cy={(Math.sin(a) * 7.4).toFixed(2)} r="3.2" fill="#D88B36" />;
      })}
      <circle r="5.4" fill="#C9A45C" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return <circle key={`i${i}`} cx={(Math.cos(a) * 3.6).toFixed(2)} cy={(Math.sin(a) * 3.6).toFixed(2)} r="1.7" fill="#D88B36" />;
      })}
      <circle r="1.6" fill="#8A6140" />
    </g>
  );
}

/** Spinning paper pinwheel (phirki) on a stick. */
function Pinwheel({ x, y, s = 1, reverse = false }: { x: number; y: number; s?: number; reverse?: boolean }) {
  const colours = ['#D88B36', '#641B2B', '#C9A45C', '#D88B36'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 2v46" stroke="#8A6140" strokeWidth="2" strokeLinecap="round" />
      <g className={reverse ? 'anim-spin-pin-rev' : 'anim-spin-pin'} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {colours.map((c, i) => (
          <path key={i} d="M0 0V-16Q11-13 0 0z" fill={c} transform={`rotate(${i * 90})`} />
        ))}
        <circle r="16.5" fill="none" />
      </g>
      <circle r="2.2" fill="#FFF8E9" stroke="#8A6140" strokeWidth=".8" />
    </g>
  );
}

/* ---------------------------------------------------------------------- */
/* Haldi-Carnival — a sunny fair: rising sun, pinwheels, turmeric urli    */
/* ---------------------------------------------------------------------- */

export function CarnivalArt({ title, className = '', ...rest }: OrnamentProps) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 240 150" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={`${id}-sun`} cx=".5" cy=".55" r=".55">
          <stop offset="0" stopColor="#FFF8E9" />
          <stop offset=".45" stopColor="#E8D6A3" />
          <stop offset="1" stopColor="#D88B36" />
        </radialGradient>
        <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8D6A3" />
          <stop offset=".4" stopColor="#C9A45C" />
          <stop offset="1" stopColor="#754B36" />
        </linearGradient>
      </defs>

      {/* sun with slowly turning rays */}
      <g className="anim-spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '60s' }}>
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M120 18l2.6 18h-5.2z" fill="#D88B36" opacity=".55" transform={`rotate(${i * 20} 120 66)`} />
        ))}
        <circle cx="120" cy="66" r="54" fill="none" />
      </g>
      <circle cx="120" cy="66" r="27" fill={`url(#${id}-sun)`} />

      {/* pinwheels */}
      <Pinwheel x={40} y={70} s={1.1} />
      <Pinwheel x={202} y={64} s={0.95} reverse />

      {/* urli of turmeric paste */}
      <path d="M62 100c5 26 30 38 58 38s53-12 58-38z" fill={`url(#${id}-brass)`} />
      <ellipse cx="120" cy="100" rx="60" ry="10" fill="#8A6140" />
      <ellipse cx="120" cy="99" rx="54" ry="7.5" fill="#D88B36" />
      <path d="M104 99c5-3 11-1 8 2-4 3-14 0-11-4 5-5 20-3 19 3" fill="none" stroke="#8A6140" strokeWidth="1" strokeLinecap="round" opacity=".8" />
      <path d="M106 136h28l-4 8h-20z" fill="#754B36" />
      <Bloom x={74} y={94} s={0.8} />
      <Bloom x={166} y={94} s={0.8} />
      <Bloom x={140} y={92} s={0.6} />

      {/* confetti */}
      <g>
        {[
          [18, 30, '#641B2B', 20],
          [64, 22, '#D88B36', -30],
          [176, 20, '#641B2B', 40],
          [224, 34, '#C9A45C', -15],
          [12, 112, '#D88B36', 60],
          [228, 116, '#641B2B', -45],
          [92, 40, '#C9A45C', 10],
          [150, 34, '#D88B36', -60],
        ].map(([x, y, c, r], i) => (
          <rect key={i} x={x as number} y={y as number} width="6" height="3" rx="1" fill={c as string} transform={`rotate(${r as number} ${x as number} ${y as number})`} />
        ))}
        {[
          [30, 52, '#C9A45C'],
          [210, 92, '#D88B36'],
          [84, 12, '#641B2B'],
          [160, 50, '#641B2B'],
          [196, 14, '#C9A45C'],
        ].map(([x, y, c], i) => (
          <circle key={`d${i}`} cx={x as number} cy={y as number} r="2" fill={c as string} />
        ))}
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reception — an evening of light: crescent moon, chandelier, stars      */
/* ---------------------------------------------------------------------- */

function Star({ x, y, s = 1, delay = '0s' }: { x: number; y: number; s?: number; delay?: string }) {
  return (
    <path
      d="M0-6c.5 4 2 5.5 6 6-4 .5-5.5 2-6 6-.5-4-2-5.5-6-6 4-.5 5.5-2 6-6z"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="#E8D6A3"
      className="anim-twinkle"
      style={{ animationDelay: delay }}
    />
  );
}

export function NightArt({ title, className = '', ...rest }: OrnamentProps) {
  const drops = (cx: number, cy: number, rx: number, ry: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const t = Math.PI * (i / (n - 1));
      const x = cx - rx * Math.cos(t);
      const y = cy + ry * Math.sin(t);
      return (
        <g key={i}>
          <path d={`M${x.toFixed(1)} ${y.toFixed(1)}v6`} stroke="#C9A45C" strokeWidth=".5" />
          <path d={`M${x.toFixed(1)} ${(y + 6).toFixed(1)}l2 3-2 4-2-4z`} fill="#E8D6A3" />
        </g>
      );
    });
  const candles = [80, 100, 120, 140, 160];
  return (
    <svg viewBox="0 0 240 150" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      {/* crescent moon */}
      <path d="M206 14a17 17 0 1 0 13 30 14 14 0 1 1-13-30z" fill="#E8D6A3" />
      <circle cx="209" cy="30" r="24" fill="#E8D6A3" opacity=".08" />
      {/* stars */}
      <Star x={22} y={22} s={0.9} />
      <Star x={48} y={46} s={0.6} delay="-1.2s" />
      <Star x={178} y={18} s={0.7} delay="-0.6s" />
      <Star x={226} y={70} s={0.6} delay="-2s" />
      <Star x={16} y={84} s={0.7} delay="-1.6s" />
      <g fill="#E8D6A3" opacity=".6">
        <circle cx="36" cy="10" r=".9" />
        <circle cx="70" cy="22" r=".8" />
        <circle cx="160" cy="36" r=".8" />
        <circle cx="192" cy="58" r=".9" />
        <circle cx="10" cy="54" r=".8" />
      </g>

      {/* chandelier */}
      <g fill="none" stroke="url(#foil-grad)" strokeLinecap="round">
        <path d="M120 0v26" strokeWidth="1.2" />
        <path d="M120 26v46" strokeWidth="1.6" />
        <path d="M96 44q24 14 48 0" strokeWidth="1.3" />
        <path d="M74 64q46 26 92 0" strokeWidth="1.5" />
        <path d="M120 40c-10 0-16 4-20 6M120 40c10 0 16 4 20 6M120 56c-20 0-36 4-44 9M120 56c20 0 36 4 44 9" strokeWidth=".9" />
      </g>
      <ellipse cx="120" cy="27" rx="7" ry="3" fill="#C9A45C" />
      <circle cx="120" cy="74" r="3" fill="#C9A45C" />
      <path d="M120 77l3 5-3 6-3-6z" fill="#E8D6A3" />
      {drops(120, 44, 24, 7, 7)}
      {drops(120, 64, 46, 13, 9)}
      {/* candle lights */}
      {candles.map((x, i) => {
        const y = 64 + Math.sin(Math.PI * ((x - 74) / 92)) * 13 - 6;
        return (
          <g key={x}>
            <circle
              cx={x}
              cy={y - 4}
              r="7"
              fill="#D88B36"
              opacity=".35"
              className="anim-breathe"
              style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: `${i * -0.5}s`, animationDuration: '2.4s' }}
            />
            <rect x={x - 1.6} y={y - 1} width="3.2" height="6" rx=".8" fill="#FFF8E9" />
            <path d={`M${x} ${y - 7}c1.6 2.4 1.6 4 0 5.4-1.6-1.4-1.6-3 0-5.4z`} fill="#E8D6A3" />
          </g>
        );
      })}

      {/* string lights draped below */}
      <path d="M0 104q60 30 120 6t120-6" fill="none" stroke="#C9A45C" strokeWidth=".7" opacity=".7" />
      {Array.from({ length: 13 }, (_, i) => {
        // points along the two quadratic segments of the wire above
        const u = (i + 0.5) / 13;
        type Pt = [number, number];
        const [p0, c, p1]: [Pt, Pt, Pt] = u < 0.5 ? [[0, 104], [60, 134], [120, 110]] : [[120, 110], [180, 86], [240, 104]];
        const t = u < 0.5 ? u * 2 : u * 2 - 1;
        const q = (k: 0 | 1) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * c[k] + t ** 2 * p1[k];
        const x = q(0);
        const y = q(1);
        return (
          <circle
            key={i}
            cx={x.toFixed(1)}
            cy={(y + 2).toFixed(1)}
            r="2"
            fill={i % 3 === 0 ? '#D88B36' : '#E8D6A3'}
            className="anim-twinkle"
            style={{ animationDelay: `${(i * -0.37).toFixed(2)}s` }}
          />
        );
      })}

      {/* skyline of domes — the evening venue */}
      <g fill="#C9A45C" opacity=".14">
        <path d="M30 150v-14h12v-6c0-6 5-10 9-11 4 1 9 5 9 11v6h12v14z" />
        <path d="M168 150v-12h10c0-8 6-14 12-16 6 2 12 8 12 16h10v12z" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Baarat Prasthan — the groom's horse, dhol & shehnai (on ivory)        */
/* ---------------------------------------------------------------------- */

export function BaaratArt({ title, className = '', ...rest }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 160" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      {/* far legs (behind the body) */}
      <g fill="#754B36">
        <path d="M168 104l-5 20-2 18 3 4h-9l1-4 2-20 2-18z" />
        <path d="M118 104l2 20 4 18 2 4h-9v-4l-4-18-1-20z" />
      </g>
      {/* flowing tail */}
      <path d="M188 66c16 4 22 26 16 56-4-10-8-22-16-36z" fill="url(#foil-grad-paper)" />
      <path d="M192 74c8 8 10 22 8 38M190 80c4 8 6 18 5 28" fill="none" stroke="#754B36" strokeWidth=".8" opacity=".6" />
      {/* body — side profile facing left: wedge head, long arched neck, slender legs */}
      <path
        d="M44 59c-1-4 1-9 5-14 4-6 9-13 13-19l2-13 4 9 4-8v10c12 2 24 14 32 26 4 6 8 9 14 10 14 3 30 3 44-1 14-3 26 3 28 17 1 10-1 18-5 24-1 8 1 16 4 22l-2 20 3 4h-10v-4l-1-18c-3-8-7-16-13-20-16 2-38 2-54 0l-4 20-1 18 3 4h-10v-4l1-18-1-28c-4-8-8-16-14-24-6-6-12-8-18-6-5 1-10 0-13-2-2-1-3-3-3-5z"
        fill="url(#foil-grad-paper)"
      />
      {/* mane along the crest */}
      <path d="M66 22c12 2 26 12 36 26 4 6 8 10 12 11-10 0-20-8-28-16-6-8-12-14-20-21z" fill="#641B2B" opacity=".6" />
      {/* eye, nostril, bridle */}
      <circle cx="57" cy="35" r="1.5" fill="#3D101D" />
      <circle cx="47.5" cy="55" r="1" fill="#3D101D" opacity=".7" />
      <g fill="none" stroke="#641B2B" strokeWidth="1.3" strokeLinecap="round">
        <path d="M47 49l19-22M47 52c4 3 8 5 10 9" />
      </g>
      {/* kalangi plume on the poll */}
      <g fill="none" stroke="#D88B36" strokeWidth="1.4" strokeLinecap="round">
        <path d="M68 13c-2-6 0-10 5-12M68 13c3-4 7-5 12-5M68 13c-4-3-9-3-13-1" />
      </g>
      <g fill="#E8D6A3" stroke="#8A6140" strokeWidth=".5">
        <circle cx="73.5" cy="1.5" r="1.8" />
        <circle cx="80.5" cy="8" r="1.8" />
        <circle cx="55" cy="12" r="1.8" />
      </g>
      {/* necklace beads across the neck */}
      <g fill="#641B2B">
        {Array.from({ length: 8 }, (_, i) => {
          const t = i / 7;
          const x = 80 + t * 12 - Math.sin(t * Math.PI) * 3;
          const y = 40 + t * 34;
          return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.7" />;
        })}
      </g>
      {/* saddle cloth (jhool) with jhalar tassels */}
      <path d="M118 62c16 4 34 4 48-1l2 35c-16 7-36 7-50 2z" fill="#641B2B" stroke="#C9A45C" strokeWidth="1" />
      <path d="M123 68c12 3 26 3 38-1l1 22c-12 5-28 5-39 1z" fill="none" stroke="#C9A45C" strokeWidth=".8" strokeDasharray="2 2" />
      <circle cx="143" cy="80" r="5" fill="none" stroke="#C9A45C" strokeWidth="1" />
      <circle cx="143" cy="80" r="1.8" fill="#C9A45C" />
      <g fill="#C9A45C">
        {Array.from({ length: 8 }, (_, i) => {
          const x = 119 + i * 7;
          const y = 97 + Math.sin((i / 7) * Math.PI) * 3;
          return <path key={i} d={`M${x} ${y.toFixed(1)}l2.4 6h-4.8z`} />;
        })}
      </g>
      {/* anklet bells */}
      <g fill="#641B2B">
        <circle cx="102" cy="138" r="1.3" />
        <circle cx="106" cy="138" r="1.3" />
        <circle cx="181" cy="138" r="1.3" />
        <circle cx="185" cy="138" r="1.3" />
      </g>
      {/* ground line */}
      <path d="M60 148h150" stroke="#8A6140" strokeWidth=".8" opacity=".6" />
      {/* dhol */}
      <g transform="translate(14 112)">
        <rect x="0" y="4" width="40" height="26" rx="8" fill="#641B2B" stroke="#C9A45C" strokeWidth="1.1" />
        <ellipse cx="2" cy="17" rx="4" ry="13" fill="#E8D6A3" stroke="#C9A45C" />
        <ellipse cx="38" cy="17" rx="4" ry="13" fill="#E8D6A3" stroke="#C9A45C" />
        <path d="M5 6l8 22 8-22 8 22 8-22" fill="none" stroke="#C9A45C" strokeWidth=".8" />
        <path d="M44 0l-6 8M-4 2l6 6" stroke="#C9A45C" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* shehnai */}
      <g transform="translate(206 104) rotate(32)">
        <path d="M0 0l3 40h4l3-40z" fill="url(#foil-grad-paper)" />
        <path d="M-4 40c2-2 16-2 18 0l-2 8h-14z" fill="url(#foil-grad-paper)" />
        <g fill="#641B2B">
          <circle cx="5" cy="12" r="1" />
          <circle cx="5" cy="19" r="1" />
          <circle cx="5" cy="26" r="1" />
        </g>
        <path d="M5 0v-6" stroke="#C9A45C" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
