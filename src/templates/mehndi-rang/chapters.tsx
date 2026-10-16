"use client";

import Chapters from "@/components/invite-shared/chapters/engine";
import type { ChapterConfig } from "@/components/invite-shared/chapters/config";
import { pictures } from "@/components/invite-shared/chapters/photos";
import type { ContentProps } from "@/components/invite-shared/experience";

// The full-screen chapters of this design: Mehndi decor, henna hands and festive lights in marigold, pink and green.
// Each chapter takes the next picture, colour scheme and layout from these lists, so the background changes as you scroll.
// Change the pictures by naming others from src/components/invite-shared/chapters/photos.ts (or add your own files).
const CONFIG: ChapterConfig = {
  photos: pictures("mehndi-decor", "mehndi-hands", "lights-bokeh", "table-banquet", "hall-palace"),
  eventPhotos: { MEHNDI: 1, DHOLKI: 0, MAYUN: 2, WALIMA: 3 },
  surfaces: [
    { bg: "#fff6df", ink: "#3b1450", accent: "#c2185b" },
    { bg: "#3b1450", ink: "#fff3cf", accent: "#ffb300" },
    { bg: "#0f5a2c", ink: "#fff3cf", accent: "#ffc400" },
    { bg: "#c2185b", ink: "#fff6df", accent: "#ffe082" },
  ],
  layouts: ["poster", "split", "overlay", "flip"],
  vars: {
    "--ch-body": "var(--font-cormorant), Georgia, serif",
    "--ch-title-ls": "-0.01em",
  },
};

export default function Chapter(props: ContentProps) {
  return <Chapters {...props} config={CONFIG} />;
}
