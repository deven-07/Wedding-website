import { Suspense } from 'react';
import { lazyWithRetry } from '../lib/lazyWithRetry';
import { HeroSection } from './hero/HeroSection';
import { SiteFooter } from './layout/SiteFooter';

// Everything below the hero is split into its own chunks.
const EventTimeline = lazyWithRetry(() => import('./events/EventTimeline'));
const WeddingCountdown = lazyWithRetry(() => import('./countdown/WeddingCountdown'));
const BlessingsSection = lazyWithRetry(() => import('./blessings/BlessingsSection'));

function SectionFallback({ className }: { className: string }) {
  return <div aria-hidden="true" className={`min-h-screen ${className}`} />;
}

interface SiteContentProps {
  /** Hero reveal may start (the opening has finished). */
  ready: boolean;
  onReplay: () => void;
}

/** The invitation page beneath the opening. */
export function SiteContent({ ready, onReplay }: SiteContentProps) {
  return (
    <>
      <main id="main">
        <HeroSection ready={ready} />
        <Suspense fallback={<SectionFallback className="tex-velvet" />}>
          <EventTimeline />
        </Suspense>
        <Suspense fallback={<SectionFallback className="tex-velvet-deep" />}>
          <WeddingCountdown />
        </Suspense>
        <Suspense fallback={<SectionFallback className="tex-velvet" />}>
          <BlessingsSection />
        </Suspense>
      </main>
      <SiteFooter onReplay={onReplay} />
    </>
  );
}
