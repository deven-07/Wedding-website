import type { CSSProperties } from 'react';

/** Typed helper for inline CSS custom properties. */
export function cssVars(vars: Record<`--${string}`, string | number>, base: CSSProperties = {}): CSSProperties {
  return { ...base, ...(vars as CSSProperties) };
}

/** Is the viewport at least desktop width? (read once, client only) */
export function isDesktop(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
}
