import { a11yProps, FOIL, type OrnamentProps, type Tone } from './types';

interface DividerProps extends OrnamentProps {
  tone?: Tone;
}

/** Tapered gold rule with a lotus centre, diamonds and bead terminals. */
export function Divider({ title, tone = 'dark', className, ...rest }: DividerProps) {
  const paint = FOIL[tone];
  return (
    <svg
      viewBox="0 0 320 24"
      className={className ?? 'mx-auto h-5 w-[min(18rem,70vw)]'}
      fill={paint}
      {...a11yProps(title)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {/* tapered rules */}
      <path d="M144 10.7 22 11.7v.6l122 1z" />
      <path d="M176 10.7 298 11.7v.6l-122 1z" />
      {/* bead terminals */}
      <circle cx="16" cy="12" r="2.4" />
      <circle cx="8.5" cy="12" r="1.4" />
      <circle cx="304" cy="12" r="2.4" />
      <circle cx="311.5" cy="12" r="1.4" />
      {/* diamonds */}
      <path d="m104 8.4 3.6 3.6-3.6 3.6-3.6-3.6z" />
      <path d="m216 8.4 3.6 3.6-3.6 3.6-3.6-3.6z" />
      <circle cx="124" cy="12" r="1.1" />
      <circle cx="196" cy="12" r="1.1" />
      {/* lotus */}
      <path d="M160 1.5c4.2 5 4.6 11 0 16.5-4.6-5.5-4.2-11.5 0-16.5z" />
      <path d="M160 18c-6.8-1.4-11.6-6.6-13-12.2 6.2 1.2 10.6 5.6 13 12.2z" opacity=".9" />
      <path d="M160 18c6.8-1.4 11.6-6.6 13-12.2-6.2 1.2-10.6 5.6-13 12.2z" opacity=".9" />
      <path d="M160 19.2c-7.2 1.2-14-.8-18.4-5.2 6.6-.8 13 1.2 18.4 5.2z" opacity=".75" />
      <path d="M160 19.2c7.2 1.2 14-.8 18.4-5.2-6.6-.8-13 1.2-18.4 5.2z" opacity=".75" />
      <path d="M151 21.4h18v.9h-18z" />
    </svg>
  );
}
