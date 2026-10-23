"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { MehfilOpening } from "./opening";
import "./mehfil.css";

function MehfilBackdrop() {
  return <div className="mf-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: MehfilOpening,
  Backdrop: MehfilBackdrop,
  openingMs: 1000, // the fade out of the opening (the card itself is revealed on the first tap, see opening.tsx)
  // Its own inside, drawn for this design (see content.tsx)
  loadContent: () => import("./content"),
};

/** "Mehfil": a marigold wreath spins open, parasols drop in and garlands swing. */
export default function Mehfil(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
