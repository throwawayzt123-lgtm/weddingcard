"use client";

import { preload } from "react-dom";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { parseYmd } from "@/lib/dates";

function formatDottedDate(ymd: string): string {
  try {
    const { y, m, d } = parseYmd(ymd);
    const dd = String(d).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    return `${dd} · ${mm} · ${y}`;
  } catch {
    return ymd;
  }
}

/**
 * Sadaf-e-Noor Opening:
 * Gatefold blush silk doors with rose gold vintage lace and pearl buckle brooch.
 * Guaranteed zero overlap with dedicated vertical layout zones.
 */
export function SadafOpening({ data, phase, onTap }: OpeningProps) {
  preload("/templates/sadaf-e-noor/brooch.png", { as: "image", fetchPriority: "high" });
  preload("/templates/sadaf-e-noor/lace-top.png", { as: "image" });
  preload("/templates/sadaf-e-noor/lace-bottom.png", { as: "image" });

  const dottedDate = formatDottedDate(data.weddingDate);

  const renderCoverFace = (half: "left" | "right") => (
    <div className={`sd-cover-face sd-cover-face-${half}`} aria-hidden>
      {/* 1. Upper Zone: Names strictly in top 8% - 42% */}
      <div className="sd-cover-names-zone">
        <p className="sd-cover-name">{data.groomName}</p>
        <span className="sd-cover-amp">&amp;</span>
        <p className="sd-cover-name">{data.brideName}</p>
      </div>

      {/* 2. Middle-Lower Zone: Date strictly at ~65% */}
      <div className="sd-cover-date-zone">
        <p className="sd-cover-date">{dottedDate}</p>
      </div>

      {/* 3. Bottom Zone: Tap Prompt strictly at ~85% */}
      <div className="sd-cover-tap-zone">
        <span className="sd-pearl-dot" />
        <span className="sd-tap-text">TAP TO OPEN</span>
      </div>
    </div>
  );

  return (
    <div
      className="inv-opening sd-opening"
      data-phase={phase}
      data-opening={phase === "opening"}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to open wedding invitation"
    >
      <div className="sd-stage">
        {data.guest && (
          <div className="sd-guest-tag-wrapper">
            <span className="sd-guest-tag">
              Specially for <strong>{data.guest.displayName}</strong>
            </span>
          </div>
        )}

        {/* The Gatefold Card */}
        <div className="sd-gatefold-card">
          {/* Card Interior */}
          <div className="sd-card-interior">
            <div className="sd-interior-border" />
            <div className="sd-interior-lace-top" />
            <div className="sd-interior-content">
              <p className="sd-interior-kicker">TOGETHER WITH OUR FAMILIES</p>
              <p className="sd-interior-sub">THE WEDDING OF</p>
              <p className="sd-interior-names">
                {data.groomName} <i>&amp;</i> {data.brideName}
              </p>
              <div className="sd-pearl-divider">
                <span className="sd-line" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-pearl-cabochon sd-pearl-center" />
                <span className="sd-pearl-cabochon" />
                <span className="sd-line" />
              </div>
              <p className="sd-interior-text">
                Together with our families,
                <br />
                we invite you to celebrate
                <br />
                the beginning of our forever.
              </p>
            </div>
            <div className="sd-interior-lace-bottom" />
          </div>

          {/* Left Door Flap */}
          <div className="sd-door sd-door-left">
            <div className="sd-door-panel">
              <div className="sd-lace-edge sd-lace-left" />
              <div className="sd-door-inner sd-door-inner-left">
                {renderCoverFace("left")}
              </div>
              <div className="sd-door-shadow-left" />
            </div>
          </div>

          {/* Right Door Flap */}
          <div className="sd-door sd-door-right">
            <div className="sd-door-panel">
              <div className="sd-lace-edge sd-lace-right" />
              <div className="sd-door-inner sd-door-inner-right">
                {renderCoverFace("right")}
              </div>
              <div className="sd-door-shadow-right" />
            </div>
          </div>

          {/* Pearl & Crystal Rhinestone Brooch Clasp */}
          <div className="sd-brooch-clasp" aria-hidden>
            <div className="sd-brooch-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/templates/sadaf-e-noor/brooch.png"
              alt=""
              className="sd-brooch-img"
              width={105}
              height={70}
            />
          </div>
        </div>

        <p className="sd-opening-hint">Turn your sound on for the full experience</p>
      </div>
    </div>
  );
}
