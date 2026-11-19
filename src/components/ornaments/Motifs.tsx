import { a11yProps, FOIL, type OrnamentProps, type Tone } from './types';

interface MotifProps extends OrnamentProps {
  tone?: Tone;
}

/** Seven-petal frontal lotus. */
export function Lotus({ tone = 'dark', title, className = '', ...rest }: MotifProps) {
  const paint = FOIL[tone];
  return (
    <svg viewBox="0 0 80 52" className={className} {...a11yProps(title)} {...rest}>
      <g fill="none" stroke={paint} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M40 4c8 10 9 24 0 36-9-12-8-26 0-36z" />
        <path d="M40 40C32 34 26 24 25 12c9 4 14 14 15 28z" />
        <path d="M40 40c8-6 14-16 15-28-9 4-14 14-15 28z" />
        <path d="M40 42C28 40 17 32 11 20c11 1 21 9 29 22z" />
        <path d="M40 42c12-2 23-10 29-22-11 1-21 9-29 22z" />
        <path d="M40 44C26 46 12 42 3 32c12-3 26 1 37 12z" />
        <path d="M40 44c14 2 28-2 37-12-12-3-26 1-37 12z" />
        <path d="M22 48h36" />
      </g>
    </svg>
  );
}

/** Paisley (buta) with inner scroll and dotted outline. */
export function Paisley({ tone = 'dark', title, className = '', ...rest }: MotifProps) {
  const paint = FOIL[tone];
  return (
    <svg viewBox="0 0 60 90" className={className} {...a11yProps(title)} {...rest}>
      <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 86C12 82 4 66 8 50 12 34 28 26 40 30c12 4 14 20 4 26-8 5-16-2-12-8 3-4 8-2 8 1" strokeWidth="1.4" />
        <path d="M30 80C17 76 11 64 14 52s15-18 24-15" strokeWidth=".8" strokeDasharray="1 3.5" />
        <path d="M38 30C40 18 48 8 56 4" strokeWidth="1.2" />
        <path d="M20 66c4-6 10-8 16-6M18 56c3-5 8-7 13-6" strokeWidth=".8" opacity=".8" />
      </g>
      <g fill={paint}>
        <circle cx="56" cy="4" r="2" />
        <circle cx="25" cy="72" r="1.6" />
      </g>
    </svg>
  );
}
