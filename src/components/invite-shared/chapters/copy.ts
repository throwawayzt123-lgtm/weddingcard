import type { EventKind, InvitationViewData } from "@/templates/types";

// The words of the full-screen chapters: a line for each kind of celebration, plus small date helpers.

export type EventCopy = { kicker: string; subtitle: string; caption: string };

export const EVENT_COPY: Record<EventKind, EventCopy> = {
  DHOLKI: { kicker: "Music, dance and laughter", subtitle: "Let the drums begin.", caption: "Let the celebrations begin." },
  MAYUN: { kicker: "A tender beginning", subtitle: "Turmeric, blessings and family.", caption: "Wrapped in love." },
  MEHNDI: { kicker: "An evening of joy", subtitle: "A little colour. A lot of love.", caption: "Let the celebrations begin." },
  NIKKAH: { kicker: "The sacred bond", subtitle: "Two hearts. One beautiful promise.", caption: "A moment. A promise. Forever." },
  BARAAT: { kicker: "The wedding celebration", subtitle: "Two hearts. One beautiful promise.", caption: "A moment. A promise. Forever." },
  RUKHSATI: { kicker: "A heartfelt farewell", subtitle: "A new home, with all our blessings.", caption: "Until we meet again." },
  WALIMA: { kicker: "The wedding reception", subtitle: "The first chapter of our forever.", caption: "With love, always." },
  CUSTOM: { kicker: "A celebration", subtitle: "Join us for a joyful occasion.", caption: "Made to be shared." },
};

const WORDS = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
export function countWord(n: number): string {
  return WORDS[n] ?? String(n);
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function ymd(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { y, m, d };
}

/** "March 2027" */
export function monthYear(value: string): string {
  const { y, m } = ymd(value);
  return `${MONTHS[(m || 1) - 1]} ${y}`;
}

function longDate(value: string): string {
  const { y, m, d } = ymd(value);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
}

/** "05 to 07 March 2027" when the celebrations run over several days, otherwise one date. */
export function dateRange(data: Pick<InvitationViewData, "events" | "weddingDate">): string {
  const dates = [...new Set(data.events.map((e) => e.date))].sort();
  if (dates.length < 2) return longDate(dates[0] ?? data.weddingDate);
  const a = ymd(dates[0]);
  const b = ymd(dates[dates.length - 1]);
  const day = (n: number) => String(n).padStart(2, "0");
  if (a.y === b.y && a.m === b.m) return `${day(a.d)} to ${day(b.d)} ${MONTHS[a.m - 1]} ${a.y}`;
  return `${day(a.d)} ${MONTHS[a.m - 1].slice(0, 3)} to ${day(b.d)} ${MONTHS[b.m - 1].slice(0, 3)} ${b.y}`;
}

/** Is this colour light? (decides whether text over it should be dark) */
export function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
