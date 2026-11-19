import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { readStorage, removeStorage, writeStorage } from './storage';

const RELOAD_FLAG = 'dw-chunk-reload';

/**
 * React.lazy with recovery for missing chunks. After a redeploy, a guest who
 * still has the old page open asks for old file names that no longer exist;
 * browsers cache that failure, so the only cure is a fresh page load. We
 * reload once per visit, then let the error boundary show a friendly card.
 */
// Same constraint as React.lazy's own signature (any component, any props).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  /** Runs just before the one-time recovery reload (e.g. to skip the opening). */
  beforeReload?: () => void,
): LazyExoticComponent<T> {
  return lazy(async (): Promise<{ default: T }> => {
    try {
      const mod = await factory();
      removeStorage('session', RELOAD_FLAG);
      return mod;
    } catch (error) {
      if (readStorage('session', RELOAD_FLAG) !== '1') {
        writeStorage('session', RELOAD_FLAG, '1');
        beforeReload?.();
        window.location.reload();
        // keep suspending until the reload happens
        return new Promise<{ default: T }>(() => undefined);
      }
      throw error;
    }
  });
}
