import { coupleName, wedding, type WeddingEvent } from '../config/wedding';
import { calendarTitle, eventEnd, eventStart, toIstLocalStamp, toUtcStamp } from './calendarLinks';

/** RFC 5545 TEXT escaping. */
function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Fold content lines at 75 octets (UTF-8 aware), continuation lines start with a space. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let size = 0;
  for (const ch of line) {
    const bytes = encoder.encode(ch).length;
    const limit = parts.length === 0 ? 75 : 74; // continuation lines carry a leading space
    if (size + bytes > limit) {
      parts.push(current);
      current = '';
      size = 0;
    }
    current += ch;
    size += bytes;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Asia/Kolkata',
  'BEGIN:STANDARD',
  'DTSTART:19700101T000000',
  'TZOFFSETFROM:+0530',
  'TZOFFSETTO:+0530',
  'TZNAME:IST',
  'END:STANDARD',
  'END:VTIMEZONE',
];

/** Builds a complete .ics calendar for one event, in Asia/Kolkata time. */
export function buildIcs(event: WeddingEvent, now: Date = new Date()): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${coupleName}//Wedding Invitation//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...VTIMEZONE,
    'BEGIN:VEVENT',
    `UID:${event.id}-${toIstLocalStamp(eventStart(event))}@${wedding.groom.toLowerCase()}-and-${wedding.bride.toLowerCase()}`,
    `DTSTAMP:${toUtcStamp(now)}`,
    `DTSTART;TZID=Asia/Kolkata:${toIstLocalStamp(eventStart(event))}`,
    `DTEND;TZID=Asia/Kolkata:${toIstLocalStamp(eventEnd(event))}`,
    `SUMMARY:${escapeText(calendarTitle(event))}`,
    `DESCRIPTION:${escapeText(event.quote)}`,
    ...(event.venue ? [`LOCATION:${escapeText(event.venue)}`] : []),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.map(fold).join('\r\n')}\r\n`;
}

export function icsFileName(event: WeddingEvent): string {
  return `${wedding.groom}-${wedding.bride}-${event.id}.ics`.toLowerCase();
}

/** Triggers a client-side download of the event's .ics file. */
export function downloadIcs(event: WeddingEvent): void {
  const blob = new Blob([buildIcs(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = icsFileName(event);
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 4000);
}
