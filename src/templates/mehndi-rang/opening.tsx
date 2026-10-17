"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

// Hanging marigold garlands: x position (%), number of flowers, swing timing.
const STRANDS = [
  { x: 5, n: 9, delay: 0, dur: 3.4 }, { x: 19, n: 14, delay: -1.2, dur: 3.9 },
  { x: 33, n: 7, delay: -2.1, dur: 3.2 }, { x: 50, n: 11, delay: -0.6, dur: 4.2 },
  { x: 67, n: 8, delay: -1.8, dur: 3.5 }, { x: 81, n: 15, delay: -0.3, dur: 3.8 },
  { x: 95, n: 10, delay: -2.5, dur: 3.3 },
];

export function Garlands() {
  return (
    <div className="mr-garlands" aria-hidden>
      {STRANDS.map((s, i) => (
        <div key={i} className="mr-strand" style={{ left: `${s.x}%`, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}>
          {Array.from({ length: s.n }, (_, k) => (
            <span key={k} className={`mr-flower ${(k + i) % 3 === 0 ? "mr-flower-y" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two embroidered curtains hide the stage. Tap → they part from the centre while marigold garlands sway. */
export function MehndiOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening mr-opening" data-phase={phase} onClick={onTap}>
      <div className="mr-backstage" />
      <div className="mr-lights" aria-hidden />

      <div className="mr-curtain mr-curtain-left" />
      <div className="mr-curtain mr-curtain-right" />
      <div className="mr-valance" aria-hidden />
      <Garlands />

      <div className="mr-center">
        <p className="mr-kicker">Dholki · Mehndi · Shaadi</p>
        <div className="mr-plaque">
          <p className="mr-eyebrow">The wedding of</p>
          <p className="mr-names">
            {data.groomName}
            <i>&amp;</i>
            {data.brideName}
          </p>
        </div>
        <GuestLine data={data} />
        <button
          type="button"
          className="inv-tap-btn mr-tap"
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
