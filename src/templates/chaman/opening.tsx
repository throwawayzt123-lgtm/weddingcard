"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

// The artwork is drawn by scripts/make-chaman.cjs, on one 1080 × 1920 canvas.
const ART = "/templates/chaman";

/**
 * A sehra: strings of jasmine with red roses, hanging from a band of roses and gold, covering a white rose garden.
 * First tap: the band lifts, the strings part to either side and the garden card comes forward with the invitation.
 */
export function ChamanOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="cm-opening" revealMs={3400} hint="Part the sehra to reveal your invitation">
      <Art className="cm-scene" src={`${ART}/scene.webp`} priority />
      <Art className="cm-sehra-left" src={`${ART}/sehra-left.webp`} priority />
      <Art className="cm-sehra-right" src={`${ART}/sehra-right.webp`} priority />
      <Art className="cm-sehra-top" src={`${ART}/sehra-top.webp`} priority />
      <CoverNames data={props.data} kicker="The wedding of" />
    </StoryOpening>
  );
}
