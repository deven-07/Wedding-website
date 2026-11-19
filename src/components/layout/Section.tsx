import { useRef, type ReactNode } from 'react';
import { useAmbientActive } from '../../hooks/useInView';
import { DeckledEdge } from './DeckledEdge';

export type Material = 'paper' | 'cream' | 'velvet' | 'velvet-deep';

interface SectionProps {
  id: string;
  material: Material;
  /** id of the heading that labels this section */
  labelledBy?: string;
  /** Faint damask pattern on velvet surfaces. */
  damask?: boolean;
  vignette?: boolean;
  /** Deckled paper edges (paper materials only). */
  edges?: 'top' | 'bottom' | 'both';
  className?: string;
  /** Classes for the content wrapper (default: relative). */
  contentClassName?: string;
  /** Absolutely positioned decorative layer rendered behind content. */
  decor?: ReactNode;
  children: ReactNode;
}

const MATERIAL_CLASS: Record<Material, string> = {
  paper: 'tex-paper on-paper',
  cream: 'tex-cream on-paper',
  velvet: 'tex-velvet',
  'velvet-deep': 'tex-velvet-deep',
};

/**
 * Page section with a material surface. Decorations live in a clipped,
 * aria-hidden layer so they can never cause horizontal scroll. Ambient CSS
 * animations inside pause when the section is off-screen or the tab hidden.
 */
export function Section({
  id,
  material,
  labelledBy,
  damask = false,
  vignette = false,
  edges,
  className = '',
  contentClassName = '',
  decor,
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const active = useAmbientActive(ref);
  const isPaper = material === 'paper' || material === 'cream';
  const paperColor = material === 'cream' ? 'cream' : 'ivory';

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-ambient={active ? 'running' : 'paused'}
      className={[
        'relative scroll-mt-4',
        MATERIAL_CLASS[material],
        damask ? 'tex-damask' : '',
        vignette ? 'vignette' : '',
        className,
      ].join(' ')}
    >
      {isPaper && (edges === 'top' || edges === 'both') ? (
        <DeckledEdge position="top" color={paperColor} seed={id.length * 13} />
      ) : null}
      {decor ? (
        <div aria-hidden="true" className="decor absolute inset-0 overflow-hidden">
          {decor}
        </div>
      ) : null}
      <div className={`relative ${contentClassName}`}>{children}</div>
      {isPaper && (edges === 'bottom' || edges === 'both') ? (
        <DeckledEdge position="bottom" color={paperColor} seed={id.length * 31} />
      ) : null}
    </section>
  );
}
