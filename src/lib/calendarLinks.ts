import { coupleName, type WeddingEvent } from '../config/wedding';

/** Default event length when none is given. */
export const EVENT_DURATION_MS = 2 * 60 * 60 * 1000;
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export function eventStart(event: WeddingEvent): Date {
  const ms = Date.parse(event.isoStart);
  if (Number.isNaN(ms)) throw new Error(`Invalid isoStart for ${event.id}`);
  return new Date(ms);
}

export function eventEnd(event: WeddingEvent): Date {
  return new Date(eventStart(event).getTime() + EVENT_DURATION_MS);
}

const pad = (n: number) => String(n).padStart(2, '0');

/** 20261210T063000Z — UTC basic format. */
export function toUtcStamp(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(
    date.getUTCMinutes(),
  )}${pad(date.getUTCSeconds())}Z`;
}

/** 20261210T120000 — wall-clock time in Asia/Kolkata (no Z). */
export function toIstLocalStamp(date: Date): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  return `${ist.getUTCFullYear()}${pad(ist.getUTCMonth() + 1)}${pad(ist.getUTCDate())}T${pad(ist.getUTCHours())}${pad(
    ist.getUTCMinutes(),
  )}${pad(ist.getUTCSeconds())}`;
}

export function calendarTitle(event: WeddingEvent): string {
  return `${event.title} | ${coupleName}`;
}

/** Google Calendar "create event" link (UTC times + Asia/Kolkata display zone). */
export function googleCalendarUrl(event: WeddingEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: calendarTitle(event),
    dates: `${toUtcStamp(eventStart(event))}/${toUtcStamp(eventEnd(event))}`,
    ctz: 'Asia/Kolkata',
    details: event.quote,
  });
  if (event.venue) params.set('location', event.venue);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
