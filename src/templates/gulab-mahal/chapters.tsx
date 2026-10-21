"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { POOL } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: the palace arch at sunset, then blossoms, marble and candlelight
// in blush, ivory and dusky rose. Each chapter takes the next picture, colour scheme and layout from these lists.
const CONFIG: ChapterConfig = {
  photos: [
    { src: "/templates/gulab-mahal/scene.webp", alt: "A bride and groom seen from behind under a flowered palace arch, looking out at a domed palace at sunset", position: "50% 72%", surface: 0 },
    POOL.blossoms,
    POOL["pavilion-marble"],
    POOL["centerpiece-white"],
    POOL["garden-arch"],
    POOL["table-candle"],
  ],
  eventPhotos: { NIKKAH: 0, BARAAT: 0, WALIMA: 3, MEHNDI: 1 },
  surfaces: [
    { bg: "#f8ece6", ink: "#4f2c33", accent: "#a5656a" },
    { bg: "#fbf5ef", ink: "#4a2a30", accent: "#a07560" },
    { bg: "#6a3f46", ink: "#fbefe8", accent: "#e8c2ad" },
  ],
  layouts: ["arch", "split", "flip", "overlay", "poster"],
  vars: {
    "--ch-names-font": "var(--font-pinyon), cursive",
  },
};

export default function GulabMahalChapters(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
