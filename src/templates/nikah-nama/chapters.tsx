"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Red roses and candlelight on ivory paper and crimson.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("rose-dark", "rose-red-teal", "candlesticks", "centerpiece-white", "rose-black"),
  eventPhotos: { NIKKAH: 1, BARAAT: 4, WALIMA: 3 },
  surfaces: [
    { bg: "#fbf8f2", ink: "#2b1a1c", accent: "#8f1a2c" },
    { bg: "#8f1a2c", ink: "#fbf8f2", accent: "#ecd08e" },
  ],
  layouts: ["split", "poster", "flip", "arch"],
  vars: {

  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
