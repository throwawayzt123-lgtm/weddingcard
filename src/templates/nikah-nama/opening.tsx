"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

/** A hand-drawn corner flourish for the cover, repeated in all four corners with CSS rotation. */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`nk-corner ${className}`} viewBox="0 0 40 40" aria-hidden>
      <path d="M2 38V14C2 7 7 2 14 2h24" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 38V16c0-5 3-8 8-8h22" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="14" cy="14" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** A crimson cloth-bound book with gold foil. Tap → the cover swings open and we fall into the first page. */
export function NikahOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening nk-opening" data-phase={phase} onClick={onTap}>
      <div className="nk-stage">
        <p className="nk-kicker">A book of two families</p>

        <div className="nk-book">
          <div className="nk-block" aria-hidden />

          {/* The first page, waiting under the cover */}
          <div className="nk-page">
            <p className="nk-page-eyebrow">Together with their families</p>
            <p className="nk-page-names">
              {data.groomName}
              <i>and</i>
              {data.brideName}
            </p>
            <span className="nk-page-rule" />
            <p className="nk-page-date">{formatLongDate(data.weddingDate)}</p>
          </div>

          <div className="nk-cover">
            <div className="nk-cover-front">
              <Corner className="nk-c1" />
              <Corner className="nk-c2" />
              <Corner className="nk-c3" />
              <Corner className="nk-c4" />
              <p className="nk-label">Nikah Nama</p>
              <span className="nk-rule" />
              <p className="nk-names">
                {data.groomName}
                <i>&amp;</i>
                {data.brideName}
              </p>
              <span className="nk-rule" />
              <p className="nk-year">{data.weddingDate.slice(0, 4)}</p>
            </div>
            <div className="nk-cover-back" aria-hidden />
          </div>

          <span className="nk-ribbon" aria-hidden />
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="nk-tap"
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
