export type ActionTone = 'paper' | 'dark';

/** Small gold-outline action buttons used on event cards. */
export const ACTION_BUTTON: Record<ActionTone, string> = {
  dark: 'border-gold/70 text-champagne hover:border-champagne hover:bg-gold/10',
  paper: 'border-gold-deep/80 text-maroon hover:border-maroon hover:bg-gold/10',
};

export const ACTION_BASE =
  'inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 font-sans text-[0.75rem] font-bold uppercase tracking-[0.14em] transition-colors duration-200';
