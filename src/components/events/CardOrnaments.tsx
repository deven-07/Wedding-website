import { useMemo } from 'react';
import { CornerFiligree, type Corner } from '../ornaments/CornerFiligree';
import { Sparkle } from '../ornaments/Sparkle';

/* ---------------------------------------------------------------------- */
/* Haldi (South Indian): mango-leaf thoranam                              */
/* ---------------------------------------------------------------------- */

const LEAF_GREENS = ['#4E6B2C', '#6E8F3E'];

/** A doorway thoranam of mango leaves and marigolds that sways gently. */
export function Thoranam({ leaves = 15, className = '' }: { leaves?: number; className?: string }) {
  const W = 300;
  const items = useMemo(
    () =>
      Array.from({ length: leaves }, (_, i) => {
        const t = (i + 0.5) / leaves;
        const x = t * W;
        // point on the quadratic string M0 4 Q150 30 300 4
        const y = (1 - t) ** 2 * 4 + 2 * (1 - t) * t * 30 + t ** 2 * 4;
        return { x, y, colour: LEAF_GREENS[i % 2] ?? '#4E6B2C', delay: `${(i * -0.27).toFixed(2)}s` };
      }),
    [leaves],
  );
  return (
    <svg viewBox={`0 0 ${W} 48`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" className={className}>
      <path d={`M0 4Q150 30 ${W} 4`} fill="none" stroke="#8A6140" strokeWidth="1.1" />
      {items.map((f, i) => (
        <g key={i} transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`}>
          <g className="anim-bunting" style={{ animationDelay: f.delay, transformBox: 'fill-box' }}>
            <path d="M0 0c-5 5-5 13 0 19 5-6 5-14 0-19z" fill={f.colour} />
            <path d="M0 1v16" stroke="#E8D6A3" strokeWidth=".5" opacity=".6" />
          </g>
          {i < leaves - 1 ? (
            <circle cx={(W / leaves / 2).toFixed(1)} cy="2" r="3" fill={i % 2 ? '#C9A45C' : '#D88B36'} />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reception: art-deco frame, fan crest, twinkling stars                  */
/* ---------------------------------------------------------------------- */

function DecoCorner({ corner }: { corner: Corner }) {
  const flip = { tl: '', tr: 'scale(-1,1)', bl: 'scale(1,-1)', br: 'scale(-1,-1)' }[corner];
  const pos = {
    tl: 'left-2.5 top-2.5',
    tr: 'right-2.5 top-2.5',
    bl: 'left-2.5 bottom-2.5',
    br: 'right-2.5 bottom-2.5',
  }[corner];
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={`absolute h-11 w-11 ${pos}`} style={{ transform: flip }}>
      <g fill="none" stroke="url(#foil-grad)" strokeLinecap="square">
        <path d="M1 44V12L12 1h32" strokeWidth="1.4" />
        <path d="M7 44V15L15 7h29" strokeWidth=".7" />
        <path d="M13 44V18l5-5h26" strokeWidth=".5" opacity=".7" />
      </g>
      <path d="M1 12 12 1" stroke="#E8D6A3" strokeWidth="1" />
      <rect x="18" y="18" width="4" height="4" transform="rotate(45 20 20)" fill="#C9A45C" />
    </svg>
  );
}

/** Thin double gold frame with stepped art-deco corners and a fan crest. */
export function DecoFrame() {
  return (
    <>
      <div className="absolute inset-[10px] border border-gold/60" />
      <div className="absolute inset-[16px] border border-gold/25" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <DecoCorner key={c} corner={c} />
      ))}
      {/* sunburst fan crest on the top edge */}
      <svg viewBox="0 0 80 34" aria-hidden="true" className="absolute left-1/2 top-[10px] h-[34px] w-20 -translate-x-1/2">
        <path d="M6 0a34 34 0 0 0 68 0z" fill="#3D101D" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI * (i / 8);
          return (
            <path
              key={i}
              d={`M40 0L${(40 + Math.cos(a) * 30).toFixed(1)} ${(Math.sin(a) * 30).toFixed(1)}`}
              stroke="url(#foil-grad)"
              strokeWidth=".9"
            />
          );
        })}
        <path d="M10 0a30 30 0 0 0 60 0" fill="none" stroke="url(#foil-grad)" strokeWidth="1.2" />
        <path d="M24 0a16 16 0 0 0 32 0" fill="none" stroke="#C9A45C" strokeWidth=".8" />
        <circle cx="40" cy="1" r="3" fill="#E8D6A3" />
      </svg>
    </>
  );
}

/** A few twinkling sparkles across the night card. */
export function NightSparkles() {
  const stars = [
    { c: 'left-[12%] top-[34%] h-2.5 w-2.5', d: '0s' },
    { c: 'right-[10%] top-[40%] h-2 w-2', d: '-1.1s' },
    { c: 'left-[5%] top-[58%] h-2 w-2', d: '-0.5s' },
    { c: 'right-[5%] top-[52%] h-2.5 w-2.5', d: '-1.8s' },
    { c: 'left-[6%] bottom-[22%] h-2 w-2', d: '-2.2s' },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <Sparkle key={i} fill="#E8D6A3" className={`anim-twinkle absolute ${s.c}`} style={{ animationDelay: s.d }} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* Baarat Prasthan: royal jhalar fringe on ivory                          */
/* ---------------------------------------------------------------------- */

/** A maroon fringe with a gold zig-zag trim, scalloped edge and tassels. */
export function Jhalar({ scallops = 11, className = '' }: { scallops?: number; className?: string }) {
  const W = 300;
  const step = W / scallops;
  let edge = `M0 0H${W}V20`;
  for (let i = scallops; i > 0; i--) {
    const x1 = i * step;
    const x0 = (i - 1) * step;
    edge += `L${x1.toFixed(1)} 20Q${((x0 + x1) / 2).toFixed(1)} 34 ${x0.toFixed(1)} 20`;
  }
  edge += 'Z';
  const zig = Array.from({ length: scallops * 2 + 1 }, (_, i) => `${i === 0 ? 'M' : 'L'}${((i * step) / 2).toFixed(1)} ${i % 2 ? 9 : 14}`).join('');
  return (
    <svg viewBox={`0 0 ${W} 44`} preserveAspectRatio="none" aria-hidden="true" className={className}>
      <path d={edge} fill="#641B2B" />
      <path d={`M0 4H${W}`} stroke="#C9A45C" strokeWidth="1.2" />
      <path d={zig} fill="none" stroke="#C9A45C" strokeWidth="1" />
      <path d={`M0 18H${W}`} stroke="#C9A45C" strokeWidth=".6" opacity=".7" />
      {Array.from({ length: scallops }, (_, i) => {
        const x = (i + 0.5) * step;
        return (
          <g key={i}>
            <path d={`M${x.toFixed(1)} 27v6`} stroke="#C9A45C" strokeWidth=".8" />
            <circle cx={x.toFixed(1)} cy="35" r="2" fill="#C9A45C" />
            <path d={`M${(x - 1.8).toFixed(1)} 37h3.6l-1.8 6z`} fill="#D88B36" />
          </g>
        );
      })}
    </svg>
  );
}

/** Maroon-and-gold double border with filigree corners (ivory royal card). */
export function RoyalBorder() {
  return (
    <>
      <div className="absolute inset-[10px] rounded-[10px] border border-maroon/55" />
      <div className="absolute inset-[15px] rounded-[7px] border border-gold-deep/40" />
      <div className="absolute inset-[13px]">
        {(['bl', 'br'] as const).map((c) => (
          <CornerFiligree key={c} corner={c} placed tone="paper" className="h-10 w-10" />
        ))}
      </div>
    </>
  );
}
