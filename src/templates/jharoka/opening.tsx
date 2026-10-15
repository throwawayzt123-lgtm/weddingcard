"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";

// A pointed, scalloped arch, like a palace window (viewBox 240 x 340).
const ARCH = "M8 340V152Q8 120 34 104Q58 90 74 64Q92 34 120 8Q148 34 166 64Q182 90 206 104Q232 120 232 152V340Z";

/** A carved stone window with two lattice shutters. Tap → they slide apart and the evening sun floods in. */
export function JharokaOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening jh-opening" data-phase={phase} onClick={onTap}>
      <div className="jh-stage">
        <p className="jh-kicker">The wedding of</p>
        <p className="jh-names">
          {data.groomName}
          <i>and</i>
          {data.brideName}
        </p>

        <div className="jh-window">
          <svg viewBox="0 0 240 340" aria-hidden>
            <defs>
              <clipPath id="jh-arch">
                <path d={ARCH} />
              </clipPath>
              <linearGradient id="jh-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fbe3b0" />
                <stop offset="0.55" stopColor="#f2a15a" />
                <stop offset="1" stopColor="#b8452d" />
              </linearGradient>
              <pattern id="jh-lattice" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M12 0L24 12L12 24L0 12Z" fill="none" stroke="#d9b36a" strokeWidth="1" />
                <circle cx="12" cy="12" r="4.4" fill="none" stroke="#d9b36a" strokeWidth="0.9" />
              </pattern>
            </defs>

            <g clipPath="url(#jh-arch)">
              <rect width="240" height="340" fill="url(#jh-sky)" />
              <circle cx="120" cy="232" r="46" fill="#fff3cf" opacity="0.92" />
              <g className="jh-shutter jh-shutter-l">
                <rect width="121" height="340" fill="#5b3420" />
                <rect width="121" height="340" fill="url(#jh-lattice)" />
                <rect x="6" y="6" width="109" height="334" fill="none" stroke="#d9b36a" strokeWidth="1.2" opacity="0.7" />
              </g>
              <g className="jh-shutter jh-shutter-r">
                <rect x="119" width="121" height="340" fill="#5b3420" />
                <rect x="119" width="121" height="340" fill="url(#jh-lattice)" />
                <rect x="125" y="6" width="109" height="334" fill="none" stroke="#d9b36a" strokeWidth="1.2" opacity="0.7" />
              </g>
            </g>
            <path d={ARCH} fill="none" stroke="#e1bd78" strokeWidth="4" />
            <path d={ARCH} fill="none" stroke="#7a5426" strokeWidth="1" transform="translate(120 340) scale(0.94) translate(-120 -340)" />
          </svg>
        </div>

        <p className="jh-date">{formatLongDate(data.weddingDate)}</p>

        <button
          type="button"
          className="jh-tap"
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
