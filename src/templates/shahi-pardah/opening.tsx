"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/shahi-pardah";

/**
 * An imperial stage framed with ivory chiffon curtains and gold tassels.
 * First tap: the crown seal lifts, the curtains slide open to both sides,
 * revealing the grand floral arch, hanging lanterns and royal couple.
 */
export function ShahiPardahOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="sp-opening" revealMs={3800} hint="Tap the royal crest to part the curtains">
      <Art className="sp-velvet" src={`${ART}/velvet.webp`} priority />
      <Art className="sp-card" src={`${ART}/card.webp`} />
      <Art className="sp-curtain-left" src={`${ART}/curtain-left.webp`} priority />
      <Art className="sp-curtain-right" src={`${ART}/curtain-right.webp`} priority />
      <Art className="sp-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="You are cordially invited to the royal wedding of" />
    </StoryOpening>
  );
}
