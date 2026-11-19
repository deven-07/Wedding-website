export const GUEST_NAME_MAX = 40;

/**
 * Turns an untrusted `?guest=` value into safe display text:
 * letters (any script), combining marks, digits, spaces and & . , ' -
 * Everything else is dropped, whitespace collapsed, max 40 characters.
 * Returns null when nothing meaningful remains.
 */
export function sanitizeGuestName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw
    .normalize('NFKC')
    .replace(/<(script|style)\b[\s\S]*?(<\/\1\s*>|$)/gi, ' ') // drop script/style blocks with content
    .replace(/<[^>]*>?/g, ' ') // drop anything tag-like entirely
    .replace(/https?:\/\/\S+|www\.\S+/gi, ' ') // and links
    .replace(/[^\p{L}\p{M}\p{N} &.,'’-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\s&.,'’-]+|[\s&,'’-]+$/gu, '');
  if (!/\p{L}/u.test(cleaned)) return null;
  const chars = Array.from(cleaned);
  const clipped = chars.length > GUEST_NAME_MAX ? chars.slice(0, GUEST_NAME_MAX).join('').trim() : cleaned;
  return clipped || null;
}

/** Fills `{name}` in a config template. */
export function fillName(template: string, name: string): string {
  return template.replace('{name}', name);
}
