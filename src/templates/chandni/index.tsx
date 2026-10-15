"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ChandniOpening } from "./opening";
import "./chandni.css";

function ChandniBackdrop() {
  return <div className="cd-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ChandniOpening,
  Backdrop: ChandniBackdrop,
  openingMs: 2300, // matches the CSS timings in chandni.css
};

/** "Chandni": moonlight in silver and slate grey. */
export default function Chandni(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
