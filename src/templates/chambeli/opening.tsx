"use client";

import type { CSSProperties } from "react";
import { formatLongDate } from "@/lib/dates";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";

// One jasmine petal, pointing up from the centre of the flower.
const PETAL = "M0 0C-36 -20 -40 -68 0 -102C40 -68 36 -20 0 0Z";
const OUTER = Array.from({ length: 10 }, (_, i) => i * 36);
const INNER = Array.from({ length: 8 }, (_, i) => i * 45 + 22);

// Loose petals that blow away when the flower opens. Whole numbers, so the server and the
// browser always draw exactly the same thing.
const LOOSE = Array.from({ length: 18 }, (_, i) => {
  const angle = ((i * 20 + (i % 2) * 9) * Math.PI) / 180;
  const distance = 150 + ((i * 53) % 110);
  return {
    dx: Math.round(Math.cos(angle) * distance),
    dy: Math.round(Math.sin(angle) * distance * 1.5),
    rot: (i * 47) % 360,
    delay: 80 + ((i * 29) % 260),
    size: 12 + ((i * 7) % 9),
  };
});

/** A white jasmine flower holds the names. Tap → it unfurls, then its petals scatter and the page appears. */
export function ChambeliOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening cb-opening" data-phase={phase} onClick={onTap}>
      <div className="cb-stage">
        <div className="cb-vine cb-vine-tl" aria-hidden />
        <div className="cb-vine cb-vine-br" aria-hidden />

        <p className="cb-kicker">With joy, we invite you</p>

        <div className="cb-bloom">
          <svg className="cb-flower" viewBox="-110 -110 220 220" aria-hidden>
            <defs>
              <radialGradient id="cb-petal-fill" cx="50%" cy="88%" r="95%">
                <stop offset="0" stopColor="#efe9d8" />
                <stop offset="0.55" stopColor="#ffffff" />
              </radialGradient>
            </defs>
            <g className="cb-layer cb-outer">
              {OUTER.map((a, i) => (
                <g key={a} transform={`rotate(${a})`}>
                  <path className="cb-petal" d={PETAL} style={{ "--i": i } as CSSProperties} />
                </g>
              ))}
            </g>
            <g className="cb-layer cb-inner">
              {INNER.map((a, i) => (
                <g key={a} transform={`rotate(${a})`}>
                  <path className="cb-petal cb-petal-in" d={PETAL} style={{ "--i": i + 4 } as CSSProperties} />
                </g>
              ))}
            </g>
            <circle className="cb-heart" r="56" />
          </svg>

          <div className="cb-plaque">
            <p className="cb-names">
              {data.groomName}
              <i>and</i>
              {data.brideName}
            </p>
            <span className="cb-rule" />
            <p className="cb-date">{formatLongDate(data.weddingDate)}</p>
          </div>

          <div className="cb-scatter" aria-hidden>
            {LOOSE.map((p, i) => (
              <span
                key={i}
                style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--r": `${p.rot}deg`, "--d": `${p.delay}ms`, "--s": `${p.size}px` } as CSSProperties}
              />
            ))}
          </div>
        </div>

        <GuestLine data={data} />

        <button
          type="button"
          className="cb-tap"
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
