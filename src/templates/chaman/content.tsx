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

// Chaman, inside: botanical stationery. The garden sits in an oval cameo inside a eucalyptus wreath, the
// countdown is stitched onto a sage ribbon, each celebration is an arched botanical card with a sprig and a
// plant label, and the two families are rooted either side of a sprig. Styles: inside.css (cm-*).

const ART = "/templates/chaman";

function Sprig({ className = "" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={`cm-sprig ${className}`} src={`${ART}/sprig.webp`} alt="" aria-hidden />;
}

export default function ChamanContent({ data, onRsvp, opened }: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root, opened);
  const show = sectionsOf(data);
  const verse = verseOf(data);
  const guest = data.guest?.displayName;

  return (
    <div className="cm-content" ref={root}>
      {/* The cameo: the garden in an oval, ringed with eucalyptus */}
      <header className="cm-hero">
        <div className="cm-cameo" data-r>
          <div className="cm-cameo-photo">
            <Image src={`${ART}/scene.webp`} alt="A bride and groom walking under a floral arch towards a marble pavilion in a white rose garden" fill sizes="(max-width: 640px) 62vw, 300px" className="cm-cameo-img" priority />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cm-wreath" src={`${ART}/wreath.webp`} alt="" aria-hidden />
        </div>
        {verse.arabic && <p className="cm-arabic" lang="ar" dir="rtl" data-r>{verse.arabic}</p>}
        <p className="cm-eyebrow" data-r>Together with their families</p>
        <h1 className="cm-names" data-r aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <i aria-hidden>&amp;</i>
          <span>{data.brideName}</span>
        </h1>
        <Sprig className="cm-sprig-center" />
        <p className="cm-dates" data-r>{dateRange(data)}</p>
        {data.hashtag && <p className="cm-eyebrow" data-r>{data.hashtag}</p>}
      </header>

      <section className="cm-paper cm-note" data-r>
        <Sprig className="cm-sprig-corner" />
        <p className="cm-dear">Dear {guest ?? "Guest"},</p>
        <p className="cm-lead">
          {data.welcomeMessage?.trim() || "In a garden of white roses, two families come together. We would love you to walk with us as we begin our life together."}
        </p>
        {verse.translation && <p className="cm-translation">{verse.translation}</p>}
      </section>

      {show.events && (
        <section className="cm-ribbon" data-r>
          <Countdown data={data} />
        </section>
      )}

      {/* The botanical cards */}
      {show.events && (
        <section className="cm-garden">
          <div className="cm-heading" data-r>
            <p className="cm-eyebrow">In bloom</p>
            <h2>The Celebrations</h2>
          </div>
          <div className="cm-beds">
            {data.events.map((event, i) => {
              const badge = dateBadge(event.date);
              const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
              return (
                <article key={event.id} id={`event-${event.id}`} className="cm-bloom" data-r style={{ ["--d" as string]: `${(i % 2) * 120}ms` }}>
                  <Sprig className="cm-sprig-top" />
                  <p className="cm-numeral">
                    {badge.day}
                    <small>{badge.month}</small>
                  </p>
                  <h3>{event.title}</h3>
                  <p className="cm-label">
                    <span>No. {String(i + 1).padStart(2, "0")}</span>
                    {copy.kicker}
                  </p>
                  <p className="cm-when">
                    {formatLongDate(event.date)}
                    <br />
                    {formatTimeRange(event.startTime, event.endTime) ?? "Time to be announced"}
                  </p>
                  <p className="cm-venue">{event.venueName ?? "Venue to be announced"}</p>
                  {event.address && <p className="cm-muted">{event.address}</p>}
                  {event.dressCode && <p className="cm-muted"><em>Dress code</em> {event.dressCode}</p>}
                  {event.notes && <p className="cm-muted">{event.notes}</p>}
                  <EventActions event={event} data={data} />
                </article>
              );
            })}
          </div>
        </section>
      )}

      {show.family && (
        <section className="cm-paper cm-roots" data-r>
          <div className="cm-heading">
            <p className="cm-eyebrow">Rooted in love</p>
            <h2>Our Families</h2>
          </div>
          <div className="cm-root-pair">
            {show.groomFamily && <FamilySide title="The Groom's Family" side={data.groomFamily} />}
            {show.groomFamily && show.brideFamily && <Sprig className="cm-sprig-divider" />}
            {show.brideFamily && <FamilySide title="The Bride's Family" side={data.brideFamily} />}
          </div>
        </section>
      )}

      {show.gallery && (
        <section className="cm-gallery" data-r>
          <div className="cm-heading">
            <p className="cm-eyebrow">Pressed memories</p>
            <h2>Gallery</h2>
          </div>
          <Gallery photos={data.photos} />
        </section>
      )}

      {show.rsvp && (
        <section id="rsvp" className="cm-paper cm-rsvp" data-r>
          <div className="cm-heading">
            <p className="cm-eyebrow">Kindly reply</p>
            <h2>Join us in the garden</h2>
          </div>
          <RsvpForm data={data} onRsvp={onRsvp} />
        </section>
      )}

      <footer className="cm-footer" data-r>
        <Sprig className="cm-sprig-center" />
        <p className="cm-thanks">Thank you</p>
        <p className="cm-lead">for being part of our story. We cannot wait to celebrate with you.</p>
        <p className="cm-signed">{data.groomName} &amp; {data.brideName}</p>
        <MadeWithLove data={data} />
      </footer>
    </div>
  );
}
