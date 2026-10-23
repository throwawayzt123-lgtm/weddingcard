"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/shahi-banafsha";

/**
 * An imperial amethyst purple velvet envelope with a crowned jewel wax medallion.
 * First tap: the seal lifts with violet and golden light, the flap opens,
 * and the scalloped die-cut gold and amethyst card rises into full view.
 */
export function ShahiBanafshaOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="sb-opening" revealMs={3800} hint="Tap the imperial seal to open your invitation">
      <Art className="sb-velvet" src={`${ART}/velvet.webp`} priority />
      <Art className="sb-card" src={`${ART}/card.webp`} />
      <Art className="sb-env-front" src={`${ART}/env-front.webp`} priority />
      <Art className="sb-flap" src={`${ART}/flap.webp`} priority />
      <Art className="sb-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="You are cordially invited to the royal wedding of" />
    </StoryOpening>
  );
}
