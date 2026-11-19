import { createContext, useContext } from 'react';

export interface MusicApi {
  /** A music file was found at build time. */
  available: boolean;
  /** Currently audible. */
  playing: boolean;
  /**
   * Must be called synchronously inside the "open" tap: unlocks audio on iOS
   * and starts playback silently (unless the guest muted earlier this visit).
   */
  start: () => void;
  /** Fades volume 0 → 0.5 over 2 s once the opening finishes. */
  fadeIn: () => void;
  toggle: () => void;
}

const noop = () => undefined;

export const MusicContext = createContext<MusicApi>({
  available: false,
  playing: false,
  start: noop,
  fadeIn: noop,
  toggle: noop,
});

export function useMusic(): MusicApi {
  return useContext(MusicContext);
}
