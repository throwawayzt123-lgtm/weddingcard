"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Palace doors, arches and gold silk on maroon and ivory.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("door-jaipur", "hall-palace", "corridor-amber", "silk-gold", "rose-red-teal"),
  eventPhotos: { BARAAT: 1, NIKKAH: 2, WALIMA: 3, MEHNDI: 3 },
  surfaces: [
    { bg: "#f6ecd9", ink: "#3b1018", accent: "#8a6420" },
    { bg: "#5b1020", ink: "#f6ecd9", accent: "#d9b45c" },
    { bg: "#2b1613", ink: "#f6ecd9", accent: "#c9a24b" },
  ],
  layouts: ["arch", "split", "overlay", "flip", "poster"],
  vars: {

  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
