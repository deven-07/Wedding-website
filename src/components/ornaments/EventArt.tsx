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
/* Baarat Prasthan — the groom's ghodi in full finery, under a palace arch */
/* ---------------------------------------------------------------------- */

type Pt = readonly [number, number];

/** Evenly spaced points along a quadratic curve (for bead strands). */
function along(p0: Pt, c: Pt, p1: Pt, n: number): Pt[] {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const q = (k: 0 | 1) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * c[k] + t ** 2 * p1[k];
    return [Number(q(0).toFixed(1)), Number(q(1).toFixed(1))] as const;
  });
}

function Marigold({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r="6" fill="#D88B36" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={(Math.cos(a) * 5).toFixed(2)} cy={(Math.sin(a) * 5).toFixed(2)} r="2.2" fill="#D88B36" />;
      })}
      <circle r="3.4" fill="#C9A45C" />
      <circle r="1.1" fill="#8A6140" />
    </g>
  );
}

const PETALS = [
  [30, 40, 20],
  [52, 18, -30],
  [206, 22, 40],
  [220, 52, -20],
  [40, 86, 60],
  [196, 40, 10],
] as const;

/** Leg outlines (relative), shared by the near and far pairs. */
const LEG_FRONT = 'c2 12 3 20 3 28v16c0 3-1 6-3 9l-1 3h10v-4c0-3 1-5 1-8v-16c1-8 3-16 4-26z';
const LEG_HIND = 'c10 4 18 12 16 26l-5 12v12c0 3 1 6 2 9l1 3h-10v-3c0-3 0-5 0-8v-14c-2-10-6-18-12-24z';
const HEM = 'q-4.33 7-8.67 0'.repeat(6);

export function BaaratArt({ title, className = '', ...rest }: OrnamentProps) {
  const id = useId().replace(/:/g, '');
  const coat = `url(#${id}-coat)`;
  return (
    <svg viewBox="0 0 240 160" className={className} {...a11yProps(title)} {...rest}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={`${id}-coat`} gradientUnits="userSpaceOnUse" x1="95" y1="10" x2="215" y2="150">
          <stop offset="0" stopColor="#F3E6C2" />
          <stop offset=".4" stopColor="#D9B979" />
          <stop offset=".8" stopColor="#B48E58" />
          <stop offset="1" stopColor="#94704A" />
        </linearGradient>
      </defs>

      {/* jharokha arch */}
      <g fill="none" stroke="#C9A45C" opacity=".55">
        <path d="M58 152V78c0-30 30-50 62-62 32 12 62 32 62 62v74" strokeWidth=".8" />
        <path d="M66 152V80c0-26 26-44 54-55 28 11 54 29 54 55v72" strokeWidth=".5" strokeDasharray="1.5 2.5" />
      </g>
      <path d="M120 10l2.5 4-2.5 4-2.5-4z" fill="#C9A45C" opacity=".8" />

      {/* drifting marigold petals */}
      {PETALS.map(([x, y, r], i) => (
        <path
          key={i}
          d={`M${x} ${y}c2-3 5-3 6 0-2 3-5 3-6 0z`}
          fill="#D88B36"
          className="anim-twinkle"
          style={{ animationDelay: `${i * -0.7}s`, animationDuration: '4.5s' }}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}

      <g transform="translate(-32 9) scale(.94)">
        <ellipse cx="164" cy="151" rx="60" ry="3.4" fill="#8A6140" opacity=".2" />
        {/* far legs */}
        <g fill="#A67F4C">
          <path d={`M134 94${LEG_FRONT}`} />
          <path d={`M180 92${LEG_HIND}`} />
        </g>
        {/* tail, tied with a ribbon */}
        <path d="M208 64c12 4 18 18 16 40-1 14-6 24-12 30 2-14 2-30-2-42-2-8-4-14-8-20z" fill="#8A6140" />
        <path d="M213 70c5 8 6 20 4 34M217 78c2 10 2 20 0 30" fill="none" stroke="#C9A45C" strokeWidth=".6" opacity=".7" />
        <path d="M208 66l6-1 2 5-6 2z" fill="#641B2B" />
        {/* body, then the arched neck and head */}
        <path
          d="M150 60c8 4 16 6 24 5 8-1 16-5 24-4 8 1 14 8 14 18 0 10-4 18-12 21-4 1-10 2-16 2-14 0-28 1-42 0-6 0-12-2-16-5-6-4-8-12-6-20z"
          fill={coat}
        />
        <path
          d="M162 64c-4-16-14-36-32-44-4-2-8-2-10-1-2 2-4 4-6 8-4 8-9 16-13 22-2 4-1 7 2 8 3 1 6 0 9-2 3-2 6-5 9-8 2-2 4-3 5-2 1 2 1 6 0 10-2 8-6 16-10 24-2 6 0 14 6 16 8 2 18 0 26-6 8-6 14-14 14-25z"
          fill={coat}
        />
        {/* mane and forelock */}
        <path d="M120 19c14-1 30 14 38 34l4 11c-6-10-12-18-18-24-6-6-14-12-22-16z" fill="#8A6140" />
        <path d="M114 26c2-4 6-6 9-5-2 3-5 5-9 5z" fill="#8A6140" />
        {/* Marwari ears, tips curling in */}
        <g fill={coat} stroke="#A67F4C" strokeWidth=".6">
          <path d="M113 23c-3-6-2-11 2-15 1 5 2 9 2 14z" />
          <path d="M118 21c0-5 1-10-1-14 5 3 7 9 4 14z" />
        </g>
        {/* near legs + hooves */}
        <g fill={coat}>
          <path d={`M122 94${LEG_FRONT}`} />
          <path d={`M192 88${LEG_HIND}`} />
        </g>
        <path d="M121 147h10v3h-10zM133 147h10v3h-10zM196 147h10v3h-10zM182 147h10v3h-10z" fill="#3D101D" opacity=".55" />
        {/* ghungroo anklets */}
        <g fill="#C9A45C">
          <rect x="123.5" y="133" width="8.5" height="2.2" rx="1" />
          <rect x="196" y="133" width="7.5" height="2.2" rx="1" />
        </g>
        <g fill="#641B2B">
          {[125.5, 128, 130.5, 198, 200.5].map((x) => (
            <circle key={x} cx={x} cy="136.6" r=".9" />
          ))}
        </g>
        {/* eye, nostril */}
        <path d="M115 31c2-1.6 4-1.6 5 0-1.6 1.4-3.4 1.4-5 0z" fill="#3D101D" />
        <path d="M114.5 30.4c1-1.4 3.6-2 6-.4" fill="none" stroke="#3D101D" strokeWidth=".5" />
        <path d="M103 49c1 1 1 2.4 0 3" fill="none" stroke="#3D101D" strokeWidth=".9" strokeLinecap="round" opacity=".7" />
        {/* bridle with gold studs and a fringed browband */}
        <path d="M121 22l-14 31M103.5 41.5c3 0 7 4 9.5 8.5M113 24l9 1" fill="none" stroke="#641B2B" strokeWidth="1.4" strokeLinecap="round" />
        <g fill="#C9A45C">
          <circle cx="107.5" cy="45.6" r="1.3" />
          <circle cx="114.4" cy="38.4" r="1.1" />
          <circle cx="117.3" cy="24.6" r="1.1" />
          {[114, 116.5, 119, 121.5].map((x) => (
            <path key={x} d={`M${x} 25.4l1 2.6-1 1.4-1-1.4z`} />
          ))}
        </g>
        {/* kalangi plume */}
        <path d="M118 20c0-4 1-8 3-10" fill="none" stroke="#8A6140" strokeWidth="1" />
        <path d="M121 10c-4-4-4-10 0-14 2 5 2 10 0 14z" fill="#D88B36" />
        <path d="M121 10c0-6 4-10 9-11-2 5-5 9-9 11z" fill="#641B2B" />
        <path d="M121 10c-2-5-7-7-11-6 3 4 7 6 11 6z" fill="#C9A45C" />
        <circle cx="121" cy="10" r="1.8" fill="#E8D6A3" stroke="#8A6140" strokeWidth=".5" />
        {/* neck strands with a pendant */}
        {along([156, 48], [140, 74], [118, 76], 11).map(([x, y]) => (
          <circle key={`g${x}`} cx={x} cy={y} r="1.3" fill="#C9A45C" />
        ))}
        {along([160, 56], [144, 84], [120, 86], 12).map(([x, y]) => (
          <circle key={`m${x}`} cx={x} cy={y} r="1.3" fill="#641B2B" />
        ))}
        <path d="M134 83v2" stroke="#C9A45C" strokeWidth=".6" />
        <path d="M134 85l2.6 3.6-2.6 4.4-2.6-4.4z" fill="#C9A45C" stroke="#8A6140" strokeWidth=".4" />
        {/* jhool — embroidered saddle cloth with a scalloped, tasselled hem */}
        <path d={`M150 60c8 5 18 7 26 6 8-1 16-5 24-5l2 43${HEM}z`} fill="#641B2B" />
        <path d="M154 66c8 4 16 5 22 4 7-1 13-4 20-4l1.5 33c-14 4-30 4-43 1z" fill="none" stroke="#C9A45C" strokeWidth=".8" />
        <path
          d="M156 70c7 3 14 4 20 3 6-1 11-3 17-3l1 26c-12 3-26 3-37 1z"
          fill="none"
          stroke="#C9A45C"
          strokeWidth=".5"
          strokeDasharray="1.2 1.6"
        />
        <g transform="translate(176 84)">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M0-3c2-3 2-6 0-8-2 2-2 5 0 8z" fill="#C9A45C" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="3" fill="#D88B36" />
          <circle r="1.3" fill="#E8D6A3" />
        </g>
        <g fill="#C9A45C" stroke="#C9A45C">
          {Array.from({ length: 7 }, (_, i) => {
            const x = (202 - i * 8.67).toFixed(1);
            return <path key={i} d={`M${x} 104v3M${x} 106.5l1.8 4.5h-3.6z`} strokeWidth=".7" />;
          })}
        </g>
        {/* royal saddle */}
        <path d="M164 64c1-5 6-8 8-8 2 3 10 3 14 0 2 0 6 3 6 7-8-2-20-1-28 1z" fill="#C9A45C" stroke="#8A6140" strokeWidth=".6" />
        <circle cx="172" cy="56.5" r="1.4" fill="#641B2B" />
        <circle cx="186" cy="56.5" r="1.4" fill="#641B2B" />
      </g>

      {/* marigolds strewn on the path */}
      <Marigold x={48} y={146} s={1} />
      <Marigold x={64} y={150} s={0.7} />
      <Marigold x={192} y={148} s={0.9} />
      <Marigold x={210} y={145} s={0.7} />
    </svg>
  );
}
