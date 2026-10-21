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
 * Marwareed Opening:
 * Gatefold ivory silk doors with vintage scalloped French lace and pearl buckle brooch.
 * Guaranteed zero overlap: names are strictly pinned in the upper half, brooch in the center,
 * date in the lower middle, and tap prompt at the bottom.
 */
export function MarwareedOpening({ data, phase, onTap }: OpeningProps) {
  preload("/templates/marwareed/brooch.png", { as: "image", fetchPriority: "high" });
  preload("/templates/marwareed/lace-top.png", { as: "image" });
  preload("/templates/marwareed/lace-bottom.png", { as: "image" });

  const dottedDate = formatDottedDate(data.weddingDate);

  const renderCoverFace = (half: "left" | "right") => (
    <div className={`mw-cover-face mw-cover-face-${half}`} aria-hidden>
      {/* 1. Upper Zone: Names strictly in top 10% - 42% */}
      <div className="mw-cover-names-zone">
        <p className="mw-cover-name">{data.groomName}</p>
        <span className="mw-cover-amp">&amp;</span>
        <p className="mw-cover-name">{data.brideName}</p>
      </div>

      {/* 2. Middle-Lower Zone: Date strictly at ~66% */}
      <div className="mw-cover-date-zone">
        <p className="mw-cover-date">{dottedDate}</p>
      </div>

      {/* 3. Bottom Zone: Tap Prompt strictly at ~86% */}
      <div className="mw-cover-tap-zone">
        <span className="mw-pearl-dot" />
        <span className="mw-tap-text">TAP TO OPEN</span>
      </div>
    </div>
  );

  return (
    <div
      className="inv-opening mw-opening"
      data-phase={phase}
      data-opening={phase === "opening"}
      onClick={onTap}
      role="button"
      tabIndex={0}
      aria-label="Tap to open wedding invitation"
    >
      <div className="mw-stage">
        {/* Guest tag safely separated from top watermark badge */}
        {data.guest && (
          <div className="mw-guest-tag-wrapper">
            <span className="mw-guest-tag">
              Specially for <strong>{data.guest.displayName}</strong>
            </span>
          </div>
        )}

        {/* The Gatefold Card */}
        <div className="mw-gatefold-card">
          {/* Card Interior revealed as doors swing open */}
          <div className="mw-card-interior">
            <div className="mw-interior-border" />
            <div className="mw-interior-lace-top" />
            <div className="mw-interior-content">
              <p className="mw-interior-kicker">TOGETHER WITH OUR FAMILIES</p>
              <p className="mw-interior-sub">THE WEDDING OF</p>
              <p className="mw-interior-names">
                {data.groomName} <i>&amp;</i> {data.brideName}
              </p>
              <div className="mw-pearl-divider">
                <span className="mw-line" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-pearl-cabochon mw-pearl-center" />
                <span className="mw-pearl-cabochon" />
                <span className="mw-line" />
              </div>
              <p className="mw-interior-text">
                Together with our families,
                <br />
                we invite you to celebrate
                <br />
                the beginning of our forever.
              </p>
            </div>
            <div className="mw-interior-lace-bottom" />
          </div>

          {/* Left Door Flap */}
          <div className="mw-door mw-door-left">
            <div className="mw-door-panel">
              <div className="mw-lace-edge mw-lace-left" />
              <div className="mw-door-inner mw-door-inner-left">
                {renderCoverFace("left")}
              </div>
              <div className="mw-door-shadow-left" />
            </div>
          </div>

          {/* Right Door Flap */}
          <div className="mw-door mw-door-right">
            <div className="mw-door-panel">
              <div className="mw-lace-edge mw-lace-right" />
              <div className="mw-door-inner mw-door-inner-right">
                {renderCoverFace("right")}
              </div>
              <div className="mw-door-shadow-right" />
            </div>
          </div>

          {/* Pearl & Crystal Brooch Clasp holding the doors */}
          <div className="mw-brooch-clasp" aria-hidden>
            <div className="mw-brooch-glow" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/templates/marwareed/brooch.png"
              alt=""
              className="mw-brooch-img"
              width={105}
              height={70}
            />
          </div>
        </div>

        {/* Ambient Hint */}
        <p className="mw-opening-hint">Turn your sound on for the full experience</p>
      </div>
    </div>
  );
}
