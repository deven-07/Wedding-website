/**
 * Storage helpers that never throw. Storage can be unavailable in private
 * windows, some in-app browsers (WhatsApp/Instagram) or with blocked cookies.
 */

type Area = 'session' | 'local';

function getArea(area: Area): Storage | null {
  try {
    return area === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage(area: Area, key: string): string | null {
  try {
    return getArea(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(area: Area, key: string, value: string): void {
  try {
    getArea(area)?.setItem(key, value);
  } catch {
    /* storage unavailable — the experience still works without it */
  }
}

export function removeStorage(area: Area, key: string): void {
  try {
    getArea(area)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Keys used across the site, kept in one place. */
export const STORAGE_KEYS = {
  opened: 'dw-opened',
  muted: 'dw-music-muted',
  blessingSent: 'dw-blessing-sent',
} as const;
