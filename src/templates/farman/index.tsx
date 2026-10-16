"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { FarmanOpening } from "./opening";
import "./farman.css";

function FarmanBackdrop() {
  return <div className="fm-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: FarmanOpening,
  Backdrop: FarmanBackdrop,
  openingMs: 2600, // matches the CSS timings in farman.css
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Farman": a royal decree in wine red and gold. */
export default function Farman(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
