"use client";

import { useRef } from "react";
import Image from "next/image";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_COPY, dateRange } from "@/components/invite-shared/chapters/copy";
import { Countdown } from "@/components/invite-shared/countdown";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { EventActions, FamilySide, MadeWithLove, sectionsOf, useReveal, verseOf } from "@/components/invite-shared/story-parts";
import "./inside.css";

const ART = "/templates/shahi-banafsha";

export default function ShahiBanafshaContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="sbd-content" ref={root}>
      {/* Die-Cut Hero */}
      <header className="sbd-hero">
        <div className="sbd-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Scalloped Victorian gold die-cut card with imperial amethyst purple velvet"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="sbd-window-img"
            priority
          />
        </div>
        <div className="sbd-bismillah-hero" data-r aria-hidden>
          ﷽
        </div>
        <p className="sbd-eyebrow" data-r>Together with their families</p>
        <h1 className="sbd-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="sbd-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="sbd-eyebrow sbd-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Royal Welcome Decree */}
      <section className="sbd-note sbd-arched" data-r>
        {verse.arabic && <p className="sbd-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="sbd-translation">{verse.translation}</p>}
        <span className="sbd-rule" aria-hidden />
        <p className="sbd-dear">Honoured {guest ?? "Guest"},</p>
        <p className="sbd-lead">
          {data.welcomeMessage?.trim() ||
            "With immense joy and the choicest blessings of the Almighty, we warmly request the pleasure of your company to celebrate the auspicious wedding of our beloved children."}
        </p>
      </section>

      {/* Medallion Countdown */}
      {show.events && (
        <section className="sbd-medallion" data-r>
          <div className="sbd-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* Celebrations Corridor */}
      {show.events && (
        <section className="sbd-corridor-section">
          <div className="sbd-heading" data-r>
            <p className="sbd-eyebrow">The Royal Itinerary</p>
            <h2>Order of Celebrations</h2>
          </div>
          <div className="sbd-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="sbd-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="sbd-door-top" aria-hidden>
                    <span className="sbd-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="sbd-door-body">
                    <p className="sbd-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="sbd-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="sbd-rule" aria-hidden />
                    <p className="sbd-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="sbd-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="sbd-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="sbd-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="sbd-swipe" aria-hidden>Swipe to view the ceremonies</p>}
        </section>
      )}

      {/* Families */}
      {show.family && (
        <section className="sbd-families">
          <div className="sbd-heading" data-r>
            <p className="sbd-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="sbd-windows">
            {show.groomFamily && (
              <div className="sbd-family-window sbd-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="sbd-family-window sbd-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery & RSVP */}
      {show.gallery && (
        <section className="sbd-gallery" data-r>
          <div className="sbd-heading">
            <p className="sbd-eyebrow">Cherished Moments</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="sbd-rsvp sbd-arched" data-r>
          <div className="sbd-heading">
            <p className="sbd-eyebrow">Royal Confirmation</p>
            <h2>Will You Grace Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="sbd-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sbd-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="sbd-thanks">Thank You</p>
        <p className="sbd-lead">for your gracious love and royal presence on our special day.</p>
        <p className="sbd-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
