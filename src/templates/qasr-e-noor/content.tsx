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

const ART = "/templates/qasr-e-noor";

export default function QasrNoorContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="qnd-content" ref={root}>
      {/* Ballroom Hero */}
      <header className="qnd-hero">
        <div className="qnd-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Grand crystal palace ballroom with multi-tiered chandeliers and starlit ceiling"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="qnd-window-img"
            priority
          />
        </div>
        <div className="qnd-bismillah-hero" data-r aria-hidden>
          ﷽
        </div>
        <p className="qnd-eyebrow" data-r>Together with their families</p>
        <h1 className="qnd-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="qnd-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="qnd-eyebrow qnd-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Royal Welcome Decree */}
      <section className="qnd-note qnd-arched" data-r>
        {verse.arabic && <p className="qnd-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="qnd-translation">{verse.translation}</p>}
        <span className="qnd-rule" aria-hidden />
        <p className="qnd-dear">Distinguished {guest ?? "Guest"},</p>
        <p className="qnd-lead">
          {data.welcomeMessage?.trim() ||
            "We request the honour of your presence at an enchanting evening of love, laughter, and celebration as we exchange sacred vows."}
        </p>
      </section>

      {/* Medallion Countdown */}
      {show.events && (
        <section className="qnd-medallion" data-r>
          <div className="qnd-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* Celebrations Corridor */}
      {show.events && (
        <section className="qnd-corridor-section">
          <div className="qnd-heading" data-r>
            <p className="qnd-eyebrow">The Grand Itinerary</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="qnd-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="qnd-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="qnd-door-top" aria-hidden>
                    <span className="qnd-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="qnd-door-body">
                    <p className="qnd-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="qnd-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="spd-rule" aria-hidden />
                    <p className="qnd-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="qnd-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="qnd-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="qnd-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="qnd-swipe" aria-hidden>Swipe to view the ceremonies</p>}
        </section>
      )}

      {/* Families */}
      {show.family && (
        <section className="qnd-families">
          <div className="qnd-heading" data-r>
            <p className="qnd-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="qnd-windows">
            {show.groomFamily && (
              <div className="qnd-family-window qnd-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="qnd-family-window qnd-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery & RSVP */}
      {show.gallery && (
        <section className="qnd-gallery" data-r>
          <div className="qnd-heading">
            <p className="qnd-eyebrow">Cherished Moments</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="qnd-rsvp qnd-arched" data-r>
          <div className="qnd-heading">
            <p className="qnd-eyebrow">Kindly Reply</p>
            <h2>Will You Join Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="qnd-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="qnd-footer-seal" src={`${ART}/crest.webp`} alt="" aria-hidden />
        <p className="qnd-thanks">Thank You</p>
        <p className="qnd-lead">for making our starlit celebration truly unforgettable.</p>
        <p className="qnd-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
