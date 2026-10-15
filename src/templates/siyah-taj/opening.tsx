"use client";

import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";

/** A black roller shutter with the names printed on it. Tap → it lifts and the invitation is behind. */
export function SiyahOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening sy-opening" data-phase={phase} onClick={onTap}>
      <div className="sy-shutter">
        <div className="sy-print">
          <p className="sy-kicker">The wedding of</p>
          <p className="sy-names">
            <span>{data.groomName}</span>
            <i>&amp;</i>
            <span>{data.brideName}</span>
          </p>
          <span className="sy-rule" />
          <p className="sy-date">{formatLongDate(data.weddingDate)}</p>
        </div>

        {/* the pull-handle and the button */}
        <div className="sy-handle">
          <button
            type="button"
            className="sy-tap"
            onClick={(e) => {
              e.stopPropagation();
              onTap();
            }}
            disabled={phase !== "closed"}
          >
            Tap to Open
          </button>
          <span className="sy-bar" aria-hidden />
        </div>
      </div>
    </div>
  );
}
