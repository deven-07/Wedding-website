import type { Config } from 'tailwindcss';

/**
 * Design tokens. Only the seven brief colours are used; `gold.deep` and
 * `gold.antique` are precomputed mixes of gold + burgundy (no new hues).
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      /** landscape phones — the opening switches to two columns */
      land: { raw: '(orientation: landscape) and (max-height: 520px)' },
    },
    extend: {
      colors: {
        maroon: '#641B2B',
        burgundy: '#3D101D',
        gold: {
          DEFAULT: '#C9A45C',
          deep: '#8A6140', // gold 55% + burgundy — text-safe gold on ivory (≈5.2:1)
          antique: '#754B36', // gold 40% + burgundy — darkest foil stop
        },
        champagne: '#E8D6A3',
        ivory: '#FFF8E9',
        cream: '#F5EBD8',
        saffron: '#D88B36',
      },
      fontFamily: {
        royal: ['Cinzel', '"Cinzel Fallback"', 'Georgia', 'serif'],
        decorative: ['"Cinzel Decorative"', 'Cinzel', '"Cinzel Fallback"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', '"Cormorant Fallback"', 'Georgia', 'serif'],
        sans: ['Lato', '"Lato Fallback"', 'system-ui', 'sans-serif'],
        deva: ['"Tiro Devanagari Sanskrit"', '"Noto Serif Devanagari"', 'serif'],
      },
      fontSize: {
        names: ['clamp(3rem, 13vw, 7rem)', { lineHeight: '1', letterSpacing: '0.18em' }],
        weds: ['clamp(1.5rem, 5vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '0.04em' }],
        h2: ['clamp(1.375rem, 4.5vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '0.16em' }],
        h3: ['clamp(1.125rem, 4vw, 1.625rem)', { lineHeight: '1.25', letterSpacing: '0.12em' }],
        count: ['clamp(2rem, 9vw, 4rem)', { lineHeight: '1' }],
        invocation: ['clamp(1rem, 3.6vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '0.06em' }],
        quote: ['clamp(1.125rem, 3.8vw, 1.5rem)', { lineHeight: '1.5' }],
        lead: ['clamp(1.0625rem, 3.4vw, 1.3125rem)', { lineHeight: '1.6' }],
        meta: ['clamp(0.875rem, 2.8vw, 1rem)', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        btn: ['clamp(0.8125rem, 2.6vw, 0.9375rem)', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        micro: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      maxWidth: {
        prose: '34rem',
        events: '72rem',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 5vw, 3rem)',
        section: 'clamp(4.5rem, 14vw, 9rem)',
      },
      transitionTimingFunction: {
        royal: 'cubic-bezier(.65,.05,.36,1)',
        silk: 'cubic-bezier(.22,1,.36,1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
