import type { SVGProps } from 'react';

export type OrnamentProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /** When provided the SVG becomes meaningful (role="img" + <title>). */
  title?: string;
};

/** Accessibility attributes: decorative unless a title is provided. */
export function a11yProps(title: string | undefined): SVGProps<SVGSVGElement> {
  return title
    ? { role: 'img', 'aria-label': title }
    : { 'aria-hidden': true, focusable: false };
}

/** Shared gradient ids defined once by <FoilDefs/>. */
export const FOIL = {
  dark: 'url(#foil-grad)',
  paper: 'url(#foil-grad-paper)',
  vertical: 'url(#foil-grad-v)',
} as const;

export type Tone = keyof typeof FOIL;
