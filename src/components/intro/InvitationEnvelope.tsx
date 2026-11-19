import { m } from 'framer-motion';
import { forwardRef } from 'react';
import { FourCorners } from '../ornaments/CornerFiligree';
import { WaxSeal, type SealState } from './WaxSeal';

interface InvitationEnvelopeProps {
  sealState: SealState;
  flapOpen: boolean;
  /** Envelope sinks and fades as the scroll rises out of it. */
  sunk: boolean;
  onOpen: () => void;
}

/** Fraction of the envelope height covered by the closed top flap. */
const FLAP = 0.6;

/**
 * Maroon velvet envelope seen from the back: gold-framed body, side and
 * bottom fold lines, a 3D top flap (two faces) and the wax seal at its tip.
 */
export const InvitationEnvelope = forwardRef<HTMLDivElement, InvitationEnvelopeProps>(function InvitationEnvelope(
  { sealState, flapOpen, sunk, onOpen },
  ref,
) {
  return (
    <m.div
      ref={ref}
      className="relative aspect-[3/2] w-[min(80vw,24rem,46dvh)] land:w-[min(40vw,22rem,58dvh)]"
      style={{ perspective: 1100 }}
      animate={sunk ? { y: '7vh', scale: 0.92, opacity: 0 } : { y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* body */}
      <div className="tex-velvet absolute inset-0 overflow-hidden rounded-md shadow-[0_24px_48px_-12px_rgb(0_0_0/0.65),0_0_0_1px_rgb(201_164_92/0.45)]">
        {/* pocket lining — revealed when the flap lifts */}
        <div
          className="tex-cream absolute inset-x-0 top-0"
          style={{ height: `${FLAP * 100}%`, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgb(61 16 29 / 0.6), rgb(61 16 29 / 0.15) 70%)' }} />
        </div>
        {/* the rolled scroll waiting inside the pocket */}
        <div
          className="absolute left-[14%] right-[14%] top-[24%] transition-opacity duration-300"
          style={{ opacity: flapOpen ? 1 : 0 }}
        >
          <div className="tex-paper mx-[6%] h-[9px] rounded-b-sm shadow-[0_3px_6px_rgb(61_16_29/0.4)]" />
          <div
            className="absolute inset-x-0 -top-[5px] h-[11px] rounded-full shadow-[0_3px_5px_rgb(0_0_0/0.4)]"
            style={{ background: 'linear-gradient(#3D101D, #8A6140 35%, #E8D6A3 50%, #8A6140 65%, #3D101D)' }}
          />
        </div>
        {/* fold lines (side + bottom flaps) */}
        <svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <path d="M0 200 150 104 300 200" fill="rgb(61 16 29 / 0.28)" stroke="url(#foil-grad)" strokeWidth=".9" vectorEffect="non-scaling-stroke" />
          <path d="M0 0 138 112M300 0 162 112" fill="none" stroke="rgb(201 164 92 / 0.35)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="absolute inset-[7px] rounded-[3px] border border-gold/45" />
        <div className="absolute inset-[10px] rounded-[2px] border border-gold/20" />
        <div aria-hidden="true" className="absolute inset-[7px]">
          <FourCorners className="h-7 w-7 xs:h-9 xs:w-9" />
        </div>
      </div>

      {/* top flap — two faces, hinged at the top edge */}
      <m.div
        className="absolute inset-x-0 top-0 origin-top"
        style={{ height: `${FLAP * 100}%`, transformStyle: 'preserve-3d', zIndex: flapOpen ? 0 : 2 }}
        initial={false}
        animate={{ rotateX: flapOpen ? 178 : 0 }}
        transition={{ duration: 0.6, ease: [0.45, 0, 0.2, 1] }}
      >
        {/* outer face */}
        <svg
          viewBox="0 0 300 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ backfaceVisibility: 'hidden', filter: 'drop-shadow(0 6px 6px rgb(61 16 29 / 0.55))' }}
        >
          <defs>
            <linearGradient id="flap-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3D101D" />
              <stop offset=".55" stopColor="#641B2B" />
              <stop offset="1" stopColor="#641B2B" />
            </linearGradient>
          </defs>
          <path d="M0 0H300L158 114Q150 120 142 114Z" fill="url(#flap-face)" />
          <path d="M0 0H300L158 114Q150 120 142 114Z" fill="none" stroke="url(#foil-grad)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <path d="M22 6H278L156 103Q150 108 144 103Z" fill="none" stroke="rgb(201 164 92 / 0.5)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
          {/* filigree swirls along the flap edges */}
          <g fill="none" stroke="url(#foil-grad)" strokeWidth=".9" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".85">
            <path d="M96 40c8-2 14 2 13 8-1 5-8 5-8 1 0-3 4-3 4-1" />
            <path d="M204 40c-8-2-14 2-13 8 1 5 8 5 8 1 0-3-4-3-4-1" />
            <path d="M60 14c10 0 16 4 18 10M240 14c-10 0-16 4-18 10" />
            <path d="M128 76c6 4 14 4 22 0 8 4 16 4 22 0" />
          </g>
          <g fill="url(#foil-grad)">
            <circle cx="150" cy="22" r="2" />
            <circle cx="138" cy="22" r="1" />
            <circle cx="162" cy="22" r="1" />
          </g>
        </svg>
        {/* inner lining face (seen once the flap passes 90°) */}
        <div
          className="tex-cream absolute inset-0"
          style={{
            transform: 'rotateX(180deg)',
            backfaceVisibility: 'hidden',
            clipPath: 'polygon(0 0, 100% 0, 53% 95%, 50% 100%, 47% 95%)',
            backgroundImage: 'var(--damask)',
            backgroundSize: '56px 56px',
          }}
        />
      </m.div>

      {/* seal on the flap tip */}
      <div
        className="absolute left-1/2 z-10 h-[clamp(60px,19vw,84px)] w-[clamp(60px,19vw,84px)] -translate-x-1/2 -translate-y-1/2 land:h-16 land:w-16"
        style={{ top: `${FLAP * 100 - 3}%` }}
      >
        <WaxSeal state={sealState} onActivate={onOpen} className="h-full w-full" />
      </div>
    </m.div>
  );
});
