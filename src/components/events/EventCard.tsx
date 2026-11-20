import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { wedding, type EventTheme, type WeddingEvent } from '../../config/wedding';
import { useInView } from '../../hooks/useInView';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { mulberry32, range } from '../../lib/random';
import { PetalBurst } from '../ambient/PetalBurst';
import { BaaratArt, SouthIndianArt, NightArt } from '../ornaments/EventArt';
import { MarigoldPetal } from '../ornaments/Petals';
import type { OrnamentProps } from '../ornaments/types';
import { ACTION_BASE, ACTION_BUTTON, type ActionTone } from './actionStyles';
import { AddToCalendar } from './AddToCalendar';
import { Thoranam, DecoFrame, Jhalar, NightSparkles, RoyalBorder } from './CardOrnaments';

interface Skin {
  surface: string;
  frame: string;
  hoverGlow: string;
  title: string;
  meta: string;
  quote: string;
  tone: ActionTone;
  Art: ComponentType<OrnamentProps>;
  artClass: string;
  contentTop: string;
  ornaments: ReactNode;
}

/**
 * Three distinct, meaningful skins:
 *  - Haldi (South Indian): a sunlit courtyard — turmeric wash, mango-leaf thoranam, kalash, kolam.
 *  - Reception: an evening of light — midnight burgundy, art-deco gold, chandelier & stars.
 *  - Baarat Prasthan: a royal procession decree — ivory parchment, maroon jhalar, the horse.
 */
const SKINS: Record<EventTheme, Skin> = {
  haldi: {
    surface: 'skin-haldi on-paper',
    frame: 'shadow-[0_0_0_1px_rgb(216_139_54/0.6),0_24px_48px_-20px_rgb(0_0_0/0.65)]',
    hoverGlow: 'group-hover:shadow-[0_0_0_1px_rgb(216_139_54/0.95),0_0_34px_rgb(216_139_54/0.4),0_26px_50px_-18px_rgb(0_0_0/0.65)]',
    title: 'text-maroon',
    meta: 'text-gold-deep',
    quote: 'text-burgundy',
    tone: 'paper',
    Art: SouthIndianArt,
    artClass: 'w-[min(15rem,86%)]',
    contentTop: 'pt-14',
    ornaments: (
      <>
        <Thoranam className="absolute inset-x-0 top-0 h-12 w-full" />
        <div className="absolute inset-[9px] rounded-[14px] border border-saffron/55" />
        <div className="absolute inset-[14px] rounded-[10px] border border-dashed border-saffron/40" />
      </>
    ),
  },
  reception: {
    surface: 'skin-night',
    frame: 'shadow-[0_0_0_1px_rgb(201_164_92/0.5),0_24px_48px_-20px_rgb(0_0_0/0.8)]',
    hoverGlow: 'group-hover:shadow-[0_0_0_1px_rgb(232_214_163/0.9),0_0_38px_rgb(201_164_92/0.42),0_26px_50px_-18px_rgb(0_0_0/0.8)]',
    title: 'foil-text',
    meta: 'text-gold',
    quote: 'text-champagne',
    tone: 'dark',
    Art: NightArt,
    artClass: 'w-[min(15rem,84%)]',
    contentTop: 'pt-12',
    ornaments: (
      <>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 30% at 50% 58%, rgb(201 164 92 / 0.16), transparent 70%)' }} />
        <DecoFrame />
        <NightSparkles />
      </>
    ),
  },
  baarat: {
    surface: 'tex-paper on-paper',
    frame: 'shadow-[0_0_0_1px_rgb(100_27_43/0.45),0_24px_48px_-20px_rgb(0_0_0/0.7)]',
    hoverGlow: 'group-hover:shadow-[0_0_0_1px_rgb(100_27_43/0.8),0_0_34px_rgb(201_164_92/0.45),0_26px_50px_-18px_rgb(0_0_0/0.7)]',
    title: 'text-maroon',
    meta: 'text-gold-deep',
    quote: 'text-burgundy',
    tone: 'paper',
    Art: BaaratArt,
    artClass: 'w-[min(15rem,84%)]',
    contentTop: 'pt-[3.75rem]',
    ornaments: (
      <>
        <Jhalar className="absolute inset-x-0 top-0 h-11 w-full" />
        <RoyalBorder />
      </>
    ),
  },
};

/** A few marigold petals drifting down from the top edge (Haldi hover/tap). */
function PetalDrift({ seed }: { seed: number }) {
  const petals = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: range(rand, 8, 92),
      size: range(rand, 12, 18),
      drift: range(rand, -30, 30),
      rotate: range(rand, -200, 200),
      delay: range(rand, 0, 0.35),
      duration: range(rand, 1.6, 2.4),
    }));
  }, [seed]);
  return (
    <div aria-hidden="true" className="decor absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <m.span
          key={p.id}
          className="absolute top-6 block"
          style={{ left: `${p.left}%`, width: p.size }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: 240, x: p.drift, rotate: p.rotate, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
            opacity: { duration: p.duration, delay: p.delay, times: [0, 0.15, 0.7, 1] },
          }}
        >
          <MarigoldPetal className="block h-auto w-full" />
        </m.span>
      ))}
    </div>
  );
}

/** "Place, address…" → the place name prominent, the address small beneath it. */
function VenueLine({ venue, className, accent }: { venue: string; className: string; accent: string }) {
  const [place = venue, ...rest] = venue.split(', ');
  return (
    <p className={`mt-5 flex flex-col items-center ${className}`}>
      <span className="sr-only">{wedding.ui.venueLabel}: </span>
      <span aria-hidden="true" className={`mb-1.5 block h-px w-10 bg-current opacity-40 ${accent}`} />
      <span className="font-serif text-[length:clamp(1.15rem,4.8vw,1.35rem)] font-semibold leading-snug">{place}</span>
      {rest.length ? <span className="mt-0.5 font-serif text-[length:clamp(0.95rem,3.8vw,1.05rem)] opacity-85">{rest.join(', ')}</span> : null}
    </p>
  );
}

interface EventCardProps {
  event: WeddingEvent;
  index: number;
}

/**
 * A small invitation for one event. Shared structure (ornament, art, title,
 * date · time, quote, venue, actions) with a distinct skin per celebration.
 */
export function EventCard({ event, index }: EventCardProps) {
  const skin = SKINS[event.theme];
  const { Art } = skin;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const seen = useInView(ref, { once: true, threshold: 0.4 });
  const [drift, setDrift] = useState(0);
  const lastDrift = useRef(0);

  const triggerDrift = useCallback(() => {
    if (event.theme !== 'haldi' || reduced) return;
    const now = Date.now();
    if (now - lastDrift.current < 1400) return;
    lastDrift.current = now;
    setDrift((d) => d + 1);
  }, [event.theme, reduced]);

  const headingId = `event-${event.id}-title`;

  return (
    <m.article
      ref={ref}
      aria-labelledby={headingId}
      className="group relative"
      style={{ transformPerspective: 1100 }}
      initial={{ opacity: 0, y: 44, scale: 0.96, rotateX: 9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      whileTap={{ y: -3 }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') triggerDrift();
      }}
      onPointerDown={triggerDrift}
    >
      {/* surface + ornaments (clipped) */}
      <div
        aria-hidden="true"
        className={`decor absolute inset-0 overflow-hidden rounded-[20px] transition-shadow duration-300 ${skin.surface} ${skin.frame} ${skin.hoverGlow}`}
      >
        {skin.ornaments}
        {drift > 0 ? <PetalDrift key={drift} seed={drift * 7} /> : null}
        {event.theme === 'baarat' && seen && !reduced ? (
          <div className="absolute inset-0">
            <PetalBurst x={ref.current ? ref.current.offsetWidth / 2 : 160} y={150} count={14} spread={150} seed={21} />
          </div>
        ) : null}
      </div>

      {/* content */}
      <div className={`relative flex flex-col items-center px-6 pb-8 text-center xs:px-7 sm:px-9 ${skin.contentTop}`}>
        <Art className={`decor h-auto ${skin.artClass}`} />
        <h3 id={headingId} className={`mt-4 font-decorative text-[length:clamp(1.3rem,6vw,1.75rem)] font-bold tracking-[0.1em] ${skin.title}`}>
          {event.title}
        </h3>
        <p className={`eyebrow mt-3 flex flex-col items-center justify-center gap-x-2.5 gap-y-1 sm:flex-row ${skin.meta}`}>
          <time dateTime={event.isoStart}>{event.date}</time>
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 rotate-45 bg-current opacity-70 sm:inline-block" />
          <span>{event.time}</span>
        </p>
        <p className={`quote mt-4 max-w-[24rem] text-[length:clamp(1.0625rem,4.4vw,1.25rem)] ${skin.quote}`}>{event.quote}</p>
        {event.venue ? <VenueLine venue={event.venue} className={skin.quote} accent={skin.meta} /> : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <AddToCalendar event={event} tone={skin.tone} />
          {event.mapUrl ? (
            <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className={`${ACTION_BASE} ${ACTION_BUTTON[skin.tone]}`}>
              <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
              {wedding.ui.viewLocation}
            </a>
          ) : null}
        </div>
      </div>
    </m.article>
  );
}
