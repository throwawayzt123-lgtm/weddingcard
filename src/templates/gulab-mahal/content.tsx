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

// Gulab Mahal, inside: a walk through a rose palace. The scene sits in a tall arched window, the countdown in a
// rose gold medallion, each celebration behind its own arched doorway along a corridor you swipe through,
// and the two families look out of two arched windows. Styles: gulab-mahal.css (gm-*).

const ART = "/templates/gulab-mahal";

function Corners() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gm-rose gm-rose-tl" src={`${ART}/rose-corner.webp`} alt="" aria-hidden />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="gm-rose gm-rose-br" src={`${ART}/rose-corner.webp`} alt="" aria-hidden />
    </>
  );
}

export default function GulabMahalContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="gm-content" ref={root}>
      {/* The arched window onto the palace */}
      <header className="gm-hero">
        <div className="gm-window" data-r>
          <Image src={`${ART}/scene.webp`} alt="A bride and groom under a flowered palace arch, looking out at a domed palace at sunset" fill sizes="(max-width: 640px) 86vw, 420px" className="gm-window-img" priority />
        </div>
        <p className="gm-eyebrow" data-r>Together with their families</p>
        <h1 className="gm-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <p className="gm-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="gm-eyebrow gm-hashtag" data-r>{data.hashtag}</p>}
      </header>

      {/* Blessings and a personal note, on an arched card */}
      <section className="gm-note gm-arched" data-r>
        <Corners />
        {verse.arabic && <p className="gm-arabic" lang="ar" dir="rtl">{verse.arabic}</p>}
        {verse.translation && <p className="gm-translation">{verse.translation}</p>}
        <span className="gm-rule" aria-hidden />
        <p className="gm-dear">Dear {guest ?? "Guest"},</p>
        <p className="gm-lead">
          {data.welcomeMessage?.trim() || "With hearts full of joy, we invite you to walk with us through the celebrations of our wedding, and to bless the beginning of our new life together."}
        </p>
      </section>

      {/* The countdown in a rose gold medallion */}
      {show.events && (
        <section className="gm-medallion" data-r>
          <div className="gm-medallion-ring">
            <Countdown data={data} />
          </div>
        </section>
      )}

      {/* The corridor of arched doorways, one per celebration */}
      {show.events && (
        <section className="gm-corridor-section">
          <div className="gm-heading" data-r>
            <p className="gm-eyebrow">Walk with us through</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="gm-corridor" tabIndex={0} aria-label="The celebrations">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="gm-door" data-r style={{ ["--d" as string]: `${i * 90}ms` }}>
                  <div className="gm-door-top" aria-hidden>
                    <span className="gm-door-medal">
                      <b>{badge.day}</b>
                      <small>{badge.month}</small>
                    </span>
                  </div>
                  <div className="gm-door-body">
                    <p className="gm-door-kicker">{copy.kicker}</p>
                    <h3>{event.title}</h3>
                    <p className="gm-door-when">
                      {formatLongDate(event.date)}
                      <br />
                      {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                    </p>
                    <span className="gm-rule" aria-hidden />
                    <p className="gm-door-venue">{event.venueName ?? "Venue to be announced"}</p>
                    {event.address && <p className="gm-door-address">{event.address}</p>}
                    {event.dressCode && <p className="gm-door-note"><em>Dress code</em> {event.dressCode}</p>}
                    {event.notes && <p className="gm-door-note">{event.notes}</p>}
                    <EventActions event={event} data={data} />
                  </div>
                </article>
              );
            })}
          </div>
          {data.events.length > 1 && <p className="gm-swipe" aria-hidden>Swipe to walk the corridor</p>}
        </section>
      )}

      {/* Two arched windows, one for each family */}
      {show.family && (
        <section className="gm-families">
          <div className="gm-heading" data-r>
            <p className="gm-eyebrow">With the blessings of</p>
            <h2>Our Families</h2>
          </div>
          <div className="gm-windows">
            {show.groomFamily && (
              <div className="gm-family-window gm-arched" data-r>
                <FamilySide title="The Groom's Family" side={data.groomFamily} />
              </div>
            )}
            {show.brideFamily && (
              <div className="gm-family-window gm-arched" data-r>
                <FamilySide title="The Bride's Family" side={data.brideFamily} />
              </div>
            )}
          </div>
        </section>
      )}

      {show.gallery && (
        <section className="gm-gallery" data-r>
          <div className="gm-heading">
            <p className="gm-eyebrow">A few moments</p>
            <h2>Our Gallery</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="gm-rsvp gm-arched" data-r>
          <Corners />
          <div className="gm-heading">
            <p className="gm-eyebrow">Kindly reply</p>
            <h2>Will you join us?</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="gm-footer" data-r>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gm-footer-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />
        <p className="gm-thanks">Thank you</p>
        <p className="gm-lead">for being part of our story. We cannot wait to celebrate with you.</p>
        <p className="gm-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
