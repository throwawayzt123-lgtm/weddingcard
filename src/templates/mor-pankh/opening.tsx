"use client";

import type { CSSProperties } from "react";
import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";

// Fine barbs on both sides of the quill. Whole numbers only, so the server and the browser draw the same thing.
const BARBS = Array.from({ length: 24 }, (_, i) => {
  const y = -22 - i * 7;
  const t = (22 + i * 7) / 205;
  const w = Math.round(6 + 30 * Math.sin(Math.PI * Math.pow(t, 0.85)) * (1 - t * 0.25));
  return { y, w, tip: y - 16 };
});

// Nine feathers: closed they stand almost upright, open they spread into a fan.
const FEATHERS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

function Feather() {
  return (
    <svg viewBox="-46 -222 92 230" aria-hidden>
      <path d="M0 4C-34 -44 -42 -150 0 -214C42 -150 34 -44 0 4Z" fill="url(#mp-leaf)" stroke="#d8b45c" strokeWidth="1" />
      <g stroke="#0a3d3a" strokeWidth="0.9" strokeLinecap="round" opacity="0.7">
        {BARBS.map((b) => (
          <path key={b.y} d={`M0 ${b.y}L${-b.w} ${b.tip}M0 ${b.y}L${b.w} ${b.tip}`} />
        ))}
      </g>
      <path d="M0 6V-200" stroke="#d8b45c" strokeWidth="1.5" />
      <ellipse cx="0" cy="-160" rx="21" ry="30" fill="#d8b45c" />
      <ellipse cx="0" cy="-160" rx="17.5" ry="26" fill="url(#mp-ring)" />
      <ellipse cx="0" cy="-160" rx="12" ry="18.5" fill="#123f6b" />
      <ellipse cx="0" cy="-160" rx="6.2" ry="10.5" fill="#061c2c" />
    </svg>
  );
}

// Gradients shared by every feather, defined once.
function FeatherDefs() {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="mp-leaf" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#0b5a52" />
            <stop offset="0.6" stopColor="#1b8a6d" />
            <stop offset="1" stopColor="#2aa3a0" />
          </linearGradient>
          <radialGradient id="mp-ring" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#35b9c4" />
            <stop offset="1" stopColor="#0f6f6a" />
          </radialGradient>
        </defs>
    </svg>
  );
}

/** A closed peacock-feather fan. Tap → it spreads open and floods the screen with teal. */
export function MorPankhOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening mp-opening" data-phase={phase} onClick={onTap}>
      <div className="mp-stage">
        <p className="mp-kicker">With the blessings of our families</p>
        <p className="mp-names">
          {data.groomName}
          <i>and</i>
          {data.brideName}
        </p>
        <p className="mp-date">{formatLongDate(data.weddingDate)}</p>

        <div className="mp-fan" aria-hidden>
          <FeatherDefs />
          {FEATHERS.map((n) => (
            <span key={n} className="mp-feather" style={{ "--n": n, "--z": 10 - Math.abs(n) } as CSSProperties}>
              <Feather />
            </span>
          ))}
        </div>

        <button
          type="button"
          className="mp-tap"
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
