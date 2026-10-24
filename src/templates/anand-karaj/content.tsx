"use client";

import { useRef } from "react";
import Image from "next/image";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_COPY, dateRange } from "@/components/invite-shared/chapters/copy";
import { Countdown } from "@/components/invite-shared/countdown";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { EventActions, FamilySide, MadeWithLove, sectionsOf, useReveal } from "@/components/invite-shared/story-parts";
import "./inside.css";

const ART = "/templates/anand-karaj";

export default function AnandKarajContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="akd-content" ref={root}>
      {/* Sanctum Hero */}
      <header className="akd-hero">
        <div className="akd-window" data-r>
          <Image
            src={`${ART}/card.webp`}
            alt="Royal Sikh Anand Karaj wedding at golden sanctum with couple holding pink silk palla"
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="akd-window-img"
            priority
          />
        </div>
        <p className="akd-eyebrow" data-r>Together with their families</p>
        <h1 className="akd-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="akd-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="akd-eyebrow akd-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Sacred Wedding Blessing Note */}
      <section className="akd-note akd-arched" data-r>
        <p className="akd-translation">
          {data.verseText?.trim() ||
            "“They are not said to be husband and wife, who merely sit together. Rather, they alone are called husband and wife, who have one light in two bodies.”"}
        </p>
        <span className="akd-rule" aria-hidden />
        <p className="akd-dear">Honoured {guest ?? "Guest"},</p>
        <p className="akd-lead">
          {data.welcomeMessage?.trim() ||
            "With deep humility, joy, and the boundless grace of the Almighty, we warmly invite you to bless the sacred union and celebration of our beloved children."}
        </p>
      </section>

      {/* Medallion Countdown */}
      {show.events && (
        <section className="akd-medallion" data-r>
          <div className="akd-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* Celebrations Corridor */}
      {show.events && (
        <section className="akd-corridor-section">
          <div className="akd-heading" data-r>
            <p className="akd-eyebrow">Auspicious Program</p>
            <h2>The Wedding Program</h2>
          </div>
          <div className="akd-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="akd-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="akd-door-top" aria-hidden>
                    <span className="akd-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="akd-door-body">
                    <p className="akd-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="akd-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="akd-rule" aria-hidden />
                    <p className="akd-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="akd-door-address">{event.address}</p>}
                    {event.dressCode && (
                      <p className="akd-door-note">
                        <em>Dress code</em> {event.dressCode}
                      </p>
                    )}
                    {event.notes && <p className="akd-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="akd-swipe" aria-hidden>Swipe to view the ceremonies</p>}
        </section>
      )}

      {/* Families */}
      {show.family && (
        <section className="akd-families">
          <div className="akd-heading" data-r>
            <p className="akd-eyebrow">With warm love &amp; respect</p>
            <h2>Our Families</h2>
          </div>
          <div className="akd-windows">
            {show.groomFamily && (
              <div className="akd-family-window akd-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="akd-family-window akd-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Gallery & RSVP */}
      {show.gallery && (
        <section className="akd-gallery" data-r>
          <div className="akd-heading">
            <p className="akd-eyebrow">Precious Moments</p>
            <h2>Our Journey</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="akd-rsvp akd-arched" data-r>
          <div className="akd-heading">
            <p className="akd-eyebrow">Warmest Reply</p>
            <h2>Will You Join Us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="akd-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="akd-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="akd-thanks">Thank You</p>
        <p className="akd-lead">Your presence and heartfelt blessings are our greatest gift.</p>
        <p className="akd-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
