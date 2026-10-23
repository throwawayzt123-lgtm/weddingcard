"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/shahi-farman";

/**
 * A luxury crushed velvet jewelry casket stamped with an imperial seal.
 * First tap: the casket opens, the golden parchment scroll glides up and unrolls,
 * revealing the royal decree with turned gold finials.
 */
export function ShahiFarmanOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="sf-opening" revealMs={3800} hint="Break the royal seal to unroll the farman">
      <Art className="sf-casket" src={`${ART}/casket.webp`} priority />
      <Art className="sf-card" src={`${ART}/card.webp`} />
      <Art className="sf-lid" src={`${ART}/lid.webp`} priority />
      <Art className="sf-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="Royal Decree • Shahi Farman" />
    </StoryOpening>
  );
}
