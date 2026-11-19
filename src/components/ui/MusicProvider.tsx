import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MusicContext, type MusicApi } from '../../hooks/useMusic';
import { readStorage, STORAGE_KEYS, writeStorage } from '../../lib/storage';

const SRC = '/audio/wedding-music.mp3';
const TARGET_VOLUME = 0.5;

type AudioContextCtor = typeof AudioContext;

/**
 * Background music. Never autoplays: playback begins only from the guest's
 * tap on "OPEN WEDDING INVITATION". Volume is faded through a Web Audio
 * GainNode because iOS Safari ignores `audio.volume`; falls back to
 * `audio.volume` where Web Audio is unavailable.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const [available, setAvailable] = useState<boolean>(__HAS_MUSIC__);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const rampRef = useRef(0);
  const wantRef = useRef(false); // guest intends music to be on
  const resumeOnShowRef = useRef(false);

  const ensureAudio = useCallback((): HTMLAudioElement | null => {
    if (!__HAS_MUSIC__) return null;
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('playing', () => {
      setPlaying(true);
    });
    audio.addEventListener('pause', () => {
      setPlaying(false);
    });
    audio.addEventListener('error', () => {
      setAvailable(false);
      setPlaying(false);
    });

    try {
      const w = window as Window & { webkitAudioContext?: AudioContextCtor };
      const Ctor = window.AudioContext as AudioContextCtor | undefined ?? w.webkitAudioContext;
      if (Ctor) {
        const ctx = new Ctor();
        const gain = ctx.createGain();
        gain.gain.value = 0;
        ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
        ctxRef.current = ctx;
        gainRef.current = gain;
      } else {
        audio.volume = 0;
      }
    } catch {
      audio.volume = 0;
    }

    audioRef.current = audio;
    return audio;
  }, []);

  /** Ramps output level to `to` over `seconds`. */
  const ramp = useCallback((to: number, seconds: number, then?: () => void) => {
    const gain = gainRef.current;
    const ctx = ctxRef.current;
    cancelAnimationFrame(rampRef.current);
    if (gain && ctx) {
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(to, now + seconds);
      if (then) window.setTimeout(then, seconds * 1000);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    const from = audio.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / (seconds * 1000));
      audio.volume = from + (to - from) * k;
      if (k < 1) rampRef.current = requestAnimationFrame(step);
      else then?.();
    };
    rampRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const audio = ensureAudio();
    if (!audio) return;
    void ctxRef.current?.resume().catch(() => undefined);
    // iOS / in-app browsers may reject play(); fail silently, the toggle still works.
    audio.play().catch(() => {
      setPlaying(false);
    });
  }, [ensureAudio]);

  const start = useCallback(() => {
    if (!available) return;
    if (readStorage('session', STORAGE_KEYS.muted) === '1') return;
    wantRef.current = true;
    play();
  }, [available, play]);

  const fadeIn = useCallback(() => {
    if (!wantRef.current) return;
    ramp(TARGET_VOLUME, 2);
  }, [ramp]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      wantRef.current = false;
      writeStorage('session', STORAGE_KEYS.muted, '1');
      ramp(0, 0.35, () => {
        audio.pause();
      });
    } else {
      wantRef.current = true;
      writeStorage('session', STORAGE_KEYS.muted, '0');
      play();
      ramp(TARGET_VOLUME, 1.2);
    }
  }, [play, ramp]);

  // Pause in background tabs, resume when the guest comes back.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.visibilityState === 'hidden') {
        resumeOnShowRef.current = !audio.paused;
        audio.pause();
      } else if (resumeOnShowRef.current && wantRef.current) {
        resumeOnShowRef.current = false;
        play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [play]);

  useEffect(
    () => () => {
      cancelAnimationFrame(rampRef.current);
      audioRef.current?.pause();
      void ctxRef.current?.close().catch(() => undefined);
    },
    [],
  );

  const api = useMemo<MusicApi>(
    () => ({ available, playing, start, fadeIn, toggle }),
    [available, playing, start, fadeIn, toggle],
  );

  return <MusicContext.Provider value={api}>{children}</MusicContext.Provider>;
}
