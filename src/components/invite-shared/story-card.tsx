"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { formatLongDate } from "@/lib/dates";
import type { InvitationViewData } from "@/templates/types";
import type { OpeningProps } from "./experience";
import { GuestLine } from "./guest-line";
import { useMusic } from "./music";
import "./story-card.css";

// The opening of the illustrated designs (Gulab Mahal, Laal Gulab, Mahtab, Chaman, Mehfil).
// Every picture of such a design is drawn on one 1080 × 1920 canvas and shown on a 9:16 stage, so the layers line up.
// First tap: the design's own animation (CSS, keyed on data-step) ends on the card with the invitation written on it.
// Second tap: the full invitation (the chapters) opens.

export type StoryStep = "sealed" | "opening" | "revealed";

const DEFAULT_VERSE = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

const line = (i: number) => ({ "--i": i }) as CSSProperties;

/** "Son of Mr. & Mrs. Khalid", unless the customer already wrote it that way. */
function parentage(prefix: string, parents: string | null): string | null {
  const text = parents?.trim();
  if (!text) return null;
  return /^(son|daughter)\b/i.test(text) ? text : `${prefix} ${text}`;
}

/** A guest invited to one celebration sees its name ("Walima"); otherwise the card speaks of the whole wedding. */
function cardTitle(data: InvitationViewData): string {
  return data.events.length === 1 ? data.events[0].title : "Wedding Celebrations";
}

/** One picture of the design, drawn on the shared canvas. `layer` stretches it over the whole stage. */
export function Art({ src, className, layer = true, priority = false }: { src: string; className: string; layer?: boolean; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- fixed artwork, sized by CSS
    <img className={`${layer ? "sc-layer " : ""}${className}`} src={src} alt="" aria-hidden draggable={false} fetchPriority={priority ? "high" : undefined} />
  );
}

/** The couple's names on the cover, under a small line. Placed by --sc-head-top in the design's CSS; fades on the first tap. */
export function CoverNames({ data, kicker }: { data: InvitationViewData; kicker: string }) {
  const gInit = data.groomName.trim().charAt(0).toUpperCase();
  const bInit = data.brideName.trim().charAt(0).toUpperCase();
  return (
    <div className="sc-cover-head">
      <div className="sc-crown-crest" aria-hidden>
        <svg viewBox="0 0 64 48" className="sc-crown-icon" fill="currentColor">
          {/* Imperial Crown & Laurel */}
          <path d="M32 4L37 14L47 8L44 24H20L17 8L27 14L32 4Z" />
          <circle cx="32" cy="3" r="2.5" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="48" cy="7" r="2" />
          <rect x="19" y="25" width="26" height="3" rx="1.5" />
          <circle cx="23" cy="26.5" r="1.2" fill="#fff" opacity="0.8" />
          <circle cx="32" cy="26.5" r="1.2" fill="#fff" opacity="0.8" />
          <circle cx="41" cy="26.5" r="1.2" fill="#fff" opacity="0.8" />
        </svg>
        <span className="sc-crest-monogram">{gInit} ✦ {bInit}</span>
      </div>
      <p className="sc-kicker">{kicker}</p>
      <p className="sc-cover-names">
        <span>{data.groomName}</span>
        <i>&amp;</i>
        <span>{data.brideName}</span>
      </p>
    </div>
  );
}

/** The invitation itself, written on the card once it is revealed. Positioned and coloured by each design's CSS. */
function StoryWords({ data, hidden }: { data: InvitationViewData; hidden: boolean }) {
  const groomParents = parentage("Son of", data.groomFamily.parentsLine);
  const brideParents = parentage("Daughter of", data.brideFamily.parentsLine);
  const date = data.events.length === 1 ? data.events[0].date : data.weddingDate;
  const gInit = data.groomName.trim().charAt(0).toUpperCase();
  const bInit = data.brideName.trim().charAt(0).toUpperCase();

  return (
    <div className="sc-words" aria-hidden={hidden}>
      {/* Royal Arch Crest */}
      <div className="sc-inner-crest" style={line(0)}>
        <span className="sc-flourish-left">❧</span>
        <span className="sc-crest-mini-badge">
          <svg viewBox="0 0 24 18" className="sc-mini-crown" fill="currentColor">
            <path d="M12 2L14.5 7L20 4L18.5 13H5.5L4 4L9.5 7L12 2Z" />
            <rect x="5" y="14" width="14" height="2" rx="1" />
          </svg>
          <span className="sc-mini-initials">{gInit}&amp;{bInit}</span>
        </span>
        <span className="sc-flourish-right">☙</span>
      </div>

      <p className="sc-bismillah" lang="ar" dir="rtl" style={line(1)}>
        {DEFAULT_VERSE}
      </p>

      <p className="sc-small" style={line(2)}>
        Together with their families
        <br />
        we request the honour of your presence at
      </p>

      <p className="sc-script" style={line(3)}>{cardTitle(data)}</p>

      <p className="sc-small" style={line(4)}>celebrating the union of</p>

      <h1 className="sc-names" aria-label={`${data.groomName} and ${data.brideName}`}>
        <span className="sc-name" style={line(5)}>{data.groomName}</span>
        {groomParents && <span className="sc-parents" style={line(6)}>{groomParents}</span>}
        <span className="sc-amp" style={line(7)} aria-hidden>&amp;</span>
        <span className="sc-name" style={line(8)}>{data.brideName}</span>
        {brideParents && <span className="sc-parents" style={line(9)}>{brideParents}</span>}
      </h1>

      <div className="sc-date-wrap" style={line(10)}>
        <span className="sc-date-flourish">✦</span>
        <p className="sc-date">{formatLongDate(date)}</p>
        <span className="sc-date-flourish">✦</span>
      </div>
    </div>
  );
}

type StoryOpeningProps = OpeningProps & {
  /** The design's class, e.g. "gm-opening"; its CSS animates the layers on [data-step]. */
  className: string;
  /** How long the first-tap animation runs before "Open Invitation" can be tapped (ms). */
  revealMs: number;
  /** Small line under the "Tap to Open" button. */
  hint: string;
  /** The art layers, and anything else on the cover (a monogram…). */
  children: ReactNode;
};

export function StoryOpening({ data, phase, onTap, className, revealMs, hint, children }: StoryOpeningProps) {
  const [step, setStep] = useState<StoryStep>("sealed");
  const { start } = useMusic();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const open = () => {
    if (step !== "sealed") return;
    start(); // inside the tap, or browsers block the music
    setStep("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setStep("revealed"), reduce ? 300 : revealMs);
  };
  const enter = () => {
    if (step === "revealed") onTap();
  };

  return (
    <div
      className={`inv-opening sc-opening ${className}`}
      data-phase={phase}
      data-step={step}
      onClick={step === "sealed" ? open : enter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (step === "sealed") open();
          else enter();
        }
      }}
    >
      <div className="sc-stage">
        {/* Subtle decorative gold frame and ambient sparkle particles */}
        <div className="sc-royal-frame" aria-hidden />
        <div className="sc-sparkles" aria-hidden>
          <span className="sc-sparkle s1">✦</span>
          <span className="sc-sparkle s2">✧</span>
          <span className="sc-sparkle s3">⋆</span>
          <span className="sc-sparkle s4">✦</span>
        </div>

        {children}

        {/* The interactive cover UI: personalized guest plaque + gleaming royal call-to-action */}
        <div className="sc-cover-ui">
          <GuestLine data={data} />
          <button
            type="button"
            className="inv-tap-btn sc-tap"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            disabled={step !== "sealed"}
            aria-label="Tap to open royal invitation"
          >
            <span className="sc-btn-shimmer" aria-hidden />
            <span className="sc-btn-star" aria-hidden>✦</span>
            <span>TAP TO OPEN</span>
            <span className="sc-btn-star" aria-hidden>✦</span>
          </button>
          <p className="sc-hint">
            <span className="sc-music-note" aria-hidden>♫</span> {hint}
          </p>
        </div>

        <StoryWords data={data} hidden={step === "sealed"} />

        <button
          type="button"
          className="inv-tap-btn sc-enter"
          onClick={(e) => {
            e.stopPropagation();
            enter();
          }}
          disabled={step !== "revealed" || phase !== "closed"}
          tabIndex={step === "revealed" ? 0 : -1}
          aria-label="Open full wedding invitation"
        >
          <span className="sc-btn-shimmer" aria-hidden />
          <span className="sc-btn-star" aria-hidden>✦</span>
          <span>VIEW FULL INVITATION</span>
          <span className="sc-btn-star" aria-hidden>✦</span>
        </button>
      </div>
    </div>
  );
}
