"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { GulabMahalOpening } from "./opening";
import "./gulab-mahal.css";

function GulabMahalBackdrop() {
  return <div className="gm-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: GulabMahalOpening,
  Backdrop: GulabMahalBackdrop,
  openingMs: 1000, // the fade out of the opening in gulab-mahal.css (the envelope itself opens on the first tap)
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Gulab Mahal": a blush envelope with a rose gold seal that opens onto a palace arch at sunset. */
export default function GulabMahal(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
