"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

// The artwork is drawn by scripts/make-laal-gulab.cjs, on one 1080 × 1920 canvas.
const ART = "/templates/laal-gulab";

/**
 * An ivory envelope on burgundy velvet, sealed with wine red wax and a gold tassel. First tap: the seal drops,
 * the flap opens, the card slides out of the envelope and grows to fill the screen with the invitation on it.
 */
export function LaalGulabOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="lg-opening" revealMs={4000} hint="Break the seal to open your invitation">
      <Art className="lg-velvet" src={`${ART}/velvet.webp`} priority />
      <Art className="lg-env-back" src={`${ART}/env-back.webp`} />
      <Art className="lg-card" src={`${ART}/card.webp`} />
      <Art className="lg-env-front" src={`${ART}/env-front.webp`} priority />
      <Art className="lg-flap" src={`${ART}/flap.webp`} priority />
      <Art className="lg-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="You are invited to the wedding of" />
    </StoryOpening>
  );
}
