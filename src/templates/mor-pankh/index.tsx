"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { MorPankhOpening } from "./opening";
import "./mor-pankh.css";

function MorPankhBackdrop() {
  return <div className="mp-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: MorPankhOpening,
  Backdrop: MorPankhBackdrop,
  openingMs: 2400, // matches the CSS timings in mor-pankh.css
};

/** "Mor Pankh": peacock teal, deep blue and gold. */
export default function MorPankh(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
