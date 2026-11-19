import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { PetalBurst } from './PetalBurst';

interface Burst {
  id: number;
  x: number;
  y: number;
}

const THROTTLE_MS = 600;

/**
 * Releases a small petal burst wherever the guest taps inside `target`
 * (max one burst per 600 ms). Taps on buttons/links are left alone.
 */
export function TapPetals({ target }: { target: RefObject<HTMLElement | null> }) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const last = useRef(0);
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const remove = useCallback((id: number) => {
    setBursts((b) => b.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const el = target.current;
    if (!el || reduced) return;
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary) return;
      if ((e.target as Element).closest('a,button,input,textarea,select,[role="button"]')) return;
      const now = performance.now();
      if (now - last.current < THROTTLE_MS) return;
      last.current = now;
      const rect = layerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const burst = { id: now, x: e.clientX - rect.left, y: e.clientY - rect.top };
      setBursts((b) => [...b.slice(-3), burst]);
    };
    el.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', onDown);
    };
  }, [target, reduced]);

  return (
    <div ref={layerRef} aria-hidden="true" className="decor absolute inset-0 z-10 overflow-hidden">
      {bursts.map((b) => (
        <PetalBurst
          key={b.id}
          x={b.x}
          y={b.y}
          count={10}
          spread={110}
          seed={Math.floor(b.id) % 997}
          onComplete={() => {
            remove(b.id);
          }}
        />
      ))}
    </div>
  );
}
