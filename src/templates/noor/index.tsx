"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { NoorOpening } from "./opening";
import "./noor.css";

function NoorBackdrop() {
  return <div className="nr-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: NoorOpening,
  Backdrop: NoorBackdrop,
  openingMs: 1900, // matches the CSS transition timings in noor.css
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Noor" — modern minimal luxury in emerald and champagne gold. */
export default function Noor(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
