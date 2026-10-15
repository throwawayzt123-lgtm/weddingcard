"use client";

import { preload } from "react-dom";
import type { OpeningProps } from "@/components/invite-shared/experience";

// A Mughal-style pointed arch, as numbers between 0 and 1 (for clip-path) …
const CLIP_PATH = "M0,1 V0.45 C0,0.25 0.3,0.16 0.5,0 C0.7,0.16 1,0.25 1,0.45 V1 Z";
// … and the same arch in a 100 × 160 box for the gold frame lines.
const ARCH = "M0,160 V72 C0,40 30,25.6 50,0 C70,25.6 100,40 100,72 V160";

/** Scales the arch outward from the bottom centre to make concentric outlines. */
function scaledArch(s: number): string {
  const x = (v: number) => +(50 + (v - 50) * s).toFixed(2);
  const y = (v: number) => +(160 + (v - 160) * s).toFixed(2);
  return `M${x(0)},160 V${y(72)} C${x(0)},${y(40)} ${x(30)},${y(25.6)} ${x(50)},${y(0)} C${x(70)},${y(25.6)} ${x(100)},${y(40)} ${x(100)},${y(72)} V160`;
}

/** Closed palace door in a Mughal arch. Tap → the doors swing open and we walk through. */
export function ShahiOpening({ data, phase, onTap }: OpeningProps) {
  // Start fetching the door picture right away (it is the first thing the guest sees).
  preload("/templates/shahi-darwaza/door.webp", { as: "image", fetchPriority: "high" });

  return (
    <div className="inv-opening shahi-opening" data-phase={phase} onClick={onTap}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="shahi-arch-clip" clipPathUnits="objectBoundingBox">
            <path d={CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="shahi-stage">
        <div className="shahi-top">
          <p className="shahi-kicker">You are invited to the wedding of</p>
          <div className="shahi-plaque">
            <p className="shahi-names">
              {data.groomName}
              <i>&amp;</i>
              {data.brideName}
            </p>
          </div>
        </div>

        <div className="shahi-doorway-wrap">
          <div className="shahi-doorway">
            <div className="shahi-interior" />
            <div className="shahi-door shahi-door-left" />
            <div className="shahi-door shahi-door-right" />
          </div>
          <svg className="shahi-arch-frame" viewBox="0 0 100 160" preserveAspectRatio="none" aria-hidden>
            <path d={scaledArch(1.1)} stroke="#c9a24b" strokeWidth="2" opacity=".55" />
            <path d={scaledArch(1.055)} stroke="#b98a2c" strokeWidth="5" />
            <path d={ARCH} stroke="#f0d98f" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="shahi-bottom">
          <button
            type="button"
            className="inv-tap-btn shahi-tap"
            onClick={(e) => {
              e.stopPropagation();
              onTap();
            }}
            disabled={phase !== "closed"}
          >
            Tap to Open
          </button>
          <p className="shahi-hint">Turn your sound on for the full experience</p>
        </div>
      </div>
    </div>
  );
}
