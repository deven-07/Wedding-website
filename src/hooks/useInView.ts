import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

interface InViewOptions {
  /** Stop observing after the first time the element enters view. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** IntersectionObserver wrapper. Returns true while the element is in view. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = false, rootMargin = '0px', threshold = 0 }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting && once) observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [ref, once, rootMargin, threshold]);

  return inView;
}

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener('visibilitychange', onChange);
  return () => {
    document.removeEventListener('visibilitychange', onChange);
  };
}

/** True while the browser tab is visible. */
export function usePageVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === 'visible',
    () => true,
  );
}

/**
 * True when ambient animations inside `ref` should run: the element is near
 * the viewport AND the tab is visible.
 */
export function useAmbientActive<T extends Element>(ref: RefObject<T | null>): boolean {
  const near = useInView(ref, { rootMargin: '15% 0px' });
  const visible = usePageVisible();
  return near && visible;
}
