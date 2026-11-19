import { ArrowLeft, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { coupleName, wedding } from '../config/wedding';
import { useToast } from '../hooks/useToast';
import { fillName, GUEST_NAME_MAX, sanitizeGuestName } from '../lib/sanitize';
import { copyText, guestUrl, whatsappUrl } from '../lib/share';
import { FourCorners } from './ornaments/CornerFiligree';
import { Divider } from './ornaments/Divider';
import { GoldButton } from './ui/GoldButton';

const OUTLINE =
  'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-gold/70 px-5 font-sans text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-champagne transition-colors hover:border-champagne hover:bg-gold/10';

/**
 * Hidden helper (/#/create-link): type a guest name, get a personalised
 * invitation link, copy it or send it straight to WhatsApp.
 */
export default function CreateLinkPage() {
  const [raw, setRaw] = useState('');
  const inputId = useId();
  const toast = useToast();
  const name = sanitizeGuestName(raw);
  const url = name ? guestUrl(name) : '';
  const t = wedding.createLink;

  useEffect(() => {
    const prev = document.title;
    document.title = `${t.heading} | ${coupleName}`;
    // keep this helper out of search results
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => {
      document.title = prev;
      meta.remove();
    };
  }, [t.heading]);

  const message = name ? `${fillName(wedding.personal.greeting, name)}\n${wedding.meta.title}\n${wedding.hero.quote}` : '';

  return (
    <main className="tex-velvet tex-damask screen-h safe-pad-x flex items-start justify-center py-12 sm:items-center">
      <div className="tex-paper on-paper relative w-full max-w-[34rem] rounded-[4px] px-[clamp(1.5rem,7vw,3rem)] py-[clamp(2.5rem,8vw,3.5rem)] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]">
        <div aria-hidden="true" className="absolute inset-2">
          <FourCorners tone="paper" className="h-12 w-12" />
        </div>
        <div className="relative">
          <h1 className="heading-royal foil-text-paper text-center text-[length:clamp(1.25rem,5vw,1.75rem)]">{t.heading}</h1>
          <Divider tone="paper" className="mx-auto mt-3 h-4 w-[min(14rem,70%)]" />
          <p className="mt-4 text-center text-lead text-burgundy">{t.intro}</p>

          <label htmlFor={inputId} className="eyebrow mt-8 block text-gold-deep">
            {t.nameLabel}
          </label>
          <input
            id={inputId}
            type="text"
            value={raw}
            maxLength={GUEST_NAME_MAX + 20}
            autoComplete="off"
            placeholder={t.placeholder}
            onChange={(e) => {
              setRaw(e.target.value);
            }}
            className="mt-2 block min-h-[48px] w-full rounded-lg border border-gold-deep/60 bg-ivory px-4 font-serif text-lead text-burgundy placeholder:text-burgundy/60 focus:border-maroon focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          />

          <div className="mt-6 rounded-xl border border-gold-deep/40 bg-cream/70 p-4 text-center" aria-live="polite">
            {name ? (
              <>
                <p className="eyebrow text-gold-deep">{t.previewLabel}</p>
                <p className="mt-1 font-serif text-[length:clamp(1.25rem,5vw,1.6rem)] font-semibold text-maroon">
                  {fillName(wedding.personal.greeting, name)}
                </p>
                <p className="eyebrow mt-4 text-gold-deep">{t.linkLabel}</p>
                <p className="mt-1 break-all font-sans text-[0.8125rem] text-burgundy">{url}</p>
              </>
            ) : (
              <p className="font-serif text-lead italic text-burgundy">{t.empty}</p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <GoldButton
              className="w-full disabled:opacity-50"
              disabled={!name}
              onClick={() => {
                window.open(whatsappUrl(message, url), '_blank', 'noopener,noreferrer');
              }}
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                {t.whatsapp}
              </span>
            </GoldButton>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!name}
                onClick={() => {
                  void copyText(url).then((ok) => {
                    toast(ok ? wedding.ui.linkCopied : wedding.ui.copyFailed);
                  });
                }}
                className={`${OUTLINE} !text-maroon !border-gold-deep/70 disabled:opacity-50`}
              >
                <Copy aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                {t.copy}
              </button>
              <a
                href={name ? url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!name}
                tabIndex={name ? undefined : -1}
                className={`${OUTLINE} !text-maroon !border-gold-deep/70 ${name ? '' : 'pointer-events-none opacity-50'}`}
              >
                <ExternalLink aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                {t.open}
              </a>
            </div>
          </div>

          <a href={window.location.pathname} className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-sans text-micro text-gold-deep underline underline-offset-4">
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {t.back}
          </a>
        </div>
      </div>
    </main>
  );
}
