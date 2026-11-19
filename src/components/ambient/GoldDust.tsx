import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { isDesktop } from '../../lib/css';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  speed: number;
  alpha: number;
}

/**
 * Tiny glowing gold particles drifting upward on a single <canvas>.
 * Capped particle count, ~30 fps, paused off-screen and in hidden tabs.
 */
export function GoldDust({ count }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = count ?? (isDesktop() ? 40 : 22);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const spawn = (anyY: boolean): Particle => ({
      x: Math.random() * width,
      y: anyY ? Math.random() * height : height + 6,
      r: 0.5 + Math.random() * 1.4,
      vy: 0.12 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.01,
      alpha: 0.25 + Math.random() * 0.55,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: total }, () => spawn(true));
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return; // ~30 fps is plenty for dust
      last = t;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.phase += p.speed;
        const x = p.x + Math.sin(p.phase) * 8;
        const twinkle = p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 3));
        if (p.y < -6) Object.assign(p, spawn(false));
        ctx.fillStyle = `rgba(201,164,92,${(twinkle * 0.22).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(232,214,163,${twinkle.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = () => {
      if (!raf && onScreen && document.visibilityState === 'visible') raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // start after the page is idle so the dust never competes with first paint
    const begin = () => {
      resize();
      start();
    };
    // requestIdleCallback is missing in older Safari / some in-app browsers
    const hasIdle = typeof (window as Partial<Window>).requestIdleCallback === 'function';
    const idleId = hasIdle ? window.requestIdleCallback(begin, { timeout: 2000 }) : window.setTimeout(begin, 1200);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, reduced]);

  if (reduced) return null;
  return <canvas ref={ref} aria-hidden="true" className="decor absolute inset-0 h-full w-full" />;
}
