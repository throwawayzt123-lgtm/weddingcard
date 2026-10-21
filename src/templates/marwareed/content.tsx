"use client";

import { useRef, useState } from "react";
import { formatLongDate, formatTime } from "@/lib/dates";
import type { ContentProps } from "@/components/invite-shared/experience";
import { Countdown } from "@/components/invite-shared/countdown";
import { eventIcon } from "@/components/invite-shared/events";
import { Family } from "@/components/invite-shared/family";
import { InviteFooter } from "@/components/invite-shared/footer";
import { Gallery } from "@/components/invite-shared/gallery";
import { RsvpForm } from "@/components/invite-shared/rsvp";
import { MapPin, Clock, Calendar, Sparkles, Heart, Shirt, Info } from "lucide-react";

export default function MarwareedContent({
  data,
  onRsvp,
  reduceMotion,
}: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<number>(0);

  const showRsvp = data.features.rsvp && !!data.guest && data.events.length > 0;
  const showGallery = data.features.gallery && data.photos.length > 0;
  const guestName = data.guest?.displayName;

  // Primary event for Card 1 (Invitation Card)
  const primaryEvent = data.events[0];
  const primaryTime = primaryEvent ? formatTime(primaryEvent.startTime) : "5:00 PM";
  const primaryVenue = primaryEvent?.venueName ?? "THE GARDEN PAVILION";
  const venueLine = `${primaryTime} · ${primaryVenue.toUpperCase()}`;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  // Story milestones
  const milestones = [
    {
      year: "The Beginning",
      title: "When Two Paths Crossed",
      text: "A serendipitous conversation, an effortless smile, and the unspoken knowing that some people enter our lives exactly when they are meant to.",
    },
    {
      year: "The Journey",
      title: "Growing Together",
      text: "Through endless late-night talks, shared dreams, laughter in quiet cafes, and discovering each other's worlds with warmth and patience.",
    },
    {
      year: "The Proposal",
      title: "A Promise Under the Stars",
      text: "With trembling hands and full hearts, the question was asked. A single word answered it all: Forever.",
    },
    {
      year: "The Celebration",
      title: "Becoming One Family",
      text: "Surrounded by our loved ones, our parents' heartfelt prayers, and the people who hold our story, we begin our new chapter.",
    },
  ];

  // Palette swatches for attire card
  const attirePalette = [
    { name: "Pure Ivory", hex: "#faf7f2", desc: "Classic Elegance" },
    { name: "Champagne Gold", hex: "#e7d2a9", desc: "Royal Shimmer" },
    { name: "Rose Quartz", hex: "#eed7d8", desc: "Romantic Blush" },
    { name: "Soft Sage", hex: "#c4d1c0", desc: "Serene & Gentle" },
    { name: "Dusty Mauve", hex: "#a88e93", desc: "Subtle Warmth" },
  ];

  return (
    <div className="mw-content" ref={root}>
      {/* ==============================================================
          CARD 1: THE FORMAL WEDDING INVITATION (Matches Image 2)
          ============================================================== */}
      <section className="mw-section mw-hero-section">
        <div className="mw-card mw-invitation-card">
          {/* Top Scalloped French Lace spanning full width */}
          <div className="mw-lace-top" aria-hidden />

          {/* Double Gold Line Frame */}
          <div className="mw-double-gold-frame">
            <div className="mw-frame-inner">
              <p className="mw-kicker">TOGETHER WITH OUR FAMILIES</p>
              <p className="mw-sub-kicker">THE WEDDING OF</p>

              <h1 className="mw-names">
                <span className="mw-name">{data.groomName}</span>
                <span className="mw-amp">&amp;</span>
                <span className="mw-name">{data.brideName}</span>
              </h1>

              {/* Pearl Divider Ornament */}
              <div className="mw-pearl-divider" aria-hidden>
                <span className="mw-line" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-pearl-cabochon mw-pearl-center" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-line" />
              </div>

              {/* Invitation Text */}
              <p className="mw-verse-invitation">
                Together with our families,
                <br />
                we invite you to celebrate
                <br />
                the beginning of our forever.
              </p>

              {/* Date & Time / Venue */}
              <div className="mw-datetime-group">
                <p className="mw-date">{formatLongDate(data.weddingDate)}</p>
                <p className="mw-venue-line">{venueLine}</p>
              </div>

              {/* Action Buttons */}
              <div className="mw-card-actions">
                {showRsvp ? (
                  <button
                    type="button"
                    className="mw-reply-link"
                    onClick={() => scrollToSection("rsvp")}
                  >
                    Kindly reply
                  </button>
                ) : (
                  <button
                    type="button"
                    className="mw-reply-link"
                    onClick={() => scrollToSection("celebrations")}
                  >
                    View itinerary
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Scalloped French Lace spanning full width */}
          <div className="mw-lace-bottom" aria-hidden />
        </div>
      </section>

      {/* ==============================================================
          CARD 2: THE EVENING ITINERARY (Matches Image 3)
          ============================================================== */}
      <section className="mw-section mw-itinerary-section" id="itinerary">
        <div className="mw-deckled-wrapper">
          <div className="mw-card mw-deckled-card">
            {/* Top Row: Left Bouquet + Right Title (Exact Image 3 Layout) */}
            <div className="mw-itinerary-header-row">
              <div className="mw-corner-roses" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/templates/marwareed/roses-corner.png"
                  alt=""
                  className="mw-corner-roses-img"
                />
              </div>

              <div className="mw-itinerary-title-box">
                <p className="mw-itinerary-kicker">A NIGHT TO REMEMBER</p>
                <h2 className="mw-itinerary-heading">The evening</h2>
              </div>
            </div>

            {/* Centered Timeline Flow */}
            <div className="mw-itinerary-content">
              <div className="mw-timeline-flow">
                {/* 1. Welcome */}
                <div className="mw-timeline-item">
                  <p className="mw-timeline-time">
                    {data.events[0]?.startTime ? formatTime(data.events[0].startTime) : "7:00 PM"}
                  </p>
                  <h3 className="mw-timeline-label">Welcome</h3>
                  <p className="mw-timeline-desc">Arrive, settle in, and share a first hello.</p>
                </div>

                <div className="mw-timeline-pearl" aria-hidden>
                  <span className="mw-pearl-orb" />
                </div>

                {/* 2. Entrance */}
                <div className="mw-timeline-item">
                  <p className="mw-timeline-time">
                    {data.events.length > 1 && data.events[1]?.startTime
                      ? formatTime(data.events[1].startTime)
                      : "8:00 PM"}
                  </p>
                  <h3 className="mw-timeline-label">Our entrance</h3>
                  <p className="mw-timeline-desc">The beginning of a beautiful evening.</p>
                </div>

                <div className="mw-timeline-pearl" aria-hidden>
                  <span className="mw-pearl-orb" />
                </div>

                {/* 3. Dinner */}
                <div className="mw-timeline-item">
                  <p className="mw-timeline-time">
                    {data.events.length > 2 && data.events[2]?.startTime
                      ? formatTime(data.events[2].startTime)
                      : "9:00 PM"}
                  </p>
                  <h3 className="mw-timeline-label">Dinner</h3>
                  <p className="mw-timeline-desc">Good food and the people we love.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          CARD 3: OUR LOVE STORY & CHERISHED MILESTONES (NEW FANCY CARD)
          ============================================================== */}
      <section className="mw-section mw-story-section">
        <div className="mw-card mw-panel-card mw-story-card">
          <div className="mw-panel-frame">
            <p className="mw-kicker">A JOURNEY OF TWO HEARTS</p>
            <h2 className="mw-section-title">Our Story</h2>
            <div className="mw-pearl-divider" aria-hidden>
              <span className="mw-line" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-pearl-cabochon mw-pearl-center" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-line" />
            </div>

            <p className="mw-story-lead">
              &ldquo;In all the world, there is no heart for me like yours.
              In all the world, there is no love for you like mine.&rdquo;
            </p>

            {/* Interactive Milestone Tabs */}
            <div className="mw-milestones-nav" role="tablist">
              {milestones.map((m, idx) => (
                <button
                  key={m.year}
                  type="button"
                  role="tab"
                  aria-selected={activeStoryTab === idx}
                  className={`mw-milestone-pill ${activeStoryTab === idx ? "active" : ""}`}
                  onClick={() => setActiveStoryTab(idx)}
                >
                  <Sparkles className="size-3" />
                  {m.year}
                </button>
              ))}
            </div>

            {/* Active Milestone Card */}
            <div className="mw-milestone-box">
              <span className="mw-milestone-pearl-top" aria-hidden />
              <h3 className="mw-milestone-title">{milestones[activeStoryTab].title}</h3>
              <p className="mw-milestone-body">{milestones[activeStoryTab].text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          CARD 4: COUNTDOWN TO FOREVER
          ============================================================== */}
      {data.events.length > 0 && (
        <section className="mw-section mw-countdown-section">
          <div className="mw-card mw-panel-card">
            <div className="mw-panel-frame">
              <Countdown data={data} />
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          CARD 5: THE CELEBRATIONS / EVENTS SUITE (LOADED & DETAILED)
          ============================================================== */}
      {data.events.length > 0 && (
        <section className="mw-section mw-events-section" id="celebrations">
          <div className="mw-section-header">
            <p className="mw-kicker">JOIN US FOR</p>
            <h2 className="mw-section-title">The Celebrations</h2>
            <div className="mw-pearl-divider" aria-hidden>
              <span className="mw-line" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-pearl-cabochon mw-pearl-center" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-line" />
            </div>
            <p className="mw-section-intro">
              Each gathering has been prepared with immense love and care. We eagerly await celebrating every moment with you.
            </p>
          </div>

          <div className="mw-events-stack">
            {data.events.map((e, index) => {
              const Icon = eventIcon(e.type);
              const formattedEventTime = formatTime(e.startTime);
              return (
                <article key={e.id} className="mw-card mw-event-card">
                  <div className="mw-event-top-filigree" aria-hidden>
                    <span className="mw-event-step-number">0{index + 1}</span>
                  </div>

                  <div className="mw-event-header">
                    <span className="mw-event-badge">
                      <Icon className="size-4" aria-hidden />
                      {e.type}
                    </span>
                    <h3 className="mw-event-name">{e.title}</h3>
                  </div>

                  <div className="mw-event-details">
                    <div className="mw-event-row">
                      <Calendar className="mw-row-icon" />
                      <span>{formatLongDate(e.date)}</span>
                    </div>

                    {formattedEventTime && (
                      <div className="mw-event-row">
                        <Clock className="mw-row-icon" />
                        <span>{formattedEventTime}</span>
                      </div>
                    )}

                    {e.venueName && (
                      <div className="mw-event-row">
                        <MapPin className="mw-row-icon" />
                        <span>
                          <strong>{e.venueName}</strong>
                          {e.address && <span className="mw-event-address"> · {e.address}</span>}
                        </span>
                      </div>
                    )}

                    {e.dressCode && (
                      <div className="mw-event-dress-badge">
                        <Shirt className="size-3.5" />
                        <span><strong>Dress code:</strong> {e.dressCode}</span>
                      </div>
                    )}

                    {e.notes && (
                      <div className="mw-event-note-box">
                        <Info className="size-3.5 shrink-0" />
                        <p>{e.notes}</p>
                      </div>
                    )}
                  </div>

                  {e.mapUrl && (
                    <div className="mw-event-action">
                      <a
                        href={e.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mw-map-btn"
                      >
                        <MapPin className="size-3.5" />
                        Get Directions
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ==============================================================
          CARD 6: WEDDING WARDROBE & PALETTE GUIDE (NEW FANCY CARD)
          ============================================================== */}
      <section className="mw-section mw-attire-section">
        <div className="mw-card mw-panel-card mw-attire-card">
          <div className="mw-panel-frame">
            <p className="mw-kicker">WEDDING ATTIRE GUIDE</p>
            <h2 className="mw-section-title">The Bridal Palette</h2>
            <div className="mw-pearl-divider" aria-hidden>
              <span className="mw-line" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-pearl-cabochon mw-pearl-center" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-line" />
            </div>

            <p className="mw-attire-prompt">
              To celebrate in aesthetic harmony, our guests are warmly invited to draw inspiration from our celebratory palette of ivory, champagne, and soft heritage tones.
            </p>

            <div className="mw-palette-grid">
              {attirePalette.map((item) => (
                <div key={item.name} className="mw-swatch-box">
                  <div
                    className="mw-swatch-circle"
                    style={{ backgroundColor: item.hex }}
                  >
                    <span className="mw-swatch-pearl-pin" />
                  </div>
                  <span className="mw-swatch-name">{item.name}</span>
                  <span className="mw-swatch-desc">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="mw-blessing-note">
              <Heart className="size-4 text-[#cda358]" />
              <p>Your loving presence and prayers are the greatest gifts we could ever ask for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          CARD 7: WITH THE BLESSINGS OF (FAMILY)
          ============================================================== */}
      <section className="mw-section mw-family-section">
        <div className="mw-card mw-panel-card">
          <div className="mw-panel-frame">
            <p className="mw-kicker">WITH THE BLESSINGS OF</p>
            <h2 className="mw-section-title">Our Families</h2>
            <div className="mw-pearl-divider" aria-hidden>
              <span className="mw-line" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-pearl-cabochon mw-pearl-center" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-line" />
            </div>
            <div className="mt-6">
              <Family groom={data.groomFamily} bride={data.brideFamily} />
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          CARD 8: GALLERY (IF PHOTOS PROVIDED)
          ============================================================== */}
      {showGallery && (
        <section className="mw-section mw-gallery-section">
          <div className="mw-section-header">
            <p className="mw-kicker">MOMENTS TO TREASURE</p>
            <h2 className="mw-section-title">Our Gallery</h2>
            <div className="mw-pearl-divider" aria-hidden>
              <span className="mw-line" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-pearl-cabochon mw-pearl-center" />
              <span className="mw-pearl-cabochon" />
              <span className="mw-line" />
            </div>
          </div>
          <div className="mw-gallery-wrap">
            <Gallery photos={data.photos} />
          </div>
        </section>
      )}

      {/* ==============================================================
          CARD 9: RSVP FORM
          ============================================================== */}
      {showRsvp && (
        <section className="mw-section mw-rsvp-section" id="rsvp">
          <div className="mw-card mw-panel-card">
            <div className="mw-panel-frame">
              <p className="mw-kicker">PLEASE RESPOND BY DATE</p>
              <h2 className="mw-section-title">Kindly Reply</h2>
              <p className="mw-rsvp-guest-line">
                Honoured Guest: <strong>{guestName}</strong>
              </p>
              <p className="mw-rsvp-prompt">
                We would be delighted to celebrate with you. Please let us know your plans below.
              </p>
              <div className="mw-pearl-divider" aria-hidden>
                <span className="mw-line" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-pearl-cabochon mw-pearl-center" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-line" />
              </div>
              <div className="mt-6">
                <RsvpForm data={data} onRsvp={onRsvp} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          CARD 10: FOOTER
          ============================================================== */}
      <InviteFooter data={data} />
    </div>
  );
}
