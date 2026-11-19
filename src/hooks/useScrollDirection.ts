import { useEffect, useState } from 'react';

/**
 * True while the guest is scrolling down through the content (past the first
 * screen). Used to tuck the floating buttons away while reading on a phone;
 * they return on any upward scroll or after a short pause.
 */
export function useHideOnScrollDown(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // only on phones/tablets — on desktop the buttons sit clear of the content
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    let lastY = window.scrollY;
    let idle = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > window.innerHeight * 0.6);
        lastY = y;
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        setHidden(false);
      }, 1400);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  return hidden;
}
