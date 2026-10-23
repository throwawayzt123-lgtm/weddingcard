"use client";

import { useEffect, useState, type RefObject } from "react";
import { CalendarPlus, Heart, Navigation, Phone } from "lucide-react";
import { googleCalendarUrl, mapsUrl } from "@/lib/calendar";
import type { InvitationViewData, InviteEvent, InviteFamilySide } from "@/templates/types";
import { downloadIcs } from "./events";
import "./story-parts.css";

// Small pieces shared by the page bodies of the Royal designs (each design lays them out and styles them itself).
// Class names start with "sp-" so a design can style them under its own root, e.g. `.lg-content .sp-btn`.

const DEFAULT_VERSE = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const ARABIC = /[؀-ۿ]/;

/** The verse at the top: an Arabic line and/or its translation (the Bismillah when the couple wrote none). */
export function verseOf(data: InvitationViewData): { arabic: string | null; translation: string | null } {
  const verse = data.verseText?.trim();
  if (!verse) return { arabic: DEFAULT_VERSE, translation: "In the name of Allah, the Most Gracious, the Most Merciful" };
  return ARABIC.test(verse) ? { arabic: verse, translation: null } : { arabic: null, translation: verse };
}

/** Which optional parts this invitation shows. */
export function sectionsOf(data: InvitationViewData) {
  const hasFamily = (s: InviteFamilySide) => !!s.parentsLine || s.members.length > 0;
  return {
    events: data.events.length > 0,
    family: hasFamily(data.groomFamily) || hasFamily(data.brideFamily),
    groomFamily: hasFamily(data.groomFamily),
    brideFamily: hasFamily(data.brideFamily),
    gallery: data.features.gallery && data.photos.length > 0,
    rsvp: data.features.rsvp && !!data.guest && data.events.length > 0,
  };
}

/**
 * Marks every [data-r] element inside `root` with data-in="true" once it scrolls into view, so CSS can animate it in.
 * Everything shows at once for guests who prefer less motion. Starts when the opening has finished (`opened`).
 */
export function useReveal(root: RefObject<HTMLElement | null>, opened: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!el || !opened) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-r]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((i) => (i.dataset.in = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.in = "true";
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root, opened]);
}

/** "Add to calendar" (Apple / Outlook file or Google) and "Directions" for one event. */
export function EventActions({ event, data }: { event: InviteEvent; data: InvitationViewData }) {
  const [open, setOpen] = useState(false);
  const directions = mapsUrl(event);
  const ctx = { coupleTitle: `${data.groomName} & ${data.brideName}`, timezone: data.timezone };
  return (
    <div className="sp-actions">
      <button type="button" className="sp-btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <CalendarPlus aria-hidden />
        Add to calendar
      </button>
      {directions && (
        <a className="sp-btn sp-btn-ghost" href={directions} target="_blank" rel="noopener noreferrer">
          <Navigation aria-hidden />
          Directions
        </a>
      )}
      {open && (
        <div className="sp-cal-menu">
          <button type="button" onClick={() => { downloadIcs(event, data); setOpen(false); }}>
            Apple / Outlook (.ics file)
          </button>
          <a href={googleCalendarUrl(event, ctx)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** One side of the family: the parents' line and the family members (with a call button when shared). */
export function FamilySide({ title, side }: { title: string; side: InviteFamilySide }) {
  return (
    <div className="sp-family">
      <p className="sp-family-title">{title}</p>
      {side.parentsLine && <p className="sp-family-parents">{side.parentsLine}</p>}
      {side.members.length > 0 && (
        <ul className="sp-family-members">
          {side.members.map((m) => (
            <li key={m.id}>
              <span>{m.name}</span>
              {m.showPhone && m.phone && (
                <a href={telHref(m.phone)} className="sp-phone">
                  <Phone aria-hidden />
                  {m.phone}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The small credit at the very end (only when the plan shows it). */
export function MadeWithLove({ data }: { data: InvitationViewData }) {
  if (!data.features.showBadge) return null;
  return (
    <a href={data.brand.url} target="_blank" rel="noopener noreferrer" className="sp-badge">
      Made with <Heart aria-label="love" /> by {data.brand.name}
    </a>
  );
}
