import type { SVGProps } from 'react';

type PetalProps = Omit<SVGProps<SVGSVGElement>, 'children'>;

/** Single curled rose petal (maroon with a champagne flush). */
export function RosePetal(props: PetalProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      {/* heart-shaped petal: notch at the outer edge, point at the base */}
      <path
        d="M12 22.5C6.2 19.6 3.4 14 4.3 8.8 4.9 5.2 7.4 2.6 10.1 3.2c.9.2 1.5.8 1.9 1.7.4-.9 1-1.5 1.9-1.7 2.7-.6 5.2 2 5.8 5.6.9 5.2-1.9 10.8-7.7 13.7z"
        fill="#641B2B"
      />
      <path d="M13.6 5.4c2.4-.4 4.2 1.8 4.6 4.6.5 3.8-1 7.6-4 10.2 1.2-3.6 1.2-9-.6-14.8z" fill="#E8D6A3" opacity=".24" />
      <path d="M8.4 6c-1.8 1.6-2.4 4.6-1.6 7.4" stroke="#3D101D" strokeWidth=".6" fill="none" opacity=".5" />
      <path d="M12 5.6c-.4 5.6 0 11 .2 16.4" stroke="#3D101D" strokeWidth=".45" fill="none" opacity=".4" />
    </svg>
  );
}

/** Single marigold petal with ruffled tip. */
export function MarigoldPetal(props: PetalProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 22c-4.2-2-6.6-6-6-10.4.3-2.6 1-4.6 2.2-6.4l1.4 1.6L11 3l1.6 2.2L14.2 3l1.4 3.2 1.4-1.4c1.4 2 2.1 4.2 2.2 6.8.2 4.4-2.2 8.4-7.2 10.4z"
        fill="#D88B36"
      />
      <path d="M12 21c-2.2-1.6-3.4-4.4-3.2-7.6.2-2.2 1-4 2.2-5.6.2 4.4.6 8.8 1 13.2z" fill="#C9A45C" opacity=".55" />
    </svg>
  );
}

/** Full marigold bloom — layered ruffles. Used in toran, Haldi art and bursts. */
export function MarigoldBloom(props: PetalProps) {
  const ring = (r: number, count: number, size: number, fill: string, offset = 0) =>
    Array.from({ length: count }, (_, i) => {
      const a = ((i / count) * 360 + offset) * (Math.PI / 180);
      const x = 20 + Math.cos(a) * r;
      const y = 20 + Math.sin(a) * r;
      return <circle key={`${r}-${i}`} cx={x.toFixed(2)} cy={y.toFixed(2)} r={size} fill={fill} />;
    });
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" {...props}>
      <circle cx="20" cy="20" r="18" fill="#D88B36" />
      {ring(15, 16, 4.2, '#D88B36')}
      {ring(11, 13, 3.8, '#C9A45C', 12)}
      {ring(7, 10, 3.2, '#D88B36', 6)}
      <circle cx="20" cy="20" r="5" fill="#C9A45C" />
      <circle cx="20" cy="20" r="2.4" fill="#8A6140" />
    </svg>
  );
}
