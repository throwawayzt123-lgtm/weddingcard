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

export default function SadafContent({
  data,
  onRsvp,
  reduceMotion,
}: ContentProps) {
  const root = useRef<HTMLDivElement>(null);
  const [activeStoryTab, setActiveStoryTab] = useState<number>(0);

  const showRsvp = data.features.rsvp && !!data.guest && data.events.length > 0;
  const showGallery = data.features.gallery && data.photos.length > 0;
  const guestName = data.guest?.displayName;

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

  const attirePalette = [
    { name: "Blush Silk", hex: "#faece8", desc: "Gentle Romance" },
    { name: "Rose Gold", hex: "#c59285", desc: "Warm Shimmer" },
    { name: "Pearl Cream", hex: "#fbf6ec", desc: "Classic Pure" },
    { name: "Dusky Rose", hex: "#a5656a", desc: "Heritage Depth" },
    { name: "Soft Sage", hex: "#b8c9b5", desc: "Earthy Charm" },
  ];

  return (
    <div className="sd-content" ref={root}>
      {/* CARD 1: FORMAL WEDDING INVITATION */}
      <section className="sd-section sd-hero-section">
        <div className="sd-card sd-invitation-card">
          <div className="sd-lace-top" aria-hidden />

          <div className="sd-double-gold-frame">
            <div className="sd-frame-inner">
              <p className="sd-kicker">TOGETHER WITH OUR FAMILIES</p>
              <p className="sd-sub-kicker">THE WEDDING OF</p>

              <h1 className="sd-names">
                <span className="sd-name">{data.groomName}</span>
                <span className="sd-amp">&amp;</span>
                <span className="sd-name">{data.brideName}</span>
              </h1>

              <div className="sd-pearl-divider" aria-hidden>
                <span className="sd-line" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-pearl-cabochon sd-pearl-center" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-line" />
              </div>

              <p className="sd-verse-invitation">
                Together with our families,
                <br />
                we invite you to celebrate
                <br />
                the beginning of our forever.
              </p>

              <div className="sd-datetime-group">
                <p className="sd-date">{formatLongDate(data.weddingDate)}</p>
                <p className="sd-venue-line">{venueLine}</p>
              </div>

              <div className="sd-card-actions">
                {showRsvp ? (
                  <button
                    type="button"
                    className="sd-reply-link"
                    onClick={() => scrollToSection("rsvp")}
                  >
                    Kindly reply
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sd-reply-link"
                    onClick={() => scrollToSection("celebrations")}
                  >
                    View itinerary
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="sd-lace-bottom" aria-hidden />
        </div>
      </section>

      {/* CARD 2: THE EVENING ITINERARY */}
      <section className="sd-section sd-itinerary-section" id="itinerary">
        <div className="sd-deckled-wrapper">
          <div className="sd-card sd-deckled-card">
            <div className="sd-itinerary-header-row">
              <div className="sd-corner-roses" aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/templates/sadaf-e-noor/roses-corner.png"
                  alt=""
                  className="sd-corner-roses-img"
                />
              </div>

              <div className="sd-itinerary-title-box">
                <p className="sd-itinerary-kicker">A NIGHT TO REMEMBER</p>
                <h2 className="sd-itinerary-heading">The evening</h2>
              </div>
            </div>

            <div className="sd-itinerary-content">
              <div className="sd-timeline-flow">
                <div className="sd-timeline-item">
                  <p className="sd-timeline-time">
                    {data.events[0]?.startTime ? formatTime(data.events[0].startTime) : "7:00 PM"}
                  </p>
                  <h3 className="sd-timeline-label">Welcome</h3>
                  <p className="sd-timeline-desc">Arrive, settle in, and share a first hello.</p>
                </div>

                <div className="sd-timeline-pearl" aria-hidden>
                  <span className="sd-pearl-orb" />
                </div>

                <div className="sd-timeline-item">
                  <p className="sd-timeline-time">
                    {data.events.length > 1 && data.events[1]?.startTime
                      ? formatTime(data.events[1].startTime)
                      : "8:00 PM"}
                  </p>
                  <h3 className="sd-timeline-label">Our entrance</h3>
                  <p className="sd-timeline-desc">The beginning of a beautiful evening.</p>
                </div>

                <div className="sd-timeline-pearl" aria-hidden>
                  <span className="sd-pearl-orb" />
                </div>

                <div className="sd-timeline-item">
                  <p className="sd-timeline-time">
                    {data.events.length > 2 && data.events[2]?.startTime
                      ? formatTime(data.events[2].startTime)
                      : "9:00 PM"}
                  </p>
                  <h3 className="sd-timeline-label">Dinner</h3>
                  <p className="sd-timeline-desc">Good food and the people we love.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 3: OUR STORY */}
      <section className="sd-section sd-story-section">
        <div className="sd-card sd-panel-card sd-story-card">
          <div className="sd-panel-frame">
            <p className="sd-kicker">A JOURNEY OF TWO HEARTS</p>
            <h2 className="sd-section-title">Our Story</h2>
            <div className="sd-pearl-divider" aria-hidden>
              <span className="sd-line" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-pearl-cabochon sd-pearl-center" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-line" />
            </div>

            <p className="sd-story-lead">
              &ldquo;In all the world, there is no heart for me like yours.
              In all the world, there is no love for you like mine.&rdquo;
            </p>

            <div className="sd-milestones-nav" role="tablist">
              {milestones.map((m, idx) => (
                <button
                  key={m.year}
                  type="button"
                  role="tab"
                  aria-selected={activeStoryTab === idx}
                  className={`sd-milestone-pill ${activeStoryTab === idx ? "active" : ""}`}
                  onClick={() => setActiveStoryTab(idx)}
                >
                  <Sparkles className="size-3" />
                  {m.year}
                </button>
              ))}
            </div>

            <div className="sd-milestone-box">
              <span className="sd-milestone-pearl-top" aria-hidden />
              <h3 className="sd-milestone-title">{milestones[activeStoryTab].title}</h3>
              <p className="sd-milestone-body">{milestones[activeStoryTab].text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 4: COUNTDOWN */}
      {data.events.length > 0 && (
        <section className="sd-section sd-countdown-section">
          <div className="sd-card sd-panel-card">
            <div className="sd-panel-frame">
              <Countdown data={data} />
            </div>
          </div>
        </section>
      )}

      {/* CARD 5: THE CELEBRATIONS */}
      {data.events.length > 0 && (
        <section className="sd-section sd-events-section" id="celebrations">
          <div className="sd-section-header">
            <p className="sd-kicker">JOIN US FOR</p>
            <h2 className="sd-section-title">The Celebrations</h2>
            <div className="sd-pearl-divider" aria-hidden>
              <span className="sd-line" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-pearl-cabochon sd-pearl-center" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-line" />
            </div>
            <p className="sd-section-intro">
              Each gathering has been prepared with immense love and care. We eagerly await celebrating every moment with you.
            </p>
          </div>

          <div className="sd-events-stack">
            {data.events.map((e, index) => {
              const Icon = eventIcon(e.type);
              const formattedEventTime = formatTime(e.startTime);
              return (
                <article key={e.id} className="sd-card sd-event-card">
                  <div className="sd-event-top-filigree" aria-hidden>
                    <span className="sd-event-step-number">0{index + 1}</span>
                  </div>

                  <div className="sd-event-header">
                    <span className="sd-event-badge">
                      <Icon className="size-4" aria-hidden />
                      {e.type}
                    </span>
                    <h3 className="sd-event-name">{e.title}</h3>
                  </div>

                  <div className="sd-event-details">
                    <div className="sd-event-row">
                      <Calendar className="sd-row-icon" />
                      <span>{formatLongDate(e.date)}</span>
                    </div>

                    {formattedEventTime && (
                      <div className="sd-event-row">
                        <Clock className="sd-row-icon" />
                        <span>{formattedEventTime}</span>
                      </div>
                    )}

                    {e.venueName && (
                      <div className="sd-event-row">
                        <MapPin className="sd-row-icon" />
                        <span>
                          <strong>{e.venueName}</strong>
                          {e.address && <span className="sd-event-address"> · {e.address}</span>}
                        </span>
                      </div>
                    )}

                    {e.dressCode && (
                      <div className="sd-event-dress-badge">
                        <Shirt className="size-3.5" />
                        <span><strong>Dress code:</strong> {e.dressCode}</span>
                      </div>
                    )}

                    {e.notes && (
                      <div className="sd-event-note-box">
                        <Info className="size-3.5 shrink-0" />
                        <p>{e.notes}</p>
                      </div>
                    )}
                  </div>

                  {e.mapUrl && (
                    <div className="sd-event-action">
                      <a
                        href={e.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sd-map-btn"
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

      {/* CARD 6: WARDROBE PALETTE */}
      <section className="sd-section sd-attire-section">
        <div className="sd-card sd-panel-card sd-attire-card">
          <div className="sd-panel-frame">
            <p className="sd-kicker">WEDDING ATTIRE GUIDE</p>
            <h2 className="sd-section-title">The Bridal Palette</h2>
            <div className="sd-pearl-divider" aria-hidden>
              <span className="sd-line" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-pearl-cabochon sd-pearl-center" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-line" />
            </div>

            <p className="sd-attire-prompt">
              To celebrate in aesthetic harmony, our guests are warmly invited to draw inspiration from our celebratory palette of blush, rose gold, and soft champagne tones.
            </p>

            <div className="sd-palette-grid">
              {attirePalette.map((item) => (
                <div key={item.name} className="sd-swatch-box">
                  <div
                    className="sd-swatch-circle"
                    style={{ backgroundColor: item.hex }}
                  >
                    <span className="sd-swatch-pearl-pin" />
                  </div>
                  <span className="sd-swatch-name">{item.name}</span>
                  <span className="sd-swatch-desc">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="sd-blessing-note">
              <Heart className="size-4 text-[#c59285]" />
              <p>Your loving presence and prayers are the greatest gifts we could ever ask for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 7: FAMILY BLESSINGS */}
      <section className="sd-section sd-family-section">
        <div className="sd-card sd-panel-card">
          <div className="sd-panel-frame">
            <p className="sd-kicker">WITH THE BLESSINGS OF</p>
            <h2 className="sd-section-title">Our Families</h2>
            <div className="sd-pearl-divider" aria-hidden>
              <span className="sd-line" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-pearl-cabochon sd-pearl-center" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-line" />
            </div>
            <div className="mt-6">
              <Family groom={data.groomFamily} bride={data.brideFamily} />
            </div>
          </div>
        </div>
      </section>

      {/* CARD 8: GALLERY */}
      {showGallery && (
        <section className="sd-section sd-gallery-section">
          <div className="sd-section-header">
            <p className="sd-kicker">MOMENTS TO TREASURE</p>
            <h2 className="sd-section-title">Our Gallery</h2>
            <div className="sd-pearl-divider" aria-hidden>
              <span className="sd-line" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-pearl-cabochon sd-pearl-center" />
              <span className="sd-pearl-cabochon" />
              <span className="sd-line" />
            </div>
          </div>
          <div className="sd-gallery-wrap">
            <Gallery photos={data.photos} />
          </div>
        </section>
      )}

      {/* CARD 9: RSVP */}
      {showRsvp && (
        <section className="sd-section sd-rsvp-section" id="rsvp">
          <div className="sd-card sd-panel-card">
            <div className="sd-panel-frame">
              <p className="sd-kicker">PLEASE RESPOND BY DATE</p>
              <h2 className="sd-section-title">Kindly Reply</h2>
              <p className="sd-rsvp-guest-line">
                Honoured Guest: <strong>{guestName}</strong>
              </p>
              <p className="sd-rsvp-prompt">
                We would be delighted to celebrate with you. Please let us know your plans below.
              </p>
              <div className="sd-pearl-divider" aria-hidden>
                <span className="sd-line" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-pearl-cabochon sd-pearl-center" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-line" />
              </div>
              <div className="mt-6">
                <RsvpForm data={data} onRsvp={onRsvp} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CARD 10: FOOTER */}
      <InviteFooter data={data} />
    </div>
  );
}
