import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return () => undefined;
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => {
    mql.removeEventListener('change', onChange);
  };
}

function getSnapshot(): boolean {
  return typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia(QUERY).matches;
}

/** Live `prefers-reduced-motion` value; updates if the OS setting changes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/**
 * Low-power heuristic: few CPU cores, little memory or Data Saver enabled.
 * Used to switch off parallax and thin out ambient particles.
 */
export function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & NavigatorHints;
  const cores = nav.hardwareConcurrency || 8;
  const memory = nav.deviceMemory ?? 8;
  return cores <= 4 || memory <= 2 || nav.connection?.saveData === true;
}

const LOW_POWER = detectLowPower();

export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && 'matchMedia' in window && window.matchMedia('(pointer: coarse)').matches;
}

export interface MotionPrefs {
  /** User asked for reduced motion. */
  reduced: boolean;
  /** Device looks underpowered. */
  lowPower: boolean;
  /** Parallax / heavy ambient effects allowed. */
  rich: boolean;
}

export function useMotionPrefs(): MotionPrefs {
  const reduced = useReducedMotion();
  return { reduced, lowPower: LOW_POWER, rich: !reduced && !LOW_POWER };
}
