"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { SiyahOpening } from "./opening";
import "./siyah.css";

function SiyahBackdrop() {
  return <div className="sy-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: SiyahOpening,
  Backdrop: SiyahBackdrop,
  openingMs: 1900, // matches the CSS timings in siyah.css
};

/** "Siyah Taj": black, old gold and a single ruby thread. */
export default function SiyahTaj(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
