import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { FourCorners } from '../ornaments/CornerFiligree';
import { Divider } from '../ornaments/Divider';
import { LotusBloom } from '../ornaments/LotusBloom';
import { GoldLink } from '../ui/GoldButton';

/**
 * The main venue (Haldi-Carnival & Reception): name, address, a scannable QR code
 * (also tappable — guests on a phone can't scan their own screen) and a
 * "Get Directions" button. All values come from wedding.venue.
 */
export function VenueCard() {
  const v = wedding.venue;
  return (
    <m.section
      aria-labelledby="venue-heading"
      className="relative mx-auto mt-[clamp(3rem,12vw,5rem)] w-full max-w-[26rem]"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ivory sheet with a double gold frame */}
      <div
        aria-hidden="true"
        className="decor tex-paper absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_0_0_1px_rgb(201_164_92/0.6),0_24px_48px_-20px_rgb(0_0_0/0.7)]"
      >
        <div className="absolute inset-[9px] rounded-[14px] border border-gold-deep/55" />
        <div className="absolute inset-[14px] rounded-[10px] border border-gold-deep/25" />
        <div className="absolute inset-[12px]">
          <FourCorners tone="paper" className="h-10 w-10" />
        </div>
      </div>

      <div className="on-paper relative flex flex-col items-center px-7 pb-9 pt-9 text-center">
        <LotusBloom tone="paper" glow={false} className="h-8 w-11" />
        <h3 id="venue-heading" className="eyebrow mt-2 text-gold-deep">
          {v.heading}
        </h3>
        <p className="mt-1 font-serif text-sm italic text-burgundy/80">{v.occasions}</p>
        <Divider tone="paper" className="mx-auto mt-2 h-4 w-[min(11rem,60%)]" />
        <p className="mt-4 font-decorative text-[length:clamp(1.35rem,6.6vw,1.85rem)] font-bold leading-tight tracking-[0.04em] text-maroon">
          {v.name}
        </p>
        <p className="mt-2 text-lead text-burgundy">{v.address}</p>

        <a
          href={v.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-6 block rounded-2xl p-[3px] shadow-[0_10px_24px_-10px_rgb(61_16_29/0.55)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ backgroundImage: 'var(--foil-paper)' }}
        >
          <span className="block rounded-[13px] bg-ivory p-2.5">
            <img
              src="/images/venue-qr.svg"
              alt={v.qrAlt}
              width={168}
              height={168}
              loading="lazy"
              decoding="async"
              className="block h-[min(44vw,10.5rem)] w-[min(44vw,10.5rem)]"
            />
          </span>
        </a>
        <p className="mt-3 font-sans text-micro text-gold-deep">{v.qrHint}</p>

        <GoldLink href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-6">
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            {v.directions}
          </span>
        </GoldLink>
      </div>
    </m.section>
  );
}
