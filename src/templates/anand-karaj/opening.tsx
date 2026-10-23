"use client";

import type { OpeningProps } from "@/components/invite-shared/experience";
import { Art, CoverNames, StoryOpening } from "@/components/invite-shared/story-card";

const ART = "/templates/anand-karaj";

/**
 * A pastel pink and gold embroidered silk chadar canopy with pearl drops.
 * First tap: the golden Khanda seal shines, the chadar lifts upward like a royal canopy,
 * revealing the white marble Gurdwara palace sanctum and the couple holding the pink palla.
 */
export function AnandKarajOpening(props: OpeningProps) {
  return (
    <StoryOpening {...props} className="ak-opening" revealMs={3800} hint="Tap the golden emblem to raise the royal canopy">
      <Art className="ak-card" src={`${ART}/card.webp`} priority />
      <Art className="ak-chadar" src={`${ART}/chadar.webp`} priority />
      <Art className="ak-seal" src={`${ART}/seal.webp`} layer={false} />
      <CoverNames data={props.data} kicker="Anand Karaj • Sacred Auspicious Union" />
    </StoryOpening>
  );
}
