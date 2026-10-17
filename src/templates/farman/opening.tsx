"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

/** A rolled royal decree sealed in wax. Tap → the seal drops, the scroll unrolls, then the invitation appears. */
export function FarmanOpening({ data, phase, onTap }: OpeningProps) {
  const initials = `${data.groomName.trim().charAt(0)}${data.brideName.trim().charAt(0)}`.toUpperCase();
  return (
    <div className="inv-opening fm-opening" data-phase={phase} onClick={onTap}>
      <div className="fm-stage">
        <p className="fm-kicker">A royal invitation</p>

        <div className="fm-scroll">
          <span className="fm-roller fm-roller-top" aria-hidden />
          <div className="fm-sheet">
            <div className="fm-sheet-in">
              <p className="fm-small">The families request your presence at the wedding of</p>
              <p className="fm-names">
                {data.groomName}
                <i>and</i>
                {data.brideName}
              </p>
              <div className="fm-more">
                <span className="fm-rule" />
                <p className="fm-date">{formatLongDate(data.weddingDate)}</p>
              </div>
            </div>
          </div>
          <span className="fm-roller fm-roller-bottom" aria-hidden>
            <span className="fm-seal">
              <b>{initials}</b>
            </span>
          </span>
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="fm-tap"
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
