"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Jasmine, white aisles and drapes on pure white and sage.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("jasmine-leaves", "venue-white", "flowers-night", "drapes-white", "blossoms", "table-greenery"),
  eventPhotos: { NIKKAH: 3, WALIMA: 5 },
  surfaces: [
    { bg: "#ffffff", ink: "#2e3a33", accent: "#4c6853" },
    { bg: "#f2f6f1", ink: "#2e3a33", accent: "#4c6853" },
    { bg: "#4c6853", ink: "#ffffff", accent: "#ecdcb5" },
  ],
  layouts: ["flip", "arch", "poster", "split"],
  vars: {
    "--ch-title-style": "italic",
    "--ch-title-ls": "-0.02em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
