"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, StoryOpening } from "@/components/invite-shared/story-card";

// The artwork is drawn by scripts/make-gulab-mahal.cjs. All four pictures share one 1080 × 1920 canvas.
const ART = "/templates/gulab-mahal";

/**
 * A blush envelope sealed with rose gold wax. First tap: the seal breaks, the arched flap lifts and the
 * envelope falls away onto a palace arch at sunset, with the invitation written in the sky.
 * Second tap: the full invitation (the chapters) opens.
 */
export function GulabMahalOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="gm-opening" revealMs={3600} hint="Break the seal to reveal your invitation">
      <Art className="gm-scene" src={`${ART}/scene.webp`} />
      <Art className="gm-envelope" src={`${ART}/envelope.webp`} priority />
      <Art className="gm-flap" src={`${ART}/flap.webp`} priority />
      <Art className="gm-seal" src={`${ART}/seal.webp`} layer={false} />
    </StoryOpening>
  );
}
