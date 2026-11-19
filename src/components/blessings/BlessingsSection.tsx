import { m } from 'framer-motion';
import { useRef, useState } from 'react';
import { coupleName, wedding } from '../../config/wedding';
import { useGuestName } from '../../hooks/useGuestName';
import { useInView } from '../../hooks/useInView';
import { haptic } from '../../lib/haptics';
import { fillName } from '../../lib/sanitize';
import { readStorage, STORAGE_KEYS, writeStorage } from '../../lib/storage';
import { Section } from '../layout/Section';
import { Divider } from '../ornaments/Divider';
import { Flourish } from '../ornaments/Flourish';
import { LotusBloom } from '../ornaments/LotusBloom';
import { Mandala } from '../ornaments/Mandala';
import { SectionHeading } from '../ui/SectionHeading';
import { FloralBorder } from './FloralBorder';
import { SendBlessing } from './SendBlessing';

/** Closing sheet: blessings, the couple's names, sign-off and "send your blessing". */
export default function BlessingsSection() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const drawn = useInView(sheetRef, { once: true, threshold: 0.15 });
  const guest = useGuestName();
  const [sent, setSent] = useState(() => readStorage('local', STORAGE_KEYS.blessingSent) === '1');

  const send = () => {
    setSent(true);
    haptic(18);
    writeStorage('local', STORAGE_KEYS.blessingSent, '1');
  };

  return (
    <Section
      id="blessings"
      material="velvet"
      damask
      labelledBy="blessings-heading"
      decor={
        /* golden glow that spreads when the lotus blooms */
        <m.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 50% at 50% 74%, rgb(232 214 163 / 0.3), rgb(201 164 92 / 0.12) 45%, transparent 75%)' }}
          initial={false}
          animate={{ opacity: sent ? 1 : 0 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      }
    >
      <div className="safe-pad-x py-[clamp(3rem,10vw,6rem)]">
        <div ref={sheetRef} className="tex-paper on-paper relative mx-auto max-w-[40rem] rounded-[4px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
          {/* glow on the paper itself */}
          <m.div
            aria-hidden="true"
            className="decor absolute inset-0"
            style={{ background: 'radial-gradient(70% 40% at 50% 82%, rgb(201 164 92 / 0.28), transparent 70%)' }}
            initial={false}
            animate={{ opacity: sent ? 1 : 0 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          />
          <div aria-hidden="true" className="decor absolute inset-0 grid place-items-center overflow-hidden">
            <Mandala className="h-[34rem] w-[34rem] max-w-none text-gold opacity-[0.07]" />
          </div>
          <FloralBorder drawn={drawn} />

          <div className="relative flex flex-col items-center px-[clamp(2rem,8vw,4.5rem)] pb-[clamp(3rem,9vw,4.5rem)] pt-[clamp(2.75rem,9vw,4.5rem)] text-center">
            <LotusBloom tone="paper" className="mb-3 h-12 w-16" />
            <SectionHeading
              id="blessings-heading"
              surface="paper"
              className="!text-[length:clamp(1.05rem,4.3vw,1.875rem)] !tracking-[0.12em]"
            >
              {wedding.blessings.heading}
            </SectionHeading>
            <p className="mt-6 max-w-[30rem] text-lead text-burgundy">{wedding.blessings.message}</p>
            {guest ? (
              <p className="mt-4 font-serif text-lead font-semibold italic text-maroon">
                {fillName(wedding.personal.honoured, guest)}
              </p>
            ) : null}

            {/* DEVEN & ADITI — hero name style */}
            <p className="mt-8 flex flex-col items-center sm:flex-row sm:gap-4">
              <span className="sr-only">{coupleName}</span>
              <span aria-hidden="true" className="foil-text-paper shimmer -mr-[0.16em] font-serif text-[length:clamp(2.1rem,9vw,3.5rem)] font-medium leading-none tracking-[0.16em]">
                {wedding.groom}
              </span>
              <span aria-hidden="true" className="flex items-center gap-2">
                <Flourish tone="paper" className="h-3 w-9 sm:hidden" />
                <span className="foil-text-paper font-serif text-[length:clamp(2.4rem,10vw,3.75rem)] font-medium italic leading-[1.1]">
                  {wedding.joiner}
                </span>
                <Flourish tone="paper" flip className="h-3 w-9 sm:hidden" />
              </span>
              <span aria-hidden="true" className="foil-text-paper shimmer -mr-[0.16em] font-serif text-[length:clamp(2.1rem,9vw,3.5rem)] font-medium leading-none tracking-[0.16em]">
                {wedding.bride}
              </span>
            </p>

            <p className="quote mt-6 text-maroon">{wedding.blessings.signOff}</p>
            <Divider tone="paper" className="mx-auto my-7 h-5 w-[min(14rem,70%)]" />
            <SendBlessing sent={sent} onSend={send} />
          </div>
        </div>
      </div>
    </Section>
  );
}
