/**
 * Self-hosted fonts (Latin subsets only — keeps payload small).
 * Cinzel 500 + Cormorant Garamond 500 are also preloaded (see vite.config.ts).
 */
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/cinzel/latin-500.css';
import '@fontsource/cinzel/latin-600.css';
import '@fontsource/cinzel-decorative/latin-700.css';
import '@fontsource/lato/latin-400.css';
import '@fontsource/lato/latin-700.css';
// Tiro Devanagari Sanskrit is subset to the invocation glyphs only
// (see scripts/subset-devanagari.mjs) and declared in globals.css.
