import { RotateCcw } from 'lucide-react';
import { wedding } from '../../config/wedding';

interface SiteFooterProps {
  onReplay?: () => void;
}

export function SiteFooter({ onReplay }: SiteFooterProps) {
  return (
    <footer
      className="tex-velvet-deep flex flex-col items-center gap-3 px-gutter pt-10 text-center"
      style={{ paddingBottom: 'calc(5.5rem + var(--safe-bottom))' }}
    >
      <p className="eyebrow text-champagne/90">{wedding.blessings.footer}</p>
      {onReplay ? (
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex min-h-[44px] items-center gap-2 px-3 font-sans text-micro text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-champagne"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          {wedding.ui.replayOpening}
        </button>
      ) : null}
    </footer>
  );
}
