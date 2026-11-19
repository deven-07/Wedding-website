/**
 * A tiny vibration tick for meaningful taps (opening the seal, sending a
 * blessing). Android only — iOS ignores it. Skipped under reduced motion.
 */
export function haptic(ms = 12): void {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof navigator.vibrate === 'function') navigator.vibrate(ms);
  } catch {
    /* not supported — nothing to do */
  }
}
