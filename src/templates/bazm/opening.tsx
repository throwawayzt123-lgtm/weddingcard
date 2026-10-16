"use client";

import { Mail } from "lucide-react";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { dateRange } from "@/components/invite-shared/chapters/copy";

/** A split cover: the names on the left, a candlelit arch on the right. Tap → the two halves slide apart. */
export function BazmOpening({ data, phase, onTap }: OpeningProps) {
  return (
    <div className="inv-opening bz-cover" data-phase={phase} data-opening={phase === "opening"} onClick={onTap}>
      <div className="bz-cover-copy">
        <div className="bz-cover-ornament" aria-hidden />
        <p className="bz-eyebrow">Together with their families</p>
        <p className="bz-cover-names" aria-label={`${data.groomName} and ${data.brideName}`}>
          <span>{data.groomName}</span>
          <span className="bz-name-second">
            <span className="bz-amp">&amp;</span>
            <span>{data.brideName}</span>
          </span>
        </p>
        <p className="bz-cover-description">
          A celebration of love.
          <br />
          A lifetime of togetherness.
        </p>
        <p className="bz-cover-date">{dateRange(data)}</p>
        <button
          type="button"
          className="bz-primary"
          onClick={(e) => {
            e.stopPropagation();
            onTap();
          }}
          disabled={phase !== "closed"}
        >
          <Mail aria-hidden />
          Tap to Open
        </button>
        <p className="bz-cover-foot">Some moments are meant to be shared.</p>
      </div>

      <div className="bz-cover-visual">
        <div className="bz-cover-arch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/templates/bazm/scene-barat.webp" alt="" fetchPriority="high" decoding="async" />
          <p className="bz-arch-caption">The beginning of our forever</p>
        </div>
      </div>
    </div>
  );
}
