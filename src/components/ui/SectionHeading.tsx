import type { ReactNode } from 'react';
import { Divider } from '../ornaments/Divider';

interface SectionHeadingProps {
  id: string;
  children: ReactNode;
  /** Surface the heading sits on — picks a contrast-safe foil. */
  surface: 'dark' | 'paper';
  subheading?: ReactNode;
  /** Extra classes for the h2 (e.g. a smaller size for long headings). */
  className?: string;
}

/** Cinzel uppercase heading in gold foil with an ornamental divider below. */
export function SectionHeading({ id, children, surface, subheading, className = '' }: SectionHeadingProps) {
  const foil = surface === 'paper' ? 'foil-text-paper' : 'foil-text';
  return (
    <div className="text-center">
      <h2 id={id} className={`heading-royal shimmer ${foil} ${className}`}>
        {children}
      </h2>
      <Divider tone={surface === 'paper' ? 'paper' : 'dark'} className="mx-auto mt-4 h-5 w-[min(16rem,64vw)]" />
      {subheading ? (
        <p className={`quote mx-auto mt-4 max-w-prose ${surface === 'paper' ? 'text-burgundy/85' : 'text-champagne'}`}>
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
