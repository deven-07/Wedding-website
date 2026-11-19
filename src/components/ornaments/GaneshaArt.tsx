import type { SVGProps } from 'react';

interface GaneshaArtProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Stroke/fill paint, e.g. url(#foil-grad-v) or a colour. */
  paint: string;
  title?: string;
}

/**
 * Fine-line Ganesha drawing (pure SVG, no wrappers) — shared by the site and
 * the build-time link-preview image (scripts/generate-assets.mjs).
 */
export function GaneshaArt({ paint, title, ...rest }: GaneshaArtProps) {
  return (
    <svg viewBox="0 0 120 128" {...rest}>
      {title ? <title>{title}</title> : null}
      {/* halo */}
      <g fill="none" stroke={paint} strokeLinecap="round">
        <circle cx="60" cy="64" r="57" strokeWidth=".7" strokeDasharray=".1 3.4" />
        <circle cx="60" cy="64" r="53" strokeWidth=".5" opacity=".7" />
      </g>
      <g fill="none" stroke={paint} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {/* mukut / crown */}
        <path d="M43 41C45 31 51 23 55.5 16.5L60 7l4.5 9.5C69 23 75 31 77 41" />
        <path d="M51.5 37c2-7.5 5-13.5 8.5-19 3.5 5.5 6.5 11.5 8.5 19" strokeWidth="1.1" />
        <path d="M42 41.5q18-6.5 36 0M43 45.5q17-6 34 0" />
        <path d="M43 41c-4-3.5-5.6-7.6-4-11.6M77 41c4-3.5 5.6-7.6 4-11.6" strokeWidth="1.2" />
        {/* forehead */}
        <path d="M44 45.5c.6 5 2 8.5 4 11M76 45.5c-.6 5-2 8.5-4 11" strokeWidth="1.3" />
        {/* ears */}
        <path d="M45 48c-11-7-26-5-30.5 6.5-4.2 11.5 1.2 25 13 29.5 8 3 14.2-.4 18-7" />
        <path d="M75 48c11-7 26-5 30.5 6.5 4.2 11.5-1.2 25-13 29.5-8 3-14.2-.4-18-7" />
        <path d="M41.5 53c-9.5-4-18.5-.3-19.6 8.6-1 8 4.2 14.5 11.8 15.6" strokeWidth="1" opacity=".75" />
        <path d="M78.5 53c9.5-4 18.5-.3 19.6 8.6 1 8-4.2 14.5-11.8 15.6" strokeWidth="1" opacity=".75" />
        {/* tilak */}
        <path d="M56.6 46.2q3.4 8.4 6.8 0" strokeWidth="1.2" />
        {/* eyes */}
        <path d="M49 59q4-3.4 8 0-4 2.4-8 0zM71 59q-4-3.4-8 0 4 2.4 8 0z" strokeWidth="1.1" />
        {/* trunk */}
        <path d="M55.2 62c-1.2 11-1 22.6 2 32.4 3 9.8 11 15.8 19.4 13.6 6.8-1.8 8.4-9.4 3.4-12.6-4-2.6-8.6.6-6.6 4.8" />
        <path d="M64.8 62c1 8.5 1.2 17.5 1.4 25.4.2 6.6 3.6 10.8 9.6 11.2" />
        <path d="M55.8 71q4.6 2.2 9.4 0M55.6 79q5 2.2 10.4 0M56.6 87q5 2.2 9.8 0" strokeWidth=".9" opacity=".7" />
        {/* tusks */}
        <path d="M52.4 68.6c-4.4 3.6-6.6 9-5.6 14 2-4 4.2-6.8 7.4-8.8" strokeWidth="1.3" />
        <path d="M67.6 68.6c2.6 1.6 3.8 3.6 4 5.6" strokeWidth="1.3" />
      </g>
      <g fill={paint}>
        <circle cx="60" cy="5.2" r="1.8" />
        <circle cx="60" cy="29" r="2" />
        <circle cx="60" cy="50.6" r="1.1" />
      </g>
    </svg>
  );
}
