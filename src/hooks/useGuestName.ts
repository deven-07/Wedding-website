import { useMemo } from 'react';
import { sanitizeGuestName } from '../lib/sanitize';

/** Reads and sanitises the optional `?guest=` query parameter. */
export function readGuestName(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sanitizeGuestName(new URLSearchParams(window.location.search).get('guest'));
  } catch {
    return null;
  }
}

export function useGuestName(): string | null {
  return useMemo(readGuestName, []);
}
