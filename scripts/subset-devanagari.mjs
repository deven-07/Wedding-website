/**
 * Subsets Tiro Devanagari Sanskrit to only the glyphs used by the invocation
 * in src/config/wedding.ts (the full Devanagari file is ~184 KB).
 * Run: node scripts/subset-devanagari.mjs   (re-run if the invocation changes)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = fileURLToPath(new URL('..', import.meta.url));
const config = await readFile(`${root}src/config/wedding.ts`, 'utf8');
const match = /invocation:\s*"([^"]+)"/.exec(config);
if (!match) throw new Error('Could not find `invocation` in wedding.ts');

// invocation glyphs + ॐ/॥ (lotus medallion fallback) + dotted circle for shaping
const text = `${match[1]} ॐ॥◌‌‍`;

const fontDir = `${root}node_modules/@fontsource/tiro-devanagari-sanskrit/files/`;
const [deva, latin] = await Promise.all([
  readFile(`${fontDir}tiro-devanagari-sanskrit-devanagari-400-normal.woff2`),
  readFile(`${fontDir}tiro-devanagari-sanskrit-latin-400-normal.woff2`),
]);

const devaSubset = await subsetFont(deva, text, { targetFormat: 'woff2' });
const latinSubset = await subsetFont(latin, '| ', { targetFormat: 'woff2' });

await writeFile(`${root}src/assets/fonts/tiro-invocation-deva.woff2`, devaSubset);
await writeFile(`${root}src/assets/fonts/tiro-invocation-latin.woff2`, latinSubset);
console.log(`Devanagari subset: ${devaSubset.length} bytes, Latin subset: ${latinSubset.length} bytes`);
