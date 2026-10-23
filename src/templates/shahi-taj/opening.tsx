"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/shahi-taj";

/**
 * An ivory silk envelope with an embossed diamond crown gold wax seal and silk ribbon.
 * First tap: the seal lifts, the flap opens, the palace card slides out and fills the screen.
 */
export function ShahiTajOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="st-opening" revealMs={3800} hint="Break the royal seal to open your invitation">
      <Art className="st-silk" src={`${ART}/silk.webp`} priority />
      <Art className="st-env-back" src={`${ART}/env-back.webp`} />
      <Art className="st-card" src={`${ART}/card.webp`} />
      <Art className="st-env-front" src={`${ART}/env-front.webp`} priority />
      <Art className="st-flap" src={`${ART}/flap.webp`} priority />
      <Art className="st-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="You are cordially invited to the royal wedding of" />
    </StoryOpening>
  );
}
