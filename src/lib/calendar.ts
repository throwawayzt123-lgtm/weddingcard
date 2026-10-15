// "Add to calendar" helpers: a downloadable .ics file and a Google Calendar link.
import { parseYmd, zonedToEpoch } from "./dates";
import type { InviteEvent } from "@/templates/types";

type CalendarContext = { coupleTitle: string; timezone: string };

/** 20261212T143000Z */
function utcStamp(ms: number): string {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** 20261212 (for all-day events) */
function dayStamp(ymd: string, addDays = 0): string {
  const { y, m, d } = parseYmd(ymd);
  return new Date(Date.UTC(y, m - 1, d + addDays)).toISOString().slice(0, 10).replace(/-/g, "");
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** ICS lines must be ≤ 75 bytes; longer lines are folded with a leading space. */
function fold(line: string): string {
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 73) {
    chunks.push(rest.slice(0, 73));
    rest = " " + rest.slice(73);
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function range(event: InviteEvent, tz: string): { allDay: boolean; start: number; end: number } {
  if (!event.startTime) {
    const start = zonedToEpoch(event.date, null, tz);
    return { allDay: true, start, end: start + 24 * 3600 * 1000 };
  }
  const start = zonedToEpoch(event.date, event.startTime, tz);
  // No end time? Assume 3 hours. An end before the start means "after midnight".
  let end = event.endTime ? zonedToEpoch(event.date, event.endTime, tz) : start + 3 * 3600 * 1000;
  if (end <= start) end += 24 * 3600 * 1000;
  return { allDay: false, start, end };
}

function description(event: InviteEvent): string {
  return [event.dressCode && `Dress code: ${event.dressCode}`, event.notes].filter(Boolean).join("\n");
}

function location(event: InviteEvent): string {
  return [event.venueName, event.address].filter(Boolean).join(", ");
}

/** Full text of a .ics file for one event. */
export function buildIcs(event: InviteEvent, ctx: CalendarContext): string {
  const { allDay, start, end } = range(event, ctx.timezone);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.id}@invitation`,
    `DTSTAMP:${utcStamp(Date.now())}`,
    allDay ? `DTSTART;VALUE=DATE:${dayStamp(event.date)}` : `DTSTART:${utcStamp(start)}`,
    allDay ? `DTEND;VALUE=DATE:${dayStamp(event.date, 1)}` : `DTEND:${utcStamp(end)}`,
    `SUMMARY:${escapeIcs(`${event.title} — ${ctx.coupleTitle}`)}`,
    `DESCRIPTION:${escapeIcs(description(event))}`,
    `LOCATION:${escapeIcs(location(event))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n");
}

/** Link that opens Google Calendar with the event pre-filled. */
export function googleCalendarUrl(event: InviteEvent, ctx: CalendarContext): string {
  const { allDay, start, end } = range(event, ctx.timezone);
  const dates = allDay ? `${dayStamp(event.date)}/${dayStamp(event.date, 1)}` : `${utcStamp(start)}/${utcStamp(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} — ${ctx.coupleTitle}`,
    dates,
    details: description(event),
    location: location(event),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Fallback directions link when the owner did not paste a Google Maps URL. */
export function mapsUrl(event: InviteEvent): string | null {
  if (event.mapUrl) return event.mapUrl;
  const q = location(event);
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}
