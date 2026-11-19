import { m, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { useMotionPrefs } from '../../hooks/useReducedMotion';

interface ParallaxLayerProps {
  /** Fraction of scroll speed (0.2–0.5 recommended). */
  speed?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Moves its children at a fraction of the scroll speed while the element
 * crosses the viewport. Disabled under reduced motion and on low-power devices.
 */
export function ParallaxLayer({ speed = 0.3, className = '', children }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { rich } = useMotionPrefs();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const distance = typeof window === 'undefined' ? 600 : window.innerHeight;
  const y = useTransform(scrollYProgress, [0, 1], [distance * speed * 0.5, -distance * speed * 0.5]);

  return (
    <m.div ref={ref} aria-hidden="true" className={`parallax-layer decor ${className}`} style={rich ? { y } : undefined}>
      {children}
    </m.div>
  );
}
