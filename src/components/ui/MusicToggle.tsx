import { Music, VolumeX } from 'lucide-react';
import { wedding } from '../../config/wedding';
import { useMusic } from '../../hooks/useMusic';

/** Round gold toggle with an equaliser ring while playing. Hidden without a music file. */
export function MusicToggle() {
  const { available, playing, toggle } = useMusic();
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={wedding.ui.musicLabel}
      className="foil-border relative grid h-12 w-12 place-items-center rounded-full text-champagne shadow-[0_6px_20px_rgb(61_16_29/0.45)] transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{ ['--surface' as string]: '#3D101D' }}
    >
      {playing ? (
        <span aria-hidden="true" className="anim-spin-slow absolute inset-1 rounded-full border border-dashed border-gold/50" style={{ animationDuration: '12s' }} />
      ) : null}
      {playing ? (
        <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="eq-bar block w-[3px] rounded-full bg-gold"
              style={{ animationDelay: `${i * -0.22}s` }}
            />
          ))}
        </span>
      ) : (
        <VolumeX aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      )}
      <Music aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-burgundy p-[2px] text-gold" strokeWidth={2} />
    </button>
  );
}
