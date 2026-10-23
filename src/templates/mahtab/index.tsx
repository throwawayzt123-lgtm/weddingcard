"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { MahtabOpening } from "./opening";
import "./mahtab.css";

function MahtabBackdrop() {
  return <div className="mt-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: MahtabOpening,
  Backdrop: MahtabBackdrop,
  openingMs: 1000, // the fade out of the opening (the card itself is revealed on the first tap, see opening.tsx)
  // Its own inside, drawn for this design (see content.tsx)
  loadContent: () => import("./content"),
};

/** "Mahtab": the full moon rises over a starry sky and a gold arch, a palace and blue roses appear around it. */
export default function Mahtab(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
