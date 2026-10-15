"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { NikahOpening } from "./opening";
import "./nikah.css";

function NikahBackdrop() {
  return <div className="nk-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: NikahOpening,
  Backdrop: NikahBackdrop,
  openingMs: 3100, // matches the CSS timings in nikah.css
};

/** "Nikah Nama": ivory paper, crimson ink, a bound book that opens. */
export default function NikahNama(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
