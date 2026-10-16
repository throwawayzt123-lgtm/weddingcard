"use client";

import type { CSSProperties } from "react";
import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";

// Each cloud: where it sits (percent of its half), its size and how fast it drifts. Whole numbers only.
const CLOUDS = [
  { x: 4, y: 8, s: 150, d: 9 },
  { x: 30, y: 22, s: 110, d: 12 },
  { x: 8, y: 40, s: 170, d: 14 },
  { x: 38, y: 58, s: 130, d: 10 },
  { x: 2, y: 72, s: 160, d: 13 },
  { x: 34, y: 86, s: 120, d: 11 },
];

function Clouds({ side }: { side: "l" | "r" }) {
  return (
    <div className={`aa-clouds aa-clouds-${side}`} aria-hidden>
      {CLOUDS.map((c, i) => (
        <span key={i} className="aa-cloud" style={{ "--x": `${c.x}%`, "--y": `${c.y}%`, "--s": `${c.s}px`, "--d": `${c.d}s` } as CSSProperties} />
      ))}
    </div>
  );
}

/** A clear sky behind two banks of clouds. Tap → the clouds drift apart and the invitation appears. */
export function AasmaniOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening aa-opening" data-phase={phase} onClick={onTap}>
      <div className="aa-sky" aria-hidden />
      <div className="aa-sun" aria-hidden />
      <Clouds side="l" />
      <Clouds side="r" />

      <div className="aa-plaque">
        <p className="aa-kicker">With joy, we invite you</p>
        <p className="aa-names">
          {data.groomName}
          <i>and</i>
          {data.brideName}
        </p>
        <span className="aa-rule" />
        <p className="aa-date">{formatLongDate(data.weddingDate)}</p>
        <button
          type="button"
          className="aa-tap"
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
