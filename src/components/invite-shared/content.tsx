"use client";

import { useRef } from "react";
import Image from "next/image";
import { formatLongDate } from "@/lib/dates";
import type { TemplateProps } from "@/templates/types";
import { Countdown } from "./countdown";
import { eventIcon, Events } from "./events";
import { Family } from "./family";
import { InviteFooter } from "./footer";
import { Gallery } from "./gallery";
import { Divider, ScrollHint, Star8 } from "./ornaments";
import { RsvpForm } from "./rsvp";
import { useInviteMotion } from "./use-invite-motion";

// The whole page BODY of an invitation (everything after the opening screen).
// It lives in its own file so it can be downloaded in the background while the
// guest looks at the opening screen: the first screen stays small and fast.
//
// The data-m="…" attributes mark what the scroll animations (use-invite-motion.ts) move.

const ARABIC = /[؀-ۿ]/;

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`inv-section ${className}`}>
      {children}
    </section>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-m="panel" className={`inv-panel ${className}`}>
      {children}
    </div>
  );
}

export default function InvitationContent({
  data, onRsvp, reduceMotion, introDelay, opened,
}: TemplateProps & { reduceMotion: boolean; introDelay: number; opened: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useInviteMotion(root, { introDelay, opened });

  const showRsvp = data.features.rsvp && !!data.guest && data.events.length > 0;
  const showGallery = data.features.gallery && data.photos.length > 0;
  const guestName = data.guest?.displayName;

  function scrollToEvent(id: string) {
    document.getElementById(`event-${id}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  return (
    <div className="inv-content" ref={root}>
      {/* 3. Hero */}
      <header id="top" className="inv-hero">
        <div className="inv-hero-inner">
          {data.verseText && (
            <p data-m="hero" className={`inv-verse ${ARABIC.test(data.verseText) ? "urdu" : ""}`} dir="auto">
              {data.verseText}
            </p>
          )}
          <p data-m="hero" className="inv-eyebrow">Together with their families</p>
          <h1 className="inv-names" aria-label={`${data.groomName} and ${data.brideName}`}>
            <span className="inv-script inv-name">{data.groomName}</span>
            <span className="inv-and" aria-hidden>and</span>
            <span className="inv-script inv-name">{data.brideName}</span>
          </h1>
          <div data-m="hero" className="flex flex-col items-center">
            <Divider />
            <p className="inv-hero-date">{formatLongDate(data.weddingDate)}</p>
            {data.hashtag && <p className="inv-eyebrow mt-3">{data.hashtag}</p>}
          </div>
        </div>
        <ScrollHint />
      </header>

      {/* 4. Blessings */}
      <Section id="blessings">
        <Panel>
          <p className="inv-eyebrow text-center">With the blessings of</p>
          <div className="mt-6">
            <Family groom={data.groomFamily} bride={data.brideFamily} />
          </div>
        </Panel>
      </Section>

      {/* 5. Personal greeting */}
      <Section id="greeting">
        <Panel>
          {data.couplePhotoUrl && (
            <div className="inv-couple-photo">
              <Image src={data.couplePhotoUrl} alt={`${data.groomName} and ${data.brideName}`} fill sizes="(max-width: 640px) 70vw, 300px" className="object-cover" />
            </div>
          )}
          <p className="inv-eyebrow flex items-center justify-center gap-3 text-center">
            {data.groomName.toUpperCase()} <Star8 size={12} /> {data.brideName.toUpperCase()}
          </p>
          <h2 className="inv-script mt-4 text-center text-5xl leading-tight sm:text-6xl">Dear {guestName ?? "Guest"},</h2>
          {data.welcomeMessage && <p className="inv-lead mt-5 text-center">{data.welcomeMessage}</p>}

          {data.events.length > 0 && (
            <div className="mt-7 text-center">
              <p className="inv-eyebrow mb-3">{guestName ? "You are invited to" : "The celebrations"}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {data.events.map((e) => {
                  const Icon = eventIcon(e.type);
                  return (
                    <button key={e.id} type="button" className="inv-chip" onClick={() => scrollToEvent(e.id)}>
                      <Icon className="size-3.5" aria-hidden />
                      {e.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Panel>
      </Section>

      {/* 6. Countdown */}
      {data.events.length > 0 && (
        <Section id="countdown">
          <Countdown data={data} />
        </Section>
      )}

      {/* 7. Events: the cards pile up as you scroll */}
      {data.events.length > 0 && (
        <Section id="events">
          <div data-m="rise" className="mb-8 text-center">
            <p className="inv-eyebrow">Join us for</p>
            <h2 className="inv-script mt-2 text-5xl sm:text-6xl">The Celebrations</h2>
          </div>
          <Events data={data} />
        </Section>
      )}

      {/* 8. Gallery: pinned, slides sideways while you scroll down */}
      {showGallery && (
        <Section id="gallery" className="inv-wide">
          <div className="mb-6 text-center">
            <p className="inv-eyebrow">A few moments</p>
            <h2 className="inv-script mt-2 text-5xl sm:text-6xl">Our Gallery</h2>
          </div>
          <Gallery photos={data.photos} />
        </Section>
      )}

      {/* 9. RSVP */}
      {showRsvp && (
        <Section id="rsvp">
          <Panel>
            <div className="mb-6 text-center">
              <p className="inv-eyebrow">Kindly reply</p>
              <h2 className="inv-script mt-2 text-5xl">RSVP</h2>
              <p className="mx-auto mt-3 max-w-xs text-base opacity-80">Let us know which celebrations you will join, so we can prepare a place for you.</p>
            </div>
            <RsvpForm data={data} onRsvp={onRsvp} />
          </Panel>
        </Section>
      )}

      {/* 10. Footer */}
      <InviteFooter data={data} />
    </div>
  );
}
