// Date/time helpers shared by the server and the browser.
// Event dates are plain calendar dates ("2026-12-12"); times are "HH:mm" in the
// invitation's own timezone (Asia/Karachi by default). We format by hand
// (not with Intl) so the server and the browser always print identical text,
// which avoids React "hydration" mismatches.

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "2026-12-12" → { y, m (1-12), d }. */
export function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d };
}

/** Date object → "YYYY-MM-DD" using its UTC parts (Postgres DATE columns arrive as UTC midnight). */
export function toYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** "Friday, 12 December 2026" */
export function formatLongDate(ymd: string): string {
  const { y, m, d } = parseYmd(ymd);
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** "12 December 2026" */
export function formatDate(ymd: string): string {
  const { y, m, d } = parseYmd(ymd);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** { day: "12", month: "DEC" } for the little date badge on event cards. */
export function dateBadge(ymd: string): { day: string; month: string } {
  const { m, d } = parseYmd(ymd);
  return { day: String(d), month: MONTHS[m - 1].slice(0, 3).toUpperCase() };
}

/** "19:30" → "7:30 PM" */
export function formatTime(hhmm: string | null): string | null {
  if (!hhmm) return null;
  const [h, min] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(min).padStart(2, "0")} ${suffix}`;
}

/** "7:00 PM – 11:30 PM", "7:00 PM onwards", or null. */
export function formatTimeRange(start: string | null, end: string | null): string | null {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} to ${e}`;
  if (s) return `${s} onwards`;
  return null;
}

/** Milliseconds the timezone is ahead of UTC at a given instant. */
function tzOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/**
 * The exact moment ("2026-12-12", "19:30") happens in `timeZone`, as epoch ms.
 * Without a time, returns midnight at the start of that day.
 */
export function zonedToEpoch(ymd: string, hhmm: string | null, timeZone: string): number {
  const { y, m, d } = parseYmd(ymd);
  const [h, min] = (hhmm ?? "00:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, min);
  const first = guess - tzOffsetMs(guess, timeZone);
  // Second pass handles the rare case where the offset differs at the result.
  return guess - tzOffsetMs(first, timeZone);
}

/** Start instant (epoch ms) of an event. */
export function eventStartMs(event: { date: string; startTime: string | null }, timeZone: string): number {
  return zonedToEpoch(event.date, event.startTime, timeZone);
}
