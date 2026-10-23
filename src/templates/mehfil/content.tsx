"use client";

import { useEffect, useState, useRef, type CSSProperties } from "react";
import { dateBadge, eventStartMs, formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_COPY, dateRange } from "@/components/invite-shared/chapters/copy";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { EventActions, FamilySide, MadeWithLove, sectionsOf, useReveal, verseOf } from "@/components/invite-shared/story-parts";
import type { InvitationViewData } from "@/templates/types";
import "./inside.css";

// Mehfil, inside: a mela. A mandala turns behind the names under a marigold swag, the countdown hangs on
// bunting flags, every celebration is a bright ticket with a tear-off stub, and the families sit in round
// mirror work badges. Styles: inside.css (mf-*).

const ART = "/templates/mehfil";
const TICKET_COLOURS = ["#c2185b", "#1b8a4c", "#f57c00", "#00897b", "#7b1fa2"];

/** The countdown on four bunting flags (days, hours, minutes, seconds). */
function Bunting({ data }: { data: InvitationViewData }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const upcoming = now === null ? undefined : data.events.find((e) => eventStartMs(e, data.timezone) > now);
  if (now !== null && !upcoming) {
    return <p className="mf-bunting-done">Married with joy since {formatLongDate(data.weddingDate)}</p>;
  }
  const left = upcoming && now !== null ? Math.max(0, Math.floor((eventStartMs(upcoming, data.timezone) - now) / 1000)) : 0;
  const cells: [string, number][] = [
    ["Days", Math.floor(left / 86400)],
    ["Hours", Math.floor((left % 86400) / 3600)],
    ["Minutes", Math.floor((left % 3600) / 60)],
    ["Seconds", left % 60],
  ];
  return (
    <div className="mf-bunting-wrap">
      <p className="mf-eyebrow">The dhol starts for {upcoming?.title ?? data.events[0]?.title} in</p>
      <div className="mf-bunting" role="timer" aria-label="Countdown">
        {cells.map(([label, value], i) => (
          <div key={label} className="mf-flag" style={{ "--c": TICKET_COLOURS[i] } as CSSProperties}>
            <b suppressHydrationWarning>{now === null ? "00" : String(value).padStart(2, "0")}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MehfilContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="mf-content" ref={root}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="mf-swag" src={`${ART}/swag.webp`} alt="" aria-hidden />

      <header className="mf-hero">
        <div className="mf-mandala" aria-hidden />
        <div className="mf-hero-words">
          <p className="mf-eyebrow" data-r>Let the festivities begin</p>
          <h1 className="mf-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
            <span>{data.groomName}</span>
            <i aria-hidden>&amp;</i>
            <span>{data.brideName}</span>
          </h1>
          <p className="mf-dates" data-r>{dateRange(data)}</p>
          {data.hashtag && <p className="mf-eyebrow" data-r>{data.hashtag}</p>}
        </div>
      </header>

      <section className="mf-note" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mf-parasol" src={`${ART}/parasol.webp`} alt="" aria-hidden />
        {verse.arabic && <p className="mf-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        <p className="mf-dear">Dear {guest ?? "Guest"},</p>
        <p className="mf-lead">
          {data.welcomeMessage?.trim() || "Bring your brightest colours and your best dance moves! Join us for music, mehndi, laughter and love as we celebrate with the people we hold dearest."}
        </p>
        {verse.translation && <p className="mf-translation">{verse.translation}</p>}
      </section>

      {show.events && (
        <section className="mf-count" data-r>
          <Bunting data={data} />
        </section>
      )}

      {/* Tickets */}
      {show.events && (
        <section className="mf-tickets-section">
          <div className="mf-heading" data-r>
            <p className="mf-eyebrow">Your tickets to</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="mf-tickets">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              const style = { "--c": TICKET_COLOURS[i % TICKET_COLOURS.length], "--tilt": i % 2 ? "1.4deg" : "-1.4deg" } as CSSProperties;
              return (
                <article key={event.id} id={`event-${event.id}`} className="mf-ticket" data-r style={style}>
                  <div className="mf-ticket-main">
                    <p className="mf-ticket-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="mf-ticket-when">
                      {formatLongDate(event.date)} · {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <p className="mf-ticket-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="mf-ticket-muted">{event.address}</p>}
                    {event.dressCode && <p className="mf-ticket-muted"><b>Wear:</b> {event.dressCode}</p>}
                    {event.notes && <p className="mf-ticket-muted">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                  <div className="mf-ticket-stub" aria-hidden>
                    <small>Admit</small>
                    <b>{badge.day}</b>
                    <small>{badge.month}</small>
                    <span>No. {String(i + 1).padStart(3, "0")}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {show.family && (
        <section className="mf-families">
          <div className="mf-heading" data-r>
            <p className="mf-eyebrow">Hosted with love by</p>
            <h2>Our Families</h2>
          </div>
          <div className="mf-badges">
            {show.groomFamily && (
              <div className="mf-badge" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="mf-badge" data-r style={{ ["--d" as string]: "120ms" }}>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {show.gallery && (
        <section className="mf-gallery" data-r>
          <div className="mf-heading">
            <p className="mf-eyebrow">Colours of our story</p>
            <h2>Gallery</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="mf-rsvp" data-r>
          <div className="mf-heading">
            <p className="mf-eyebrow">Kindly reply</p>
            <h2>Will you dance with us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="mf-footer" data-r>
        <p className="mf-thanks">Shukriya!</p>
        <p className="mf-lead">for being part of our story. We cannot wait to celebrate with you.</p>
        <p className="mf-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
