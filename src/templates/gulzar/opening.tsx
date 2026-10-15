"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { FallingPetals } from "./florals";

/** Sealed envelope with a gold wax seal. Tap → seal breaks, flap opens, the card slides up. */
export function GulzarOpening({ data, phase, onTap }: OpeningProps) {
  const initials = `${data.groomName.trim()[0] ?? ""}&${data.brideName.trim()[0] ?? ""}`.toUpperCase();

  return (
    <div className="inv-opening gz-opening" data-phase={phase} onClick={onTap}>
      <div className="gz-stage">
        <FallingPetals />
        <p className="gz-kicker">You are invited to the wedding of</p>

        <div className="gz-envelope">
          <div className="gz-env-back" />

          {/* The invitation card, hidden inside until the flap opens */}
          <div className="gz-card">
            <p className="gz-card-eyebrow">Together with their families</p>
            <p className="gz-card-names">
              {data.groomName}
              <i>&amp;</i>
              {data.brideName}
            </p>
            <span className="gz-card-rule" />
          </div>

          <div className="gz-env-front">
            <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
              <path d="M0 0 L50 31 L100 0 M0 60 L38 28 M100 60 L62 28" />
            </svg>
          </div>
          <div className="gz-flap" />

          <div className="gz-seal" aria-hidden>
            <span className="gz-seal-half gz-seal-l"><b>{initials}</b></span>
            <span className="gz-seal-half gz-seal-r"><b>{initials}</b></span>
          </div>
        </div>

        <button
          type="button"
          className="inv-tap-btn gz-tap"
          onClick={(e) => {
            e.stopPropagation();
            onTap();
          }}
          disabled={phase !== "closed"}
        >
          Tap to Open
        </button>
        <p className="gz-hint">Break the seal to reveal your invitation</p>
      </div>
    </div>
  );
}
