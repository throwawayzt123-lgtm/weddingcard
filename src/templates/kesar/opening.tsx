"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

/** A little brass diya in the dark. Tap → the flame grows into golden light that fills the screen. */
export function KesarOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening ke-opening" data-phase={phase} onClick={onTap}>
      <div className="ke-stage">
        <p className="ke-kicker">With the light of our families</p>
        <p className="ke-names">
          {data.groomName}
          <i>and</i>
          {data.brideName}
        </p>
        <p className="ke-date">{formatLongDate(data.weddingDate)}</p>

        <div className="ke-lamp" aria-hidden>
          <span className="ke-halo" />
          <svg viewBox="0 0 200 170">
            <defs>
              <linearGradient id="ke-brass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f2cf7a" />
                <stop offset="0.55" stopColor="#c9922b" />
                <stop offset="1" stopColor="#7a5314" />
              </linearGradient>
              <radialGradient id="ke-fire" cx="50%" cy="70%" r="65%">
                <stop offset="0" stopColor="#fff6c8" />
                <stop offset="0.45" stopColor="#ffbf3c" />
                <stop offset="1" stopColor="#f0701c" />
              </radialGradient>
            </defs>
            <g className="ke-flame">
              <path d="M100 8C114 36 130 52 100 90C70 52 86 36 100 8Z" fill="url(#ke-fire)" />
              <path d="M100 40C106 54 112 62 100 80C88 62 94 54 100 40Z" fill="#fff9dc" opacity="0.9" />
            </g>
            <rect x="96" y="86" width="8" height="14" rx="3" fill="#3a1d10" />
            <path d="M22 104C32 150 70 160 100 160C130 160 168 150 178 104Z" fill="url(#ke-brass)" />
            <path d="M178 104C192 100 200 92 198 84C190 92 184 96 174 98Z" fill="url(#ke-brass)" />
            <ellipse cx="100" cy="104" rx="80" ry="12" fill="#d9a53a" />
            <ellipse cx="100" cy="104" rx="70" ry="8" fill="#4a2a0c" />
            <path d="M44 124C70 140 130 140 156 124" stroke="#f6dc94" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round" />
            <ellipse cx="100" cy="164" rx="34" ry="5" fill="#7a5314" />
          </svg>
          <span className="ke-flash" />
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="ke-tap"
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
