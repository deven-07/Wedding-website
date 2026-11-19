import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { coupleName, wedding } from './src/config/wedding';

const publicFile = (p: string) => existsSync(fileURLToPath(new URL(`./public/${p}`, import.meta.url)));

/**
 * Absolute site URL for link previews (WhatsApp/Facebook need absolute image URLs).
 * Set SITE_URL yourself, or let Netlify (URL) / Vercel (VERCEL_PROJECT_PRODUCTION_URL)
 * provide it automatically during their builds.
 */
function resolveSiteUrl(): string {
  const env = process.env;
  const raw =
    env.SITE_URL ?? env.URL ?? (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  return raw.trim().replace(/\/+$/, '');
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Title, description, canonical, Open Graph + Twitter tags — all from wedding.ts. */
function weddingMeta(): Plugin {
  const site = resolveSiteUrl();
  const abs = (path: string) => `${site}${path}`;
  const { title } = wedding.meta;
  const description = wedding.hero.quote;
  const imageAlt = `${coupleName} — ${wedding.meta.dates}`;

  const meta = (attrs: Record<string, string>) => ({ tag: 'meta', attrs, injectTo: 'head' as const });
  return {
    name: 'wedding-meta',
    configResolved(config) {
      if (config.command === 'build') {
        config.logger.info(
          site
            ? `  wedding-meta: link previews use ${site}`
            : '  wedding-meta: SITE_URL not set — og:image is relative (set SITE_URL for reliable WhatsApp previews)',
        );
      }
    },
    transformIndexHtml(html) {
      const tags = [
        meta({ name: 'description', content: description }),
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: title }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: description }),
        meta({ property: 'og:locale', content: 'en_IN' }),
        meta({ property: 'og:image', content: abs('/og-image.jpg') }),
        meta({ property: 'og:image:type', content: 'image/jpeg' }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ property: 'og:image:alt', content: imageAlt }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: description }),
        meta({ name: 'twitter:image', content: abs('/og-image.jpg') }),
        meta({ name: 'twitter:image:alt', content: imageAlt }),
        ...(site
          ? [
              meta({ property: 'og:url', content: `${site}/` }),
              { tag: 'link', attrs: { rel: 'canonical', href: `${site}/` }, injectTo: 'head' as const },
            ]
          : []),
      ];
      return { html: html.replaceAll('%WEDDING_TITLE%', escapeHtml(title)), tags };
    },
  };
}

/**
 * Injects <link rel="preload"> tags for the two fonts visible on the opening
 * screen (Cinzel 500 + Cormorant Garamond 500) using their hashed build names.
 */
function preloadCriticalFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return [];
        return Object.keys(bundle)
          .filter((file) => patterns.some((p) => p.test(file)))
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: `/${file}`,
              crossorigin: '',
            },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}

/**
 * Inlines the (single, ~8 KB gzipped) stylesheet into index.html so the
 * opening screen can paint without waiting on a render-blocking CSS request.
 */
function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle;
        if (!bundle) return html;
        let out = html;
        for (const [file, chunk] of Object.entries(bundle)) {
          if (chunk.type !== 'asset' || !file.endsWith('.css')) continue;
          const link = new RegExp(`<link rel="stylesheet"[^>]*href="/${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`);
          if (!link.test(out)) continue;
          const css = typeof chunk.source === 'string' ? chunk.source : new TextDecoder().decode(chunk.source);
          out = out.replace(link, () => `<style>${css}</style>`);
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- drop the now-unused file from the output
          delete bundle[file];
        }
        return out;
      },
    },
  };
}

export default defineConfig({
  // Optional assets are detected at build time so a missing file never causes a 404.
  define: {
    __HAS_MUSIC__: JSON.stringify(publicFile('audio/wedding-music.mp3')),
    __HAS_GANESHA_IMAGE__: JSON.stringify(publicFile('images/ganesha.png')),
  },
  plugins: [
    react(),
    weddingMeta(),
    inlineCss(),
    preloadCriticalFonts([
      /cinzel-latin-500-normal-[\w-]+\.woff2$/,
      /cormorant-garamond-latin-500-normal-[\w-]+\.woff2$/,
    ]),
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
  },
});
