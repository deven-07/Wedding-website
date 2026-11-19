/**
 * Generates the share/link-preview assets into /public:
 *   - og-image.jpg          1200 × 630 Open Graph / WhatsApp preview (< 300 KB)
 *   - apple-touch-icon.png  180 × 180 "D ❀ A" monogram (from public/favicon.svg)
 *   - images/venue-qr.svg   QR code for the venue map link (wedding.venue.mapUrl)
 *
 * The artwork is rendered from the site's own React ornament components
 * (scripts/og/OgImage.tsx) and wedding.ts, then rasterised with resvg using the
 * same self-hosted fonts. Outputs are committed, so the normal build never
 * depends on this script; re-run it after changing names or dates:
 *
 *   npm run assets
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';
import QRCode from 'qrcode';
import { Blob as HbBlob, Buffer as HbBuffer, Face, Font, shape } from 'harfbuzzjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const cache = `${root}node_modules/.cache/wedding-assets/`;
await mkdir(cache, { recursive: true });

/* 1. Fonts: decompress the fontsource WOFF2 files to TTF for resvg -------- */
const fonts = [
  ['cormorant-garamond', 'cormorant-garamond-latin-500-normal'],
  ['cormorant-garamond', 'cormorant-garamond-latin-400-italic'],
  ['cinzel', 'cinzel-latin-500-normal'],
  ['tiro-devanagari-sanskrit', 'tiro-devanagari-sanskrit-devanagari-400-normal'],
  ['tiro-devanagari-sanskrit', 'tiro-devanagari-sanskrit-latin-400-normal'],
];
const fontFiles = [];
const ttfByName = {};
for (const [pkg, file] of fonts) {
  const woff2 = await readFile(`${root}node_modules/@fontsource/${pkg}/files/${file}.woff2`);
  const ttf = await wawoff2.decompress(woff2);
  const out = `${cache}${file}.ttf`;
  await writeFile(out, ttf);
  fontFiles.push(out);
  ttfByName[file] = await readFile(out); // a plain Buffer (HarfBuzz needs an exact-size buffer)
}

/* 2. Render the OG artwork component to an SVG string ------------------- */
const entry = `${cache}og-entry.mjs`;
await build({
  entryPoints: [`${root}scripts/og/OgImage.tsx`],
  outfile: entry,
  bundle: true,
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
  external: ['react', 'react-dom'],
  define: { __HAS_MUSIC__: 'false', __HAS_GANESHA_IMAGE__: 'false' },
  logLevel: 'warning',
});
// the bundle lives inside node_modules/.cache so bare "react" imports resolve
const { renderOgSvg, INVOCATION, VENUE_MAP_URL } = await import(`${pathToFileURL(entry).href}?t=${Date.now()}`);

const resvgOptions = (width) => ({
  fitTo: { mode: 'width', value: width },
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Cormorant Garamond' },
  shapeRendering: 2,
  textRendering: 1,
});
const render = (markup, width) => new Resvg(markup, resvgOptions(width)).render().asPng();

/**
 * Shapes text with HarfBuzz (the engine browsers use) and returns the glyphs
 * as SVG paths. resvg's own shaper mangles some Devanagari conjuncts.
 */
function shapeToPaths(ttf, text, size) {
  const face = new Face(new HbBlob(ttf), 0);
  const font = new Font(face);
  font.setScale(face.upem, face.upem);
  const buffer = new HbBuffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  shape(font, buffer);
  const k = size / face.upem;
  let x = 0;
  let markup = '';
  for (const g of buffer.getGlyphInfosAndPositions()) {
    const d = font.glyphToPath(g.codepoint);
    const gx = (x + (g.xOffset ?? 0)) * k;
    const gy = -(g.yOffset ?? 0) * k;
    if (d) markup += `<path transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${k.toFixed(5)} ${(-k).toFixed(5)})" d="${d}"/>`;
    x += g.xAdvance ?? 0;
  }
  return { markup, width: x * k };
}

// Devanagari words in Tiro, the "||" pipes in Cormorant; centred on the canvas.
const DEVA = 'tiro-devanagari-sanskrit-devanagari-400-normal';
const LATIN = 'cormorant-garamond-latin-500-normal';
const shaped = INVOCATION.split(/\s+/)
  .filter(Boolean)
  .map((word) => (/[ऀ-ॿ]/.test(word) ? shapeToPaths(ttfByName[DEVA], word, 30) : shapeToPaths(ttfByName[LATIN], word, 34)));
const gap = 11;
const total = shaped.reduce((sum, t) => sum + t.width, 0) + gap * (shaped.length - 1);
let cursor = 600 - total / 2;
let invocationMarkup = '';
for (const t of shaped) {
  invocationMarkup += `<g transform="translate(${cursor.toFixed(2)} 232)">${t.markup}</g>`;
  cursor += t.width + gap;
}

const svg = renderOgSvg(invocationMarkup);
await writeFile(`${cache}og-image.svg`, svg);

/* 3. og-image.jpg ------------------------------------------------------- */
const ogPng = render(svg, 1200);
const ogJpg = await sharp(ogPng).jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
await writeFile(`${root}public/og-image.jpg`, ogJpg);
console.log(`og-image.jpg            ${(ogJpg.length / 1024).toFixed(1)} KB`);

/* 4. apple-touch-icon.png (iOS ignores transparency → solid velvet) ------ */
const favicon = await readFile(`${root}public/favicon.svg`, 'utf8');
const iconSvg = favicon.replace('<svg ', '<svg width="64" height="64" ').replace(
  '<circle cx="32" cy="32" r="31" fill="url(#v)"/>',
  '<rect width="64" height="64" fill="url(#v)"/>',
);
const iconPng = await sharp(render(iconSvg, 180)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(`${root}public/apple-touch-icon.png`, iconPng);
console.log(`apple-touch-icon.png    ${(iconPng.length / 1024).toFixed(1)} KB`);

/* 5. images/venue-qr.svg — burgundy on ivory for strong scanning contrast -- */
if (VENUE_MAP_URL) {
  const qr = await QRCode.toString(VENUE_MAP_URL, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 3,
    color: { dark: '#3D101DFF', light: '#FFF8E9FF' },
  });
  await mkdir(`${root}public/images`, { recursive: true });
  await writeFile(`${root}public/images/venue-qr.svg`, qr);
  console.log(`images/venue-qr.svg     ${(qr.length / 1024).toFixed(1)} KB  → ${VENUE_MAP_URL}`);
}
