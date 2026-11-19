/**
 * Global SVG gradient definitions so every ornament can reference the same
 * gold-foil paint (`fill="url(#foil-grad)"`). Rendered once at the app root.
 */
export function FoilDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="foil-grad" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#8A6140" />
          <stop offset="0.22" stopColor="#C9A45C" />
          <stop offset="0.45" stopColor="#E8D6A3" />
          <stop offset="0.62" stopColor="#C9A45C" />
          <stop offset="1" stopColor="#8A6140" />
        </linearGradient>
        <linearGradient id="foil-grad-paper" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#754B36" />
          <stop offset="0.3" stopColor="#8A6140" />
          <stop offset="0.5" stopColor="#C9A45C" />
          <stop offset="0.7" stopColor="#8A6140" />
          <stop offset="1" stopColor="#754B36" />
        </linearGradient>
        {/* wax seal: lit from the top-left, gold wax */}
        <radialGradient id="seal-wax" cx="0.36" cy="0.3" r="0.78">
          <stop offset="0" stopColor="#E8D6A3" />
          <stop offset="0.3" stopColor="#C9A45C" />
          <stop offset="0.78" stopColor="#8A6140" />
          <stop offset="1" stopColor="#754B36" />
        </radialGradient>
        <radialGradient id="seal-press" cx="0.58" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#C9A45C" />
          <stop offset="0.65" stopColor="#A67F4C" />
          <stop offset="1" stopColor="#8A6140" />
        </radialGradient>
        <linearGradient id="rod-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3D101D" />
          <stop offset="0.35" stopColor="#8A6140" />
          <stop offset="0.5" stopColor="#E8D6A3" />
          <stop offset="0.65" stopColor="#8A6140" />
          <stop offset="1" stopColor="#3D101D" />
        </linearGradient>
        <linearGradient id="foil-grad-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8D6A3" />
          <stop offset="0.45" stopColor="#C9A45C" />
          <stop offset="1" stopColor="#8A6140" />
        </linearGradient>
      </defs>
    </svg>
  );
}
