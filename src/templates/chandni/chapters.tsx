"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Moonlight, silver silk and candles on pearl and slate.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("moon", "silk-champagne", "rose-white-dark", "table-candle", "silk-black"),
  eventPhotos: { NIKKAH: 2, WALIMA: 3 },
  surfaces: [
    { bg: "#eceef2", ink: "#20252c", accent: "#5c6678" },
    { bg: "#1e2329", ink: "#eef0f3", accent: "#c3cad5" },
    { bg: "#2a3038", ink: "#eef0f3", accent: "#c3cad5" },
  ],
  layouts: ["flip", "overlay", "split", "poster"],
  vars: {
    "--ch-display": "var(--font-italiana), serif",
    "--ch-body": "var(--font-cormorant), Georgia, serif",
    "--ch-sans": "var(--font-jost), Arial, sans-serif",
    "--ch-names-font": "var(--font-italiana), serif",
    "--ch-names-transform": "uppercase",
    "--ch-names-ls": "0.08em",
    "--ch-names-lh": "1.15",
    "--ch-names-size": "clamp(44px, 4.6vw, 72px)",
    "--ch-title-transform": "uppercase",
    "--ch-title-ls": "0.06em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
