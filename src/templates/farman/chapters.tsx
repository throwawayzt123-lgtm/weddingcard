"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Red roses, hall lamps and gold silk on wine and parchment.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("rose-red-teal", "hall-palace", "candlesticks", "silk-gold", "rose-dark"),
  eventPhotos: { BARAAT: 1, NIKKAH: 2, WALIMA: 3 },
  surfaces: [
    { bg: "#f6ecd6", ink: "#3b1420", accent: "#8a1f3a" },
    { bg: "#4a0f20", ink: "#f4e9d4", accent: "#d4b06a" },
    { bg: "#2c0712", ink: "#f4e9d4", accent: "#d4b06a" },
  ],
  layouts: ["split", "overlay", "arch", "flip", "poster"],
  vars: {
    "--ch-title-ls": "0.01em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
