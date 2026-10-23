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

const ART = "/templates/shahi-farman";

export default function ShahiFarmanContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="sfd-content" ref={root}>
      {/* Scroll Hero */}
      <header className="sfd-hero">
        <div className="sfd-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Antique royal parchment scroll with turned gold rods and imperial wax seal"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="sfd-window-img"
            priority
          />
        </div>
        <div className="sfd-bismillah-hero" data-r aria-hidden>
          ﷽
        </div>
        <p className="sfd-eyebrow" data-r>Imperial Royal Decree</p>
        <h1 className="sfd-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="sfd-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="sfd-eyebrow sfd-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Royal Farman Decree Note */}
      <section className="sfd-note sfd-arched" data-r>
        {verse.arabic && <p className="sfd-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="sfd-translation">{verse.translation}</p>}
        <span className="sfd-rule" aria-hidden />
        <p className="sfd-dear">Honoured {guest ?? "Guest"},</p>
        <p className="sfd-lead">
          {data.welcomeMessage?.trim() ||
            "By royal grace and divine decree, you are warmly summoned to witness and celebrate the sacred matrimonial alliance of our beloved children."}
        </p>
      </section>

      {/* Medallion Countdown */}
      {show.events && (
        <section className="sfd-medallion" data-r>
          <div className="sfd-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* Celebrations Corridor */}
      {show.events && (
        <section className="sfd-corridor-section">
          <div className="sfd-heading" data-r>
            <p className="sfd-eyebrow">The Royal Schedule</p>
            <h2>Order of Celebrations</h2>
          </div>
          <div className="sfd-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="sfd-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="sfd-door-top" aria-hidden>
                    <span className="sfd-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="sfd-door-body">
                    <p className="sfd-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="sfd-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="sfd-rule" aria-hidden />
                    <p className="sfd-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="sfd-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="sfd-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="sfd-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="sfd-swipe" aria-hidden>Swipe to view the ceremonies</p>}
        </section>
      )}

      {/* Families */}
      {show.family && (
        <section className="sfd-families">
          <div className="sfd-heading" data-r>
            <p className="sfd-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="sfd-windows">
            {show.groomFamily && (
              <div className="sfd-family-window sfd-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="sfd-family-window sfd-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery & RSVP */}
      {show.gallery && (
        <section className="sfd-gallery" data-r>
          <div className="sfd-heading">
            <p className="sfd-eyebrow">Moments in History</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="sfd-rsvp sfd-arched" data-r>
          <div className="sfd-heading">
            <p className="sfd-eyebrow">Royal Confirmation</p>
            <h2>Will You Grace Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="sfd-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="sfd-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="sfd-thanks">Thank You</p>
        <p className="sfd-lead">for your gracious blessings and presence on our auspicious day.</p>
        <p className="sfd-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
