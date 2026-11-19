import { wedding } from '../config/wedding';

/** The invitation URL without query/hash (so a guest's personal greeting isn't forwarded). */
export function invitationUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

/** Personalised link for a guest (used by the create-link helper). */
export function guestUrl(name: string): string {
  return `${invitationUrl()}?guest=${encodeURIComponent(name)}`;
}

export function shareText(): string {
  return `${wedding.meta.title}\n${wedding.hero.quote}`;
}

export function whatsappUrl(text: string, url: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

/** Copies text; falls back to a hidden textarea for older in-app browsers. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      // Legacy API is the only option in some WebViews without Clipboard API access.
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;
}
