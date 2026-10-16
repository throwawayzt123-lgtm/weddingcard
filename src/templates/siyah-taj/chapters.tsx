"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Black satin, candlelight and gold with a ruby rose.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("silk-black", "candles-night", "rose-black", "silk-gold", "lights-bokeh"),
  eventPhotos: { BARAAT: 1, NIKKAH: 2, WALIMA: 3 },
  surfaces: [
    { bg: "#0a0a0b", ink: "#ece6d8", accent: "#c9a45c" },
    { bg: "#ece6d8", ink: "#0a0a0b", accent: "#8a6a24" },
    { bg: "#1a0a0d", ink: "#ece6d8", accent: "#d4505d" },
  ],
  layouts: ["poster", "split", "overlay", "flip"],
  vars: {
    "--ch-body": "var(--font-bodoni), Georgia, serif",
    "--ch-sans": "var(--font-jost), Arial, sans-serif",
    "--ch-names-font": "var(--font-bodoni), Georgia, serif",
    "--ch-names-transform": "uppercase",
    "--ch-names-ls": "0.01em",
    "--ch-names-lh": "0.94",
    "--ch-names-size": "clamp(48px, 5.2vw, 82px)",
    "--ch-title-style": "italic",
    "--ch-title-ls": "-0.03em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
