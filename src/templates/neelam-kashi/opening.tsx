"use client";

import type { CSSProperties } from "react";
import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

// A wall of glazed tiles, 5 across and 9 down. Each tile flips edge-on a moment after its
// neighbour, starting from the middle, so the wall peels open outward from the nameplate.
const COLS = 5;
const ROWS = 9;
const DELAYS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const distance = Math.hypot(col - (COLS - 1) / 2, (row - (ROWS - 1) / 2) * 0.62);
  return Math.round(250 + distance * 115); // whole milliseconds, so server and browser agree
});

/** Multani-style blue tiles with an arched nameplate. Tap → the tiles flip over from the centre outward. */
export function NeelamOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening nl-opening" data-phase={phase} onClick={onTap}>
      <div className="nl-tiles" aria-hidden>
        {DELAYS.map((delay, i) => (
          <span key={i} className="nl-tile" style={{ "--d": `${delay}ms` } as CSSProperties} />
        ))}
      </div>

      <div className="nl-center">
        <div className="nl-plate">
          <p className="nl-eyebrow">The wedding of</p>
          <p className="nl-names">
            {data.groomName}
            <i>&amp;</i>
            {data.brideName}
          </p>
          <span className="nl-rule" />
          <p className="nl-date">{formatLongDate(data.weddingDate)}</p>
        </div>
        <GuestLine data={data} />
        <button
          type="button"
          className="nl-tap"
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
