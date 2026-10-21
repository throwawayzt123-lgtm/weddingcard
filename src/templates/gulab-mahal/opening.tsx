"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { OpeningProps } from "@/components/invite-shared/experience";
import { GuestLine } from "@/components/invite-shared/guest-line";
import { useMusic } from "@/components/invite-shared/music";
import { formatLongDate } from "@/lib/dates";

// The artwork is drawn by scripts/make-gulab-mahal.cjs. All four pictures share one 1080 × 1920 canvas.
const ART = "/templates/gulab-mahal";
/** The envelope opens, the arch comes forward and the wording appears (timings in gulab-mahal.css). */
const REVEAL_MS = 3600;

type Step = "sealed" | "opening" | "revealed";

const line = (i: number) => ({ "--i": i }) as CSSProperties;

/** "Son of Mr. & Mrs. Khalid", unless the customer already wrote it that way. */
function parentage(prefix: string, parents: string | null): string | null {
  const text = parents?.trim();
  if (!text) return null;
  return /^(son|daughter)\b/i.test(text) ? text : `${prefix} ${text}`;
}

/**
 * A blush envelope sealed with rose gold wax. First tap: the seal breaks, the arched flap lifts and the
 * envelope falls away onto a palace arch at sunset, with the invitation written in the sky.
 * Second tap: the full invitation (the chapters) opens.
 */
export function GulabMahalOpening({ data, phase, onTap }: OpeningProps) {
  const [step, setStep] = useState<Step>("sealed");
  const { start } = useMusic();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const openEnvelope = () => {
    if (step !== "sealed") return;
    start(); // inside the tap, or browsers block the music
    setStep("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => setStep("revealed"), reduce ? 300 : REVEAL_MS);
  };
  const onStageClick = () => {
    if (step === "sealed") openEnvelope();
    else if (step === "revealed") onTap();
  };

  const groomParents = parentage("Son of", data.groomFamily.parentsLine);
  const brideParents = parentage("Daughter of", data.brideFamily.parentsLine);

  return (
    <div className="inv-opening gm-opening" data-phase={phase} data-step={step} onClick={onStageClick}>
      <div className="gm-stage">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed art, sized by CSS */}
        <img className="gm-layer gm-scene" src={`${ART}/scene.webp`} alt="" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gm-layer gm-envelope" src={`${ART}/envelope.webp`} alt="" aria-hidden fetchPriority="high" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gm-layer gm-flap" src={`${ART}/flap.webp`} alt="" aria-hidden fetchPriority="high" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gm-seal" src={`${ART}/seal.webp`} alt="" aria-hidden />

        <div className="gm-cover-ui">
          <GuestLine data={data} />
          <button
            type="button"
            className="inv-tap-btn gm-tap"
            onClick={(e) => {
              e.stopPropagation();
              openEnvelope();
            }}
            disabled={step !== "sealed"}
          >
            Tap to Open
          </button>
          <p className="gm-hint">Break the seal to reveal your invitation</p>
        </div>

        <div className="gm-words" aria-hidden={step === "sealed"}>
          <p className="gm-bismillah" lang="ar" dir="rtl" style={line(0)}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="gm-small" style={line(1)}>
            We request the honour of
            <br />
            your presence at the
          </p>
          <p className="gm-script" style={line(2)}>Wedding Ceremony</p>
          <p className="gm-small" style={line(3)}>of</p>
          <h1 className="gm-names" aria-label={`${data.groomName} and ${data.brideName}`}>
            <span className="gm-name" style={line(4)}>{data.groomName}</span>
            {groomParents && <span className="gm-parents" style={line(5)}>{groomParents}</span>}
            <span className="gm-amp" style={line(6)} aria-hidden>&amp;</span>
            <span className="gm-name" style={line(7)}>{data.brideName}</span>
            {brideParents && <span className="gm-parents" style={line(8)}>{brideParents}</span>}
          </h1>
          <p className="gm-date" style={line(9)}>{formatLongDate(data.weddingDate)}</p>
        </div>

        <button
          type="button"
          className="inv-tap-btn gm-enter"
          onClick={(e) => {
            e.stopPropagation();
            if (step === "revealed") onTap();
          }}
          disabled={step !== "revealed" || phase !== "closed"}
          tabIndex={step === "revealed" ? 0 : -1}
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
