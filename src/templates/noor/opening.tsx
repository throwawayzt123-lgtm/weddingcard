"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

// Pointed arch, drawn as a single stroke that animates from nothing to complete.
const ARCH = "M18 276 V122 C18 62 68 32 100 6 C132 32 182 62 182 122 V276";
const ARCH_INNER = "M32 276 V124 C32 72 74 46 100 26 C126 46 168 72 168 124 V276";

/** Splits a name into letters that fade in one after another. */
function Letters({ text, start }: { text: string; start: number }) {
  return (
    <span aria-label={text}>
      {Array.from(text.toUpperCase()).map((ch, i) => (
        <span key={i} className="nr-letter" style={{ animationDelay: `${start + i * 0.1}s` }} aria-hidden>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/** Emerald screen: a thin gold line draws an arch, the names appear letter by letter, then "Tap to Open". */
export function NoorOpening({ data, phase, onTap }: OpeningProps) {
  const groomDelay = 1.7;
  const brideDelay = groomDelay + data.groomName.length * 0.1 + 0.5;

  return (
    <div className="inv-opening nr-opening" data-phase={phase} onClick={onTap}>
      <div className="nr-screen">
        <p className="nr-kicker">The wedding of</p>

        <div className="nr-arch-wrap">
          <svg className="nr-arch" viewBox="0 0 200 282" aria-hidden>
            <path d={ARCH} pathLength="1" className="nr-line nr-line-1" />
            <path d={ARCH_INNER} pathLength="1" className="nr-line nr-line-2" />
          </svg>
          <div className="nr-names">
            <p className="nr-name">
              <Letters text={data.groomName} start={groomDelay} />
            </p>
            <p className="nr-amp" aria-hidden>
              &amp;
            </p>
            <p className="nr-name">
              <Letters text={data.brideName} start={brideDelay} />
            </p>
          </div>
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="inv-tap-btn nr-tap"
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
