"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Soft blossoms and garden aisles in blush, rose and sage.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("blossoms", "garden-aisle", "table-candle", "garden-arch", "centerpiece-white", "flowers-night"),
  eventPhotos: { NIKKAH: 3, WALIMA: 2 },
  surfaces: [
    { bg: "#fff8f3", ink: "#4a2f36", accent: "#a24d5c" },
    { bg: "#f6d9d8", ink: "#53262f", accent: "#a24d5c" },
    { bg: "#e8eee2", ink: "#2f4430", accent: "#5f7f55" },
  ],
  layouts: ["flip", "arch", "split", "poster", "overlay"],
  vars: {

  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
