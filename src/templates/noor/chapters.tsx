"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Gold mosaics and domes on deep emerald and ivory.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("mosaic-brown", "dome-mosque", "corridor-amber", "jasmine-leaves", "candles-night"),
  eventPhotos: { NIKKAH: 1, MEHNDI: 3, WALIMA: 2 },
  surfaces: [
    { bg: "#0b3d2e", ink: "#f2ead6", accent: "#dcc58d" },
    { bg: "#fbfaf6", ink: "#10241c", accent: "#84692b" },
    { bg: "#082b20", ink: "#f2ead6", accent: "#dcc58d" },
  ],
  layouts: ["overlay", "arch", "split", "flip"],
  vars: {
    "--ch-names-ls": "0.01em",
    "--ch-names-lh": "1",
    "--ch-title-weight": "300",
    "--ch-title-ls": "-0.03em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
