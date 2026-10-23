"use client";

import { useRef } from "react";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_COPY, dateRange } from "@/components/invite-shared/chapters/copy";
import { Countdown } from "@/components/invite-shared/countdown";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { EventActions, FamilySide, MadeWithLove, sectionsOf, useReveal, verseOf } from "@/components/invite-shared/story-parts";
import "./inside.css";

// Laal Gulab, inside: a wedding card suite laid out on burgundy velvet. The main card carries the wax seal,
// a printed "Order of Celebrations" programme lists every event with dotted leaders, the families are on two
// calling cards, the countdown is foil stamped on a wine band, and the reply card has an envelope flap.
// Styles: inside.css (lg-*).

const ART = "/templates/laal-gulab";

function Roses({ flip = false }: { flip?: boolean }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={`lg-roses ${flip ? "lg-roses-tr" : "lg-roses-tl"}`} src={`${ART}/rose-corner.webp`} alt="" aria-hidden />
    </>
  );
}

export default function LaalGulabContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="lg-content" ref={root}>
      {/* 1. The main card, sealed with wine wax */}
      <header className="lg-card lg-card-main" data-r>
        <Roses />
        <Roses flip />
        <div className="lg-foil">
          {verse.arabic && <p className="lg-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
          <p className="lg-caps">Together with their families</p>
          <h1 className="lg-names" aria-label={`${data.groomName} and ${data.brideName}`}>
            <span>{data.groomName}</span>
            <i aria-hidden>&amp;</i>
            <span>{data.brideName}</span>
          </h1>
          <p className="lg-caps">request the pleasure of your company</p>
          <p className="lg-date">{dateRange(data)}</p>
          {data.hashtag && <p className="lg-caps lg-hashtag">{data.hashtag}</p>}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lg-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
      </header>

      {/* 2. A handwritten note, tucked in at an angle */}
      <section className="lg-card lg-note" data-r>
        <p className="lg-dear">Dear {guest ?? "Guest"},</p>
        <p className="lg-lead">
          {data.welcomeMessage?.trim() || "Your presence would make our celebrations complete. With love and prayers, we hope you will join us as we begin our new life together."}
        </p>
        {verse.translation && <p className="lg-translation">{verse.translation}</p>}
      </section>

      {/* 3. The countdown, foil stamped on a wine band */}
      {show.events && (
        <section className="lg-band" data-r>
          <Countdown data={data} />
        </section>
      )}

      {/* 4. The programme: every celebration on one printed card */}
      {show.events && (
        <section className="lg-card lg-programme" data-r>
          <p className="lg-caps">The order of</p>
          <h2 className="lg-title">Celebrations</h2>
          <span className="lg-flourish" aria-hidden>❦</span>
          <ol className="lg-rows">
            {data.events.map((event) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              const time = formatTimeRange(event.startTime, event.endTime);
              return (
                <li key={event.id} id={`event-${event.id}`} className="lg-row" data-r>
                  <div className="lg-row-head">
                    <span className="lg-stamp">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                    <span className="lg-row-name">
                      <strong>{event.title}</strong>
                      <em>{copy.kicker}</em>
                    </span>
                    <span className="lg-leader" aria-hidden />
                    <span className="lg-row-time">{time ?? "To be announced"}</span>
                  </div>
                  <div className="lg-row-detail">
                    <p>{formatLongDate(event.date)}</p>
                    <p className="lg-row-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="lg-row-muted">{event.address}</p>}
                    {event.dressCode && <p className="lg-row-muted"><b>Dress code:</b> {event.dressCode}</p>}
                    {event.notes && <p className="lg-row-muted">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* 5. The families, on two calling cards */}
      {show.family && (
        <section className="lg-families">
          <h2 className="lg-title lg-on-velvet" data-r>With the blessings of</h2>
          <div className="lg-calling">
            {show.groomFamily && (
              <div className="lg-card lg-calling-card" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="lg-card lg-calling-card" data-r style={{ ["--d" as string]: "120ms" }}>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {show.gallery && (
        <section className="lg-card lg-album" data-r>
          <p className="lg-caps">A few moments</p>
          <h2 className="lg-title">Our Album</h2>
          <Gallery photos={data.photos} />
        </section>
      )}

      {/* 6. The reply card, with an envelope flap */}
      {show.rsvp && (
        <section id="rsvp" className="lg-card lg-reply" data-r>
          <span className="lg-reply-flap" aria-hidden />
          <p className="lg-caps">Répondez s&apos;il vous plaît</p>
          <h2 className="lg-title">Kindly Reply</h2>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="lg-footer" data-r>
        <p className="lg-thanks">With love and gratitude</p>
        <p className="lg-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
