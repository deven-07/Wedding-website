import { AnimatePresence, m } from 'framer-motion';
import { CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { wedding, type WeddingEvent } from '../../config/wedding';
import { googleCalendarUrl } from '../../lib/calendarLinks';
import { downloadIcs } from '../../lib/ics';
import { ACTION_BASE, ACTION_BUTTON, type ActionTone } from './actionStyles';


/** "Add to Calendar" disclosure: Google Calendar link + downloadable .ics (Asia/Kolkata). */
export function AddToCalendar({ event, tone }: { event: WeddingEvent; tone: ActionTone }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        rootRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const item =
    'flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left font-sans text-[0.8125rem] text-champagne transition-colors hover:bg-gold/15 focus-visible:bg-gold/15';

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((o) => !o);
        }}
        className={`${ACTION_BASE} ${ACTION_BUTTON[tone]}`}
      >
        <CalendarPlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
        {wedding.ui.addToCalendar}
      </button>
      <AnimatePresence>
        {open ? (
          <m.div
            id={menuId}
            className="foil-border absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-xl p-1.5 shadow-[0_18px_40px_rgb(0_0_0/0.45)]"
            style={{ ['--surface' as string]: '#3D101D' }}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <a
              ref={firstRef}
              href={googleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={item}
              onClick={() => {
                setOpen(false);
              }}
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              {wedding.ui.googleCalendar}
            </a>
            <button
              type="button"
              className={item}
              onClick={() => {
                downloadIcs(event);
                setOpen(false);
              }}
            >
              <Download aria-hidden="true" className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
              {wedding.ui.downloadIcs}
            </button>
          </m.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
