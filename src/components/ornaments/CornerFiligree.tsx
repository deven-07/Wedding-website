import { a11yProps, FOIL, type OrnamentProps, type Tone } from './types';

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

const MIRROR: Record<Corner, string> = {
  tl: 'none',
  tr: 'scaleX(-1)',
  bl: 'scaleY(-1)',
  br: 'scale(-1,-1)',
};

const POSITION: Record<Corner, string> = {
  tl: 'left-0 top-0',
  tr: 'right-0 top-0',
  bl: 'left-0 bottom-0',
  br: 'right-0 bottom-0',
};

interface CornerFiligreeProps extends OrnamentProps {
  corner?: Corner;
  tone?: Tone;
  /** Position absolutely in the given corner of the parent. */
  placed?: boolean;
}

/** Acanthus scroll with paisley tip and beading. One drawing, mirrored per corner. */
export function CornerFiligree({
  corner = 'tl',
  tone = 'dark',
  placed = false,
  title,
  className = '',
  style,
  ...rest
}: CornerFiligreeProps) {
  const paint = FOIL[tone];
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${placed ? `absolute ${POSITION[corner]}` : ''} ${className}`}
      style={{ transform: MIRROR[corner], ...style }}
      {...a11yProps(title)}
      {...rest}
    >
      <g fill="none" stroke={paint} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 62V11q0-7 7-7h51" strokeWidth="1.1" />
        <path d="M9 62V16q0-7 7-7h46" strokeWidth=".6" />
        <path d="M15 44c-.5-14 7-25 21-28-8.5 5.6-12.6 13.4-11 21.6 1-6.4 5-10.4 10.6-10.6-4.4 3.8-5.8 8.4-3.6 12.6" strokeWidth="1.1" />
        <path d="M18.5 19c7.4-6.8 16.4-3.6 14.6 2.8-1.6 5.4-9.2 4.8-8.2-.4.6-3 4.6-2.6 4 0" strokeWidth="1" />
        <path d="M14 30c-2.8-3-2.4-7.6 1-9.6M30 14c-3-2.8-7.6-2.4-9.6 1" strokeWidth=".8" />
        <path d="M44 9c3 3 6.6 3 9.6 0M9 44c3 3 3 6.6 0 9.6" strokeWidth=".7" />
      </g>
      <g fill={paint}>
        <circle cx="15.5" cy="15.5" r="1.8" />
        <circle cx="42" cy="9" r="1" />
        <circle cx="56" cy="9" r="1" />
        <circle cx="9" cy="42" r="1" />
        <circle cx="9" cy="56" r="1" />
        <circle cx="26" cy="27.5" r="1.1" />
      </g>
    </svg>
  );
}

/** Convenience: four mirrored corners filling the parent. */
export function FourCorners({ className = 'h-10 w-10', tone = 'dark' }: { className?: string; tone?: Tone }) {
  return (
    <>
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <CornerFiligree key={c} corner={c} placed tone={tone} className={className} />
      ))}
    </>
  );
}
