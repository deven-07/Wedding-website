import { useRef } from 'react';
import { wedding, type WeddingEvent } from '../../config/wedding';
import { useInView } from '../../hooks/useInView';
import { isDesktop } from '../../lib/css';
import { GoldDust } from '../ambient/GoldDust';
import { ParallaxLayer } from '../ambient/ParallaxLayer';
import { Section } from '../layout/Section';
import { LotusBloom } from '../ornaments/LotusBloom';
import { Lotus } from '../ornaments/Motifs';
import { Toran } from '../ornaments/Toran';
import { SectionHeading } from '../ui/SectionHeading';
import { EventCard } from './EventCard';
import { TimelineThread } from './TimelineThread';
import { VenueCard } from './VenueCard';

/** One row: a lotus node on the thread (blooms as its card arrives) + the card. */
function TimelineItem({ event, index }: { event: WeddingEvent; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const lit = useInView(ref, { once: true, rootMargin: '0px 0px -38% 0px' });
  const left = index % 2 === 0;

  return (
    <li
      ref={ref}
      className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2.5 xs:gap-x-3 lg:grid-cols-[minmax(0,1fr)_5.5rem_minmax(0,1fr)] lg:gap-x-0 lg:[&:not(:first-child)]:-mt-48"
    >
      <div
        className={`relative col-start-1 row-start-1 flex justify-center pt-8 lg:col-start-2 ${lit ? '' : 'opacity-70'}`}
      >
        <span
          className="relative grid h-9 w-9 place-items-center rounded-full bg-burgundy shadow-[0_0_0_1px_rgb(201_164_92/0.7)] transition-shadow duration-700 lg:h-12 lg:w-12"
          style={lit ? { boxShadow: '0 0 0 1px rgb(232 214 163 / 0.9), 0 0 22px rgb(201 164 92 / 0.55)' } : undefined}
        >
          <LotusBloom open={lit} glow={false} className="h-7 w-7 lg:h-9 lg:w-9" />
        </span>
      </div>
      <div
        className={`col-start-2 row-start-1 lg:max-w-[30rem] ${
          left ? 'lg:col-start-1 lg:justify-self-end lg:pr-6' : 'lg:col-start-3 lg:justify-self-start lg:pl-6'
        } w-full`}
      >
        <EventCard event={event} index={index} />
      </div>
    </li>
  );
}

/** "Wedding Celebrations" — gold-cord timeline with three skinned invitation cards. */
export default function EventTimeline() {
  const listRef = useRef<HTMLDivElement>(null);
  const strands = isDesktop() ? 30 : 13;

  return (
    <Section
      id="celebrations"
      material="velvet"
      damask
      labelledBy="celebrations-heading"
      decor={
        <>
          <GoldDust />
          <ParallaxLayer speed={0.3} className="absolute inset-y-0 left-[3%] hidden w-40 lg:block">
            <Lotus className="absolute top-[22%] h-24 w-36 opacity-25" />
            <Lotus className="absolute top-[68%] h-24 w-36 opacity-20" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.45} className="absolute inset-y-0 right-[3%] hidden w-40 lg:block">
            <Lotus className="absolute top-[42%] h-24 w-36 opacity-20" />
          </ParallaxLayer>
        </>
      }
    >
      <Toran strands={strands} surface="dark" className="decor block h-auto w-full" />
      <div className="container-events pb-section pt-[clamp(2.5rem,8vw,5rem)]">
        <SectionHeading id="celebrations-heading" surface="dark" subheading={wedding.eventsSubheading}>
          {wedding.eventsHeading}
        </SectionHeading>

        <div ref={listRef} className="relative mt-[clamp(2.5rem,8vw,4.5rem)]">
          <TimelineThread
            target={listRef}
            className="bottom-6 left-[calc(1.125rem-0.75rem)] top-10 lg:left-1/2 lg:-translate-x-1/2"
          />
          <ol className="relative grid gap-[clamp(2.5rem,7vw,3.5rem)] lg:gap-4">
            {wedding.events.map((event, i) => (
              <TimelineItem key={event.id} event={event} index={i} />
            ))}
          </ol>
        </div>

        <VenueCard />
      </div>
    </Section>
  );
}
