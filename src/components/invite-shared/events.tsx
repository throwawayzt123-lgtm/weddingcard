"use client";

import { useState } from "react";
import {
  CalendarPlus, CarFront, Cake, CalendarHeart, Clock, Drum, Flower2, Heart, House, MapPin, Navigation, Shirt, Sparkles, UtensilsCrossed,
} from "lucide-react";
import { buildIcs, googleCalendarUrl, mapsUrl } from "@/lib/calendar";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import type { EventKind, InvitationViewData, InviteEvent } from "@/templates/types";

const ICONS: Record<EventKind, typeof Heart> = {
  DHOLKI: Drum,
  MAYUN: Sparkles,
  MEHNDI: Flower2,
  NIKKAH: Heart,
  BARAAT: CarFront,
  RUKHSATI: House,
  WALIMA: UtensilsCrossed,
  CUSTOM: Cake,
};

export function eventIcon(type: EventKind) {
  return ICONS[type] ?? CalendarHeart;
}

/** Downloads a .ics file in the browser (works with Apple, Outlook and Google Calendar apps). */
function downloadIcs(event: InviteEvent, data: InvitationViewData) {
  const ics = buildIcs(event, { coupleTitle: `${data.groomName} & ${data.brideName}`, timezone: data.timezone });
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EventCard({ event, data, index }: { event: InviteEvent; data: InvitationViewData; index: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = eventIcon(event.type);
  const badge = dateBadge(event.date);
  const time = formatTimeRange(event.startTime, event.endTime);
  const directions = mapsUrl(event);
  const ctx = { coupleTitle: `${data.groomName} & ${data.brideName}`, timezone: data.timezone };

  return (
    <article id={`event-${event.id}`} className="inv-event-card" data-type={event.type} style={{ ["--i" as string]: index }}>
        <header className="inv-event-head">
          <span className="inv-event-icon">
            <Icon className="size-6" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="inv-event-title">{event.title}</h3>
            <p className="inv-event-date">{formatLongDate(event.date)}</p>
          </div>
          <div className="inv-date-badge" aria-hidden>
            <span className="text-2xl leading-none font-semibold">{badge.day}</span>
            <span className="text-[0.62rem] tracking-[0.2em]">{badge.month}</span>
          </div>
        </header>

        <ul className="inv-event-facts">
          {time && (
            <li>
              <Clock className="size-4 shrink-0" aria-hidden />
              <span>{time}</span>
            </li>
          )}
          {(event.venueName || event.address) && (
            <li>
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span>
                {event.venueName && <strong className="font-semibold">{event.venueName}</strong>}
                {event.venueName && event.address && <br />}
                {event.address}
              </span>
            </li>
          )}
          {event.dressCode && (
            <li>
              <Shirt className="size-4 shrink-0" aria-hidden />
              <span>
                <em>Dress code:</em> {event.dressCode}
              </span>
            </li>
          )}
        </ul>

        {event.notes && <p className="inv-event-notes">{event.notes}</p>}

        <div className="inv-event-actions">
          {directions && (
            <a href={directions} target="_blank" rel="noopener noreferrer" className="inv-btn">
              <Navigation className="size-4" aria-hidden />
              Get Directions
            </a>
          )}
          <div className="relative">
            <button type="button" className="inv-btn inv-btn-ghost w-full" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
              <CalendarPlus className="size-4" aria-hidden />
              Add to Calendar
            </button>
            {menuOpen && (
              <div className="inv-menu" role="menu">
                <button type="button" role="menuitem" onClick={() => { downloadIcs(event, data); setMenuOpen(false); }}>
                  Apple / Outlook (.ics file)
                </button>
                <a role="menuitem" href={googleCalendarUrl(event, ctx)} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                  Google Calendar
                </a>
              </div>
            )}
          </div>
        </div>
    </article>
  );
}

export function Events({ data }: { data: InvitationViewData }) {
  return (
    <div className="inv-event-stack">
      {data.events.map((event, i) => (
        <EventCard key={event.id} event={event} data={data} index={i} />
      ))}
    </div>
  );
}
