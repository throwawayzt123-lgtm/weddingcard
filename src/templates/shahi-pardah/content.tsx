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

const ART = "/templates/shahi-pardah";

export default function ShahiPardahContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="spd-content" ref={root}>
      {/* Royal Stage Hero */}
      <header className="spd-hero">
        <div className="spd-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Royal wedding stage with hanging Moroccan lanterns, floral canopy, and trailing bridal train"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="spd-window-img"
            priority
          />
        </div>
        <div className="spd-bismillah-hero" data-r aria-hidden>
          ﷽
        </div>
        <p className="spd-eyebrow" data-r>Together with their families</p>
        <h1 className="spd-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="spd-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="spd-eyebrow spd-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Royal Welcome Decree */}
      <section className="spd-note spd-arched" data-r>
        {verse.arabic && <p className="spd-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="spd-translation">{verse.translation}</p>}
        <span className="spd-rule" aria-hidden />
        <p className="spd-dear">Dearest {guest ?? "Guest"},</p>
        <p className="spd-lead">
          {data.welcomeMessage?.trim() ||
            "Under the grace of Allah and amidst the blessings of our elders, we invite you to grace the royal wedding celebrations of our beloved children."}
        </p>
      </section>

      {/* Medallion Countdown */}
      {show.events && (
        <section className="spd-medallion" data-r>
          <div className="spd-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* Celebrations Corridor */}
      {show.events && (
        <section className="spd-corridor-section">
          <div className="spd-heading" data-r>
            <p className="spd-eyebrow">The Royal Itinerary</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="spd-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="spd-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="spd-door-top" aria-hidden>
                    <span className="spd-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="spd-door-body">
                    <p className="spd-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="spd-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="spd-rule" aria-hidden />
                    <p className="spd-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="spd-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="spd-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="spd-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="spd-swipe" aria-hidden>Swipe to view the ceremonies</p>}
        </section>
      )}

      {/* Families */}
      {show.family && (
        <section className="spd-families">
          <div className="spd-heading" data-r>
            <p className="spd-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="spd-windows">
            {show.groomFamily && (
              <div className="spd-family-window spd-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="spd-family-window spd-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery & RSVP */}
      {show.gallery && (
        <section className="spd-gallery" data-r>
          <div className="spd-heading">
            <p className="spd-eyebrow">Cherished Moments</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="spd-rsvp spd-arched" data-r>
          <div className="spd-heading">
            <p className="spd-eyebrow">Warmest Response</p>
            <h2>Will You Join Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="spd-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="spd-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="spd-thanks">Thank You</p>
        <p className="spd-lead">for gracing our lives and celebrating with our families.</p>
        <p className="spd-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
