import { m } from 'framer-motion';
import { CornerFiligree, type Corner } from '../ornaments/CornerFiligree';

/**
 * Full gold floral border for the Blessings sheet. When `drawn` becomes true
 * the double frame draws itself (stroke animation), then the vine bands,
 * corner filigree and lotus centrepieces bloom in.
 */
export function FloralBorder({ drawn }: { drawn: boolean }) {
  const corners: Corner[] = ['tl', 'tr', 'bl', 'br'];
  return (
    <div aria-hidden="true" className="decor absolute inset-0">
      {/* double frame that draws itself */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {drawn ? (
          <>
            <rect
              x="0.6"
              y="0.6"
              width="98.8"
              height="98.8"
              pathLength={1}
              className="draw-in"
              style={{ ['--draw-dur' as string]: '1.8s' }}
              fill="none"
              stroke="url(#foil-grad-paper)"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x="2.6"
              y="1.9"
              width="94.8"
              height="96.2"
              pathLength={1}
              className="draw-in"
              style={{ ['--draw-dur' as string]: '1.8s', ['--draw-delay' as string]: '0.25s' }}
              fill="none"
              stroke="#8A6140"
              strokeOpacity=".55"
              strokeWidth=".8"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : null}
      </svg>

      {/* vine bands between the frames */}
      <m.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: drawn ? 0.9 : 0 }}
        transition={{ duration: 1.2, delay: 1.4 }}
      >
        <div className="vine-x absolute left-14 right-14 top-[9px] h-4 sm:left-20 sm:right-20" />
        <div className="vine-x absolute bottom-[9px] left-14 right-14 h-4 sm:left-20 sm:right-20" />
        <div className="vine-y absolute bottom-14 left-[9px] top-14 w-4 sm:bottom-20 sm:top-20" />
        <div className="vine-y absolute bottom-14 right-[9px] top-14 w-4 sm:bottom-20 sm:top-20" />
      </m.div>

      {/* corner filigree */}
      {corners.map((c, i) => (
        <m.div
          key={c}
          className={`absolute ${c.includes('t') ? 'top-1' : 'bottom-1'} ${c.includes('l') ? 'left-1' : 'right-1'}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={drawn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.7, delay: 1.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${c.includes('l') ? 'left' : 'right'} ${c.includes('t') ? 'top' : 'bottom'}` }}
        >
          <CornerFiligree corner={c} tone="paper" className="h-14 w-14 sm:h-20 sm:w-20" />
        </m.div>
      ))}
    </div>
  );
}
