"use client";

import { useRef, type CSSProperties } from "react";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_COPY, dateRange } from "@/components/invite-shared/chapters/copy";
import { Countdown } from "@/components/invite-shared/countdown";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { EventActions, FamilySide, MadeWithLove, sectionsOf, useReveal, verseOf } from "@/components/invite-shared/story-parts";
import "./inside.css";

// Mahtab, inside: a night sky. The full moon rises over the names, the countdown sits in four glowing moons,
// the celebrations follow a gold thread down the sky, each marked by a phase of the moon that grows towards full,
// and every panel is dark glass edged in gold. Styles: inside.css (mt-*).

const ART = "/templates/mahtab";

/** How much of the moon is lit for event i of n: a thin crescent first, the full moon last. */
function phase(i: number, n: number): number {
  return n <= 1 ? 1 : 0.2 + (0.8 * i) / (n - 1);
}

export default function MahtabContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="mt-content" ref={root}>
      <div className="mt-stars" aria-hidden />

      <header className="mt-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mt-moon" src={`${ART}/moon-disc.webp`} alt="" aria-hidden data-r />
        {verse.arabic && <p className="mt-arabic" lang="ar" dir="rtl" data-r>{verse.arabic}</p>}
        <p className="mt-eyebrow" data-r>Under the light of the full moon</p>
        <h1 className="mt-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="mt-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="mt-eyebrow" data-r>{data.hashtag}</p>}
      </header>

      <section className="mt-glass mt-note" data-r>
        <p className="mt-dear">Dear {guest ?? "Guest"},</p>
        <p className="mt-lead">
          {data.welcomeMessage?.trim() || "As the moon rises over our celebrations, we would be honoured to have you beside us, to share our joy and to bless our new beginning."}
        </p>
        {verse.translation && <p className="mt-translation">{verse.translation}</p>}
      </section>

      {show.events && (
        <section className="mt-moons" data-r>
          <Countdown data={data} />
        </section>
      )}

      {/* The celebrations along a gold thread, the moon growing fuller at every step */}
      {show.events && (
        <section className="mt-timeline-section">
          <div className="mt-heading" data-r>
            <p className="mt-eyebrow">Our nights of</p>
            <h2>Celebration</h2>
          </div>
          <ol className="mt-timeline">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <li key={event.id} id={`event-${event.id}`} className="mt-step" data-r style={{ "--lit": phase(i, data.events.length) } as CSSProperties}>
                  <span className="mt-phase" aria-hidden />
                  <article className="mt-glass mt-event">
                    <p className="mt-event-date">
                      <b>{badge.day}</b> {badge.month} · {formatLongDate(event.date).split(",")[0]}
                    </p>
                    <h3>{event.title}</h3>
                    <p className="mt-event-kicker">{copy.subtitle}</p>
                    <dl className="mt-facts">
                      <dt>Time</dt>
                      <dd>{formatTimeRange(event.startTime, event.endTime) ?? "To be announced"}</dd>
                      <dt>Venue</dt>
                      <dd>
                        {event.venueName ?? "To be announced"}
                        {event.address && <small>{event.address}</small>}
                      </dd>
                      {event.dressCode && (
                        <>
                          <dt>Dress</dt>
                          <dd>{event.dressCode}</dd>
                        </>
                      )}
                    </dl>
                    {event.notes && <p className="mt-event-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </article>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {show.family && (
        <section className="mt-families">
          <div className="mt-heading" data-r>
            <p className="mt-eyebrow">Two families, one sky</p>
            <h2>With Their Blessings</h2>
          </div>
          <div className="mt-family-pair">
            {show.groomFamily && (
              <div className="mt-glass mt-family" data-r>
                <span className="mt-star" aria-hidden>✦</span>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="mt-glass mt-family" data-r style={{ ["--d" as string]: "120ms" }}>
                <span className="mt-star" aria-hidden>✦</span>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {show.gallery && (
        <section className="mt-gallery" data-r>
          <div className="mt-heading">
            <p className="mt-eyebrow">Moments by moonlight</p>
            <h2>Gallery</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="mt-glass mt-rsvp" data-r>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mt-roses" src={`${ART}/rose-corner.webp`} alt="" aria-hidden />
          <div className="mt-heading">
            <p className="mt-eyebrow">Kindly reply</p>
            <h2>Will you be there?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="mt-footer" data-r>
        <p className="mt-thanks">Thank you</p>
        <p className="mt-lead">for being part of our story. We cannot wait to celebrate with you.</p>
        <p className="mt-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
