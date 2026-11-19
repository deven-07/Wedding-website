import { m, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { coupleName, wedding } from '../../config/wedding';
import { Sparkle } from '../ornaments/Sparkle';

interface Marker {
  id: string;
  label: string;
  /** 0–1 position of the section start along the page scroll. */
  at: number;
}

const SECTIONS = [
  { id: 'hero', label: coupleName },
  { id: 'celebrations', label: wedding.eventsHeading },
  { id: 'countdown', label: wedding.countdown.heading },
  { id: 'blessings', label: wedding.blessings.heading },
] as const;

function measure(): Marker[] {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return SECTIONS.flatMap((s) => {
    const el = document.getElementById(s.id);
    if (!el) return [];
    const top = el.getBoundingClientRect().top + window.scrollY;
    return [{ ...s, at: Math.min(1, Math.max(0, top / max)) }];
  });
}

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Reading progress: a slim gold bar along the top on phones, a vertical gold
 * thread on the right edge on desktop — each with a tiny gold sparkle at the tip.
 * Desktop markers jump to their section.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const tipX = useTransform(progress, (v) => `${(v * 100).toFixed(2)}%`);
  const tipY = useTransform(progress, (v) => `${(v * 100).toFixed(2)}%`);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [active, setActive] = useState('hero');

  // positions change as lazy sections load / fonts settle / viewport resizes
  useEffect(() => {
    const update = () => {
      setMarkers(measure());
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(
    () =>
      scrollYProgress.on('change', (v) => {
        let current = 'hero';
        for (const mk of markers) if (v + 0.02 >= mk.at) current = mk.id;
        setActive(current);
      }),
    [scrollYProgress, markers],
  );

  return (
    <>
      {/* phones / tablets: top bar */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] lg:hidden" style={{ top: 'var(--safe-top)' }}>
        <div className="absolute inset-0 bg-burgundy/25" />
        <m.div
          className="absolute inset-0 origin-left"
          style={{ scaleX: progress, backgroundImage: 'var(--foil)' }}
        />
        {markers.slice(1).map((mk) => (
          <span key={mk.id} className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold/80" style={{ left: `${mk.at * 100}%` }} />
        ))}
        <m.div className="absolute inset-y-0 left-0 w-full" style={{ x: tipX }}>
          <Sparkle className="absolute -left-[7px] -top-[6px] h-[15px] w-[15px] drop-shadow-[0_0_4px_rgb(232_214_163/0.9)]" />
        </m.div>
      </div>

      {/* desktop: right-edge thread with section markers */}
      <nav
        aria-label={wedding.ui.progressLabel}
        className="fixed top-1/2 z-40 hidden h-[56vh] w-11 -translate-y-1/2 lg:block"
        style={{ right: 'max(1rem, var(--safe-right))' }}
      >
        <div aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold/25" />
        <m.div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-[2px] origin-top -translate-x-1/2"
          style={{ scaleY: progress, backgroundImage: 'linear-gradient(var(--champagne), var(--gold), var(--gold-deep))' }}
        />
        <m.div aria-hidden="true" className="absolute inset-x-0 top-0 h-full" style={{ y: tipY }}>
          <Sparkle className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_5px_rgb(232_214_163/0.9)]" />
        </m.div>
        <ul>
          {markers.map((mk) => (
            <li key={mk.id} className="absolute left-0 w-11 -translate-y-1/2" style={{ top: `${mk.at * 100}%` }}>
              <button
                type="button"
                onClick={() => {
                  jump(mk.id);
                }}
                aria-label={mk.label}
                aria-current={active === mk.id ? 'true' : undefined}
                className="group relative grid h-11 w-11 place-items-center"
              >
                <span
                  className={`block h-2.5 w-2.5 rotate-45 border border-gold transition-colors duration-300 ${
                    active === mk.id ? 'bg-gold shadow-[0_0_10px_rgb(201_164_92/0.8)]' : 'bg-burgundy'
                  }`}
                />
                <span className="pointer-events-none absolute right-full mr-1 whitespace-nowrap rounded-full bg-burgundy/90 px-3 py-1 font-sans text-micro text-champagne opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {mk.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
