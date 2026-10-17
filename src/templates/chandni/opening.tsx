"use client";

import { formatDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

// 60 minute-marks around the outer ring, like a watch dial. Every fifth one is longer.
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = (i * 6 * Math.PI) / 180;
  const long = i % 5 === 0;
  const r1 = 140;
  const r2 = long ? 128 : 134;
  // rounded so the server and the browser print exactly the same numbers
  const n = (v: number) => Math.round(v * 100) / 100;
  return { x1: n(150 + Math.sin(a) * r1), y1: n(150 - Math.cos(a) * r1), x2: n(150 + Math.sin(a) * r2), y2: n(150 - Math.cos(a) * r2), long };
});

/** A silver moon-dial. Tap → the dark centre swells like an eclipse until it fills the screen. */
export function ChandniOpening({ data, phase, onTap }: OpeningProps) {
  const ring = `${data.groomName.toUpperCase()}  ·  ${data.brideName.toUpperCase()}  ·  `.repeat(3);
  const initials = `${data.groomName.trim()[0] ?? ""}${data.brideName.trim()[0] ?? ""}`.toUpperCase();

  return (
    <div className="inv-opening cd-opening" data-phase={phase} onClick={onTap}>
      <div className="cd-stage">
        <p className="cd-kicker">The wedding of</p>

        <div className="cd-dial">
          <svg className="cd-ring cd-ring-outer" viewBox="0 0 300 300" aria-hidden>
            <circle cx="150" cy="150" r="146" fill="none" stroke="currentColor" strokeWidth="0.6" />
            {TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="currentColor" strokeWidth={t.long ? 1.1 : 0.55} />
            ))}
          </svg>

          <svg className="cd-ring cd-ring-text" viewBox="0 0 300 300" aria-hidden>
            <defs>
              <path id="cd-circle" d="M150 150 m-109 0 a109 109 0 1 1 218 0 a109 109 0 1 1 -218 0" />
            </defs>
            <text fontSize="11" letterSpacing="5" fill="currentColor">
              <textPath href="#cd-circle" textLength="680" lengthAdjust="spacing">{ring}</textPath>
            </text>
            <circle cx="150" cy="150" r="121" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="150" cy="150" r="97" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* the dark centre: this is what grows to cover the screen */}
          <div className="cd-disc">
            <div className="cd-disc-inner">
              <span className="cd-monogram">{initials[0]}<i>&amp;</i>{initials[1]}</span>
              <span className="cd-date">{formatDate(data.weddingDate)}</span>
            </div>
          </div>
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="cd-tap"
          onClick={(e) => {
            e.stopPropagation();
            onTap();
          }}
          disabled={phase !== "closed"}
        >
          Tap to Open
        </button>
      </div>
    </div>
  );
}
