"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Peacock feathers in teal, blue and gold.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("peacock-blue", "peacock-eye", "peacock-plumes", "feather-teal", "peacock-feather"),
  eventPhotos: {  },
  surfaces: [
    { bg: "#07363d", ink: "#f2ead6", accent: "#d8b45c" },
    { bg: "#031f25", ink: "#f2ead6", accent: "#d8b45c" },
    { bg: "#123f6b", ink: "#f2ead6", accent: "#ecd596" },
  ],
  layouts: ["overlay", "split", "arch", "flip", "poster"],
  vars: {
    "--ch-title-ls": "0.02em",
    "--ch-body": "var(--font-cormorant), Georgia, serif",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
