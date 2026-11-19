import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';

const BASE =
  'group relative isolate inline-flex min-h-[3rem] items-center justify-center rounded-full px-7 py-3 font-sans text-btn font-bold uppercase text-burgundy transition-transform duration-200 ease-silk hover:-translate-y-0.5 active:scale-[0.97]';

/** Foil surface, optional halo and shimmer — shared by the button and link versions. */
function GoldSurface({ glow, children }: { glow: boolean; children: ReactNode }) {
  return (
    <>
      {glow ? (
        <span
          aria-hidden="true"
          className="anim-breathe absolute -inset-3 -z-20 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgb(201 164 92 / 0.55), rgb(201 164 92 / 0) 100%)' }}
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden rounded-full shadow-[0_6px_22px_rgb(61_16_29/0.5),inset_0_1px_0_rgb(255_248_233/0.6),inset_0_-2px_4px_rgb(117_75_54/0.45)]"
        style={{ backgroundImage: 'var(--foil)', backgroundSize: '160% 100%' }}
      >
        {glow ? (
          <span className="anim-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-ivory/60 to-transparent" />
        ) : null}
        <span className="absolute inset-[3px] rounded-full border border-burgundy/25" />
      </span>
      <span className="relative">{children}</span>
    </>
  );
}

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Soft pulsing halo + shimmer sweep, for the primary call to action. */
  glow?: boolean;
}

/** Solid gold-foil button with burgundy lettering (≈6.8:1 contrast). */
export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(function GoldButton(
  { children, glow = false, className = '', type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={`${BASE} ${className}`} {...rest}>
      <GoldSurface glow={glow}>{children}</GoldSurface>
    </button>
  );
});

interface GoldLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  glow?: boolean;
}

/** The same gold-foil styling for a link (e.g. "Get Directions"). */
export function GoldLink({ children, glow = false, className = '', ...rest }: GoldLinkProps) {
  return (
    <a className={`${BASE} ${className}`} {...rest}>
      <GoldSurface glow={glow}>{children}</GoldSurface>
    </a>
  );
}
