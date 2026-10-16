"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { BazmOpening } from "./opening";
import "./bazm.css";

function BazmBackdrop() {
  return <div className="bz-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: BazmOpening,
  Backdrop: BazmBackdrop,
  openingMs: 1250, // matches the cover transition in bazm.css
  // Its own page body: full-screen chapters, each with its own picture (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Bazm": a full-screen chapter-by-chapter invitation where the picture changes with every chapter. */
export default function Bazm(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
