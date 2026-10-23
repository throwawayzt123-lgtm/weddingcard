"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { LaalGulabOpening } from "./opening";
import "./laal-gulab.css";

function LaalGulabBackdrop() {
  return <div className="lg-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: LaalGulabOpening,
  Backdrop: LaalGulabBackdrop,
  openingMs: 1000, // the fade out of the opening (the card itself is revealed on the first tap, see opening.tsx)
  // Its own inside, drawn for this design (see content.tsx)
  loadContent: () => import("./content"),
};

/** "Laal Gulab": a velvet envelope with a wine wax seal and gold tassel; the ivory card slides out to fill the screen. */
export default function LaalGulab(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
