"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/qasr-e-noor";

/**
 * Closed baroque gold gates with a radiant crystal starburst crest.
 * First tap: the crystal crest bursts with light, the gates swing open outward in 3D,
 * camera glides into the grand starlit crystal ballroom with shimmering chandeliers.
 */
export function QasrNoorOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="qn-opening" revealMs={3800} hint="Tap the crystal crest to open the palace gates">
      <Art className="qn-card" src={`${ART}/card.webp`} />
      <Art className="qn-gate-left" src={`${ART}/gate-left.webp`} priority />
      <Art className="qn-gate-right" src={`${ART}/gate-right.webp`} priority />
      <Art className="qn-crest" src={`${ART}/crest.webp`} layer={false} />
      <CoverNames data={props.data} kicker="A Starlit Affair • Royal Celebration" />
    </StoryOpening>
  );
}
