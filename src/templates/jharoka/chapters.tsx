"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Marble pavilions, forts and carved doors on sandstone and terracotta.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("pavilion-marble", "fort-ruin", "dome-agra", "door-jaipur", "corridor-amber"),
  eventPhotos: { BARAAT: 3, NIKKAH: 0, WALIMA: 4 },
  surfaces: [
    { bg: "#fbf5e9", ink: "#3a2a1e", accent: "#a8482a" },
    { bg: "#a8482a", ink: "#fbf0d8", accent: "#f3dca2" },
    { bg: "#2b1a11", ink: "#f7ead0", accent: "#e1bd78" },
  ],
  layouts: ["arch", "poster", "flip", "split", "overlay"],
  vars: {
    "--ch-title-ls": "0.02em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
