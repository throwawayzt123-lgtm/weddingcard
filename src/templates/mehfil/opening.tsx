"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

// The artwork is drawn by scripts/make-mehfil.cjs, on one 1080 × 1920 canvas.
const ART = "/templates/mehfil";

/**
 * A marigold wreath with the couple's names, over a softly blurred mehndi scene. First tap: the wreath spins
 * open, the scene comes into focus, mirror work parasols drop in and marigold garlands swing down.
 */
export function MehfilOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="mf-opening" revealMs={3200} hint="Spin the wreath to open your invitation">
      <Art className="mf-base" src={`${ART}/base.webp`} priority />
      <Art className="mf-garlands" src={`${ART}/garlands.webp`} />
      <Art className="mf-parasols" src={`${ART}/parasols.webp`} />
      <Art className="mf-wreath" src={`${ART}/wreath.webp`} priority />
      <CoverNames data={props.data} kicker="Come celebrate with" />
    </StoryOpening>
  );
}
