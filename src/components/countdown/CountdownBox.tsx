import { AnimatePresence, m } from 'framer-motion';

interface CountdownBoxProps {
  /** null renders the first-frame skeleton. */
  value: number | null;
  label: string;
  /** Slide/flip the digits on change (seconds only). */
  animate?: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Gold-foil framed unit box with Cinzel tabular numerals. */
export function CountdownBox({ value, label, animate = false }: CountdownBoxProps) {
  const text = value === null ? '00' : pad(value);
  return (
    <div
      className="foil-border relative flex flex-col items-center rounded-xl px-1 pb-3 pt-4 shadow-[inset_0_1px_0_rgb(232_214_163/0.12),0_14px_30px_-12px_rgb(0_0_0/0.6)] sm:rounded-2xl sm:pb-4 sm:pt-6"
      style={{ ['--surface' as string]: 'rgb(61 16 29 / 0.92)' }}
    >
      {/* inner hairline */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-[4px] rounded-[9px] border border-gold/20 sm:rounded-[13px]" />
      <span className="sr-only">{value === null ? label : `${text} ${label}`}</span>
      <span
        aria-hidden="true"
        className={`relative block h-[1.15em] overflow-hidden font-royal text-count font-medium tabular ${
          value === null ? 'opacity-30' : ''
        }`}
        style={{ perspective: 400 }}
      >
        {animate && value !== null ? (
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={text}
              className="foil-text block"
              initial={{ y: '-70%', rotateX: -70, opacity: 0 }}
              animate={{ y: '0%', rotateX: 0, opacity: 1 }}
              exit={{ y: '70%', rotateX: 70, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {text}
            </m.span>
          </AnimatePresence>
        ) : (
          <span className="foil-text block">{text}</span>
        )}
      </span>
      <span aria-hidden="true" className="mt-1.5 font-sans text-[length:clamp(0.625rem,2.4vw,0.8125rem)] font-bold uppercase tracking-[0.16em] text-champagne/90 sm:mt-2">
        {label}
      </span>
    </div>
  );
}
