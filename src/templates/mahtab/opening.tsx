"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

// The artwork is drawn by scripts/make-mahtab.cjs, on one 1080 × 1920 canvas.
const ART = "/templates/mahtab";

/**
 * A starry night with the moon low on the horizon. First tap: the full moon rises into place and the gold arch,
 * the lit palace and the blue and white roses appear around it, with the invitation written in the night sky.
 */
export function MahtabOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="mt-opening" revealMs={3700} hint="Let the moon rise on your invitation">
      <Art className="mt-sky" src={`${ART}/sky.webp`} priority />
      <Art className="mt-moon" src={`${ART}/moon.webp`} priority />
      <Art className="mt-front" src={`${ART}/front.webp`} />
      <CoverNames data={props.data} kicker="Under the moonlight, with" />
    </StoryOpening>
  );
}
