import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ToastContext } from '../../hooks/useToast';

/** Provides `useToast()` and renders the toast in an always-present live region. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef(0);

  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), text });
    timer.current = window.setTimeout(() => {
      setToast(null);
    }, 2400);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4"
        style={{ bottom: 'calc(5.25rem + var(--safe-bottom))' }}
      >
        <AnimatePresence>
          {toast ? (
            <m.p
              key={toast.id}
              className="foil-border rounded-full px-5 py-2.5 font-sans text-[0.8125rem] font-bold tracking-[0.06em] text-champagne shadow-[0_10px_30px_rgb(0_0_0/0.45)]"
              style={{ ['--surface' as string]: '#3D101D' }}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
            >
              {toast.text}
            </m.p>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
