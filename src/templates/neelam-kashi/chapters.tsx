"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Cobalt tile-work, domes and night sky on sapphire and ivory.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("tiles-blue", "tiles-blue-night", "dome-mosque", "moon", "mosaic-brown"),
  eventPhotos: { NIKKAH: 2, BARAAT: 1, WALIMA: 0 },
  surfaces: [
    { bg: "#f7f2e6", ink: "#14264f", accent: "#1c3f94" },
    { bg: "#0c1a3b", ink: "#f4efe2", accent: "#dcc283" },
    { bg: "#14264f", ink: "#f4efe2", accent: "#dcc283" },
  ],
  layouts: ["arch", "flip", "split", "overlay"],
  vars: {
    "--ch-title-weight": "500",
    "--ch-title-ls": "0.03em",
    "--ch-sans": "var(--font-cinzel), Georgia, serif",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
