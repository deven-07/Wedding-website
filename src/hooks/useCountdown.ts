import { useEffect, useState } from 'react';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Target time has passed. */
  done: boolean;
}

/** Splits the remaining time until `targetMs` into units (never negative). */
export function partsUntil(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: diff <= 0,
  };
}

/**
 * Live countdown to an ISO timestamp that carries its own offset
 * (e.g. "+05:30"), so it is correct in every visitor's time zone.
 * Returns null until mounted (render a skeleton for that first frame),
 * then ticks exactly on each second boundary.
 */
export function useCountdown(targetIso: string): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const target = Date.parse(targetIso);
    if (Number.isNaN(target)) return;
    let timer = 0;
    const tick = () => {
      const now = Date.now();
      const next = partsUntil(target, now);
      setParts(next);
      if (!next.done) timer = window.setTimeout(tick, 1000 - (now % 1000) + 5);
    };
    tick();
    // Re-sync immediately when the tab becomes visible again (timers are throttled in background tabs).
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [targetIso]);

  return parts;
}
