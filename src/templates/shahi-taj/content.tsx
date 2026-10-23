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

const ART = "/templates/shahi-taj";

function CrownCorners() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="st-corner st-corner-tl" src={`${ART}/crown-corner.webp`} alt="" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="st-corner st-corner-br" src={`${ART}/crown-corner.webp`} alt="" aria-hidden />
    </>
  );
}

export default function ShahiTajContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="st-content" ref={root}>
      {/* Royal Arch Hero */}
      <header className="st-hero">
        <div className="st-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Royal Mughal arch palace with swans, crystal chandeliers, and imperial crown"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="st-window-img"
            priority
          />
        </div>
        <div className="st-bismillah-hero" data-r aria-hidden>
          ﷽
        </div>
        <p className="st-eyebrow" data-r>
          Together with their families
        </p>
        <h1 className="st-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="st-dates" data-r>
          {dateRange(data)}
        </p>
        {data.hashtag && <p className="st-eyebrow st-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Royal Decree / Welcome Note */}
      <section className="st-note st-arched" data-r>
        <CrownCorners />
        {verse.arabic && <p className="st-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="st-translation">{verse.translation}</p>}
        <span className="st-rule" aria-hidden />
        <p className="st-dear">Honoured {guest ?? "Guest"},</p>
        <p className="st-lead">
          {data.welcomeMessage?.trim() ||
            "With the grace of Allah and joy in our hearts, we cordially request the honor of your presence to celebrate the union of our families and bless our new journey together."}
        </p>
      </section>

      {/* Royal Medallion Countdown */}
      {show.events && (
        <section className="st-medallion" data-r>
          <div className="st-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* The Imperial Celebrations */}
      {show.events && (
        <section className="st-corridor-section">
          <div className="st-heading" data-r>
            <p className="st-eyebrow">The Royal Itinerary</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="st-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article
                  key={event.id}
                  id={`event-${event.id}`}
                  className="st-door"
                  data-r
                  style={{ ["--d" as string]: `${i * 90}ms` }}
                >
                  <div className="st-door-top" aria-hidden>
                    <span className="st-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="st-door-body">
                    <p className="st-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="st-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="st-rule" aria-hidden />
                    <p className="st-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="st-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="st-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="st-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="st-swipe" aria-hidden>Swipe to explore the celebrations</p>}
        </section>
      )}

      {/* Imperial Families */}
      {show.family && (
        <section className="st-families">
          <div className="st-heading" data-r>
            <p className="st-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="st-windows">
            {show.groomFamily && (
              <div className="st-family-window st-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="st-family-window st-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Royal Gallery */}
      {show.gallery && (
        <section className="st-gallery" data-r>
          <div className="st-heading">
            <p className="st-eyebrow">Cherished Moments</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {/* RSVP Arched Card */}
      {show.rsvp && (
        <section id="rsvp" className="st-rsvp st-arched" data-r>
          <CrownCorners />
          <div className="st-heading">
            <p className="st-eyebrow">Kindly Grace Us</p>
            <h2>Will You Join Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      {/* Royal Footer */}
      <footer className="st-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="st-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="st-thanks">Thank You</p>
        <p className="st-lead">
          for being an essential part of our celebration. We eagerly look forward to welcoming you in royal presence.
        </p>
        <p className="st-signed">
          {data.groomName} &amp; {data.brideName}
        </p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
