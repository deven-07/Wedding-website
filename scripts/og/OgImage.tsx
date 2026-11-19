/**
 * 1200 × 630 link-preview (Open Graph) artwork, composed from the site's own
 * ornament components and wedding.ts so it never drifts from the invitation.
 * Rendered to SVG here, rasterised by scripts/generate-assets.mjs.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { wedding } from '../../src/config/wedding';
import { CornerFiligree } from '../../src/components/ornaments/CornerFiligree';
import { Divider } from '../../src/components/ornaments/Divider';
import { GaneshaArt } from '../../src/components/ornaments/GaneshaArt';
import { Mandala } from '../../src/components/ornaments/Mandala';

const W = 1200;
const H = 630;

function Defs() {
  return (
    <defs>
      <radialGradient id="velvet" cx="0.5" cy="0.42" r="0.75">
        <stop offset="0" stopColor="#641B2B" />
        <stop offset="0.55" stopColor="#521624" />
        <stop offset="1" stopColor="#3D101D" />
      </radialGradient>
      <linearGradient id="foil-grad" x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0" stopColor="#8A6140" />
        <stop offset="0.22" stopColor="#C9A45C" />
        <stop offset="0.45" stopColor="#E8D6A3" />
        <stop offset="0.62" stopColor="#C9A45C" />
        <stop offset="1" stopColor="#8A6140" />
      </linearGradient>
      <linearGradient id="foil-grad-paper" x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0" stopColor="#754B36" />
        <stop offset="0.5" stopColor="#C9A45C" />
        <stop offset="1" stopColor="#754B36" />
      </linearGradient>
      <linearGradient id="foil-grad-v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E8D6A3" />
        <stop offset="0.45" stopColor="#C9A45C" />
        <stop offset="1" stopColor="#8A6140" />
      </linearGradient>
      {/* wide foil for the names, spanning the whole line */}
      <linearGradient id="names-foil" gradientUnits="userSpaceOnUse" x1="250" y1="300" x2="950" y2="380">
        <stop offset="0" stopColor="#A67F4C" />
        <stop offset="0.25" stopColor="#E8D6A3" />
        <stop offset="0.45" stopColor="#C9A45C" />
        <stop offset="0.7" stopColor="#E8D6A3" />
        <stop offset="1" stopColor="#A67F4C" />
      </linearGradient>
      <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#E8D6A3" stopOpacity="0.35" />
        <stop offset="1" stopColor="#E8D6A3" stopOpacity="0" />
      </radialGradient>
      <pattern id="damask" width="112" height="112" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#C9A45C" strokeWidth="0.9">
          <path d="M56 10c10 13 12 25 0 38C44 35 46 23 56 10zM56 102c-10-13-12-25 0-38 12 13 10 25 0 38zM10 56c13-10 25-12 38 0-13 12-25 10-38 0zM102 56c-13 10-25 12-38 0 13-12 25-10 38 0z" />
          <circle cx="56" cy="56" r="5" />
        </g>
      </pattern>
    </defs>
  );
}

function Corner({ x, y, sx, sy }: { x: number; y: number; sx: 1 | -1; sy: 1 | -1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} ${sy})`}>
      <CornerFiligree corner="tl" width={92} height={92} />
    </g>
  );
}

/**
 * @param invocationMarkup the invocation as pre-shaped vector glyph paths
 *   (HarfBuzz, see generate-assets.mjs) — resvg mis-shapes some Devanagari
 *   conjuncts and cannot mix fonts within one <text>.
 */
function OgImage({ invocationMarkup }: { invocationMarkup: string }) {
  const cx = W / 2;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs />
      <rect width={W} height={H} fill="url(#velvet)" />
      <rect width={W} height={H} fill="url(#damask)" opacity="0.06" />

      {/* faint mandala behind the names */}
      <g opacity="0.1" color="#C9A45C">
        <Mandala x={cx - 330} y={H / 2 - 330} width={660} height={660} strokeWidth={1.2} />
      </g>
      <ellipse cx={cx} cy={118} rx={110} ry={90} fill="url(#glow)" />

      {/* gold double border + corners */}
      <rect x="22" y="22" width={W - 44} height={H - 44} fill="none" stroke="url(#foil-grad)" strokeWidth="3" />
      <rect x="34" y="34" width={W - 68} height={H - 68} fill="none" stroke="#C9A45C" strokeOpacity="0.55" strokeWidth="1.2" />
      <Corner x={30} y={30} sx={1} sy={1} />
      <Corner x={W - 30} y={30} sx={-1} sy={1} />
      <Corner x={30} y={H - 30} sx={1} sy={-1} />
      <Corner x={W - 30} y={H - 30} sx={-1} sy={-1} />

      {/* Ganesha */}
      <GaneshaArt paint="url(#foil-grad-v)" x={cx - 62} y={52} width={124} height={132} />

      {/* invocation (pre-shaped glyph paths) */}
      <g fill="#E8D6A3" dangerouslySetInnerHTML={{ __html: invocationMarkup }} />

      {/* DEVEN Weds ADITI */}
      <text x={cx} y={372} textAnchor="middle" fontFamily="Cormorant Garamond" fontWeight="500" fontSize="112" letterSpacing="16" fill="url(#names-foil)">
        <tspan>{wedding.groom}</tspan>
        <tspan fontStyle="italic" fontWeight="500" fontSize="100" letterSpacing="0" fill="#E8D6A3" dx="4" dy="0">
          {` ${wedding.joiner} `}
        </tspan>
        <tspan dx="4" dy="0">
          {wedding.bride}
        </tspan>
      </text>

      <Divider x={cx - 210} y={410} width={420} height={32} />

      {/* dates */}
      <text x={cx} y={500} textAnchor="middle" fontFamily="Cinzel" fontWeight="500" fontSize="38" letterSpacing="7" fill="#C9A45C">
        {wedding.meta.dates}
      </text>
      <text x={cx} y={552} textAnchor="middle" fontFamily="Cormorant Garamond" fontStyle="italic" fontSize="27" fill="#E8D6A3" opacity="0.92">
        {wedding.hero.quote}
      </text>
    </svg>
  );
}

/** The link-preview artwork as an SVG string. */
export function renderOgSvg(invocationMarkup: string): string {
  return renderToStaticMarkup(<OgImage invocationMarkup={invocationMarkup} />);
}

/** The invocation text, for the generator to shape. */
export const INVOCATION = wedding.invocation;

/** The venue map link, for the QR code. */
export const VENUE_MAP_URL = wedding.venue.mapUrl;
