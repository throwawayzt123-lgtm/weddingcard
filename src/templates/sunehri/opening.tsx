"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";

/** A wrapped gift box with a ribbon bow. Tap → the bow unties, the lid lifts away and the base sinks. */
export function SunehriOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening su-opening" data-phase={phase} onClick={onTap}>
      <div className="su-lid">
        <p className="su-kicker">A gift of joy</p>
        <p className="su-kicker-2">With love, we invite you</p>
      </div>

      <div className="su-base">
        <p className="su-names">
          {data.groomName}
          <i>and</i>
          {data.brideName}
        </p>
        <span className="su-rule" />
        <p className="su-date">{formatLongDate(data.weddingDate)}</p>
        <button
          type="button"
          className="su-tap"
          onClick={(e) => {
            e.stopPropagation();
            onTap();
          }}
          disabled={phase !== "closed"}
        >
          Tap to Open
        </button>
      </div>

      {/* the bow sits on the seam */}
      <svg className="su-bow" viewBox="0 0 160 110" aria-hidden>
        <defs>
          <linearGradient id="su-rib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3dfa6" />
            <stop offset="0.5" stopColor="#c99a3e" />
            <stop offset="1" stopColor="#9c7424" />
          </linearGradient>
        </defs>
        <path d="M80 56C60 20 20 8 14 34C10 56 44 64 80 56Z" fill="url(#su-rib)" />
        <path d="M80 56C100 20 140 8 146 34C150 56 116 64 80 56Z" fill="url(#su-rib)" />
        <path d="M80 58C62 70 40 96 28 104L52 100L80 72Z" fill="url(#su-rib)" opacity="0.9" />
        <path d="M80 58C98 70 120 96 132 104L108 100L80 72Z" fill="url(#su-rib)" opacity="0.9" />
        <rect x="68" y="44" width="24" height="26" rx="8" fill="url(#su-rib)" />
        <path d="M70 52C74 48 86 48 90 52" stroke="#fff3c7" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
      </svg>
    </div>
  );
}
