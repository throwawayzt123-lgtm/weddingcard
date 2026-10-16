"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import type { ContentProps } from "@/components/invite-shared/experience";

// Bazm: three candlelit courtyard pictures. Each picture comes with its own colour: forest green, wine, ivory.
const CONFIG: ChapterConfig = {
  photos: [
    { src: "/templates/bazm/scene-walima.webp", alt: "A sunlit limestone arcade with olive trees, white flowers and a long laid table", surface: 0 },
    { src: "/templates/bazm/scene-mehndi.webp", alt: "A courtyard pool with floating flowers and warm lanterns under orange trees", surface: 1 },
    { src: "/templates/bazm/scene-barat.webp", alt: "A candlelit stone arch and palace courtyard at sunset with deep red roses", surface: 2 },
  ],
  eventPhotos: { DHOLKI: 1, MAYUN: 1, MEHNDI: 1, NIKKAH: 2, BARAAT: 2, RUKHSATI: 2, WALIMA: 0 },
  surfaces: [
    { bg: "#f4eee3", ink: "#3d1927", accent: "#8b6a3a" },
    { bg: "#1e372d", ink: "#f0e9da", accent: "#c3a776" },
    { bg: "#3d1927", ink: "#f0e9da", accent: "#c3a776" },
  ],
  layouts: ["split"],
  vars: {
    "--ch-display": "var(--font-cormorant), Georgia, serif",
    "--ch-body": "var(--font-cormorant), Georgia, serif",
    "--ch-names-font": "var(--font-cormorant), Georgia, serif",
    "--ch-names-ls": "-0.045em",
    "--ch-names-lh": "0.95",
    "--ch-title-ls": "-0.055em",
  },
};

export default function BazmChapters(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
