import { GaneshaArt } from './GaneshaArt';
import { a11yProps, FOIL, type OrnamentProps, type Tone } from './types';

interface GaneshaProps extends OrnamentProps {
  tone?: Tone | 'vertical';
  /** Soft breathing glow behind the motif. */
  glow?: boolean;
}

/**
 * Fine-line Ganesha in the manner of a temple engraving: mukut (crown),
 * broad leaf ears, tilak, curling trunk and single tusk inside a beaded halo.
 * If /public/images/ganesha.png exists at build time it is used instead.
 */
export function Ganesha({ title, tone = 'vertical', glow = false, className, ...rest }: GaneshaProps) {
  if (__HAS_GANESHA_IMAGE__) {
    return (
      <span className={`relative inline-block ${className ?? ''}`}>
        {glow ? <GlowHalo /> : null}
        <img
          src="/images/ganesha.png"
          alt={title ?? ''}
          aria-hidden={title ? undefined : true}
          width={256}
          height={256}
          decoding="async"
          className="relative h-full w-full object-contain"
        />
      </span>
    );
  }

  const paint = FOIL[tone];
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      {glow ? <GlowHalo /> : null}
      <GaneshaArt paint={paint} title={title} className="relative h-full w-full" {...a11yProps(title)} {...rest} />
    </span>
  );
}

function GlowHalo() {
  return (
    <span
      aria-hidden="true"
      className="anim-breathe absolute -inset-[30%] rounded-full"
      style={{ background: 'radial-gradient(circle, rgb(232 214 163 / 0.32) 0%, rgb(201 164 92 / 0.12) 40%, transparent 70%)' }}
    />
  );
}
