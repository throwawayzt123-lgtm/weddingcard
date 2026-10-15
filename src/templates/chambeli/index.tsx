"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ChambeliOpening } from "./opening";
import "./chambeli.css";

function ChambeliBackdrop() {
  return <div className="cb-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ChambeliOpening,
  Backdrop: ChambeliBackdrop,
  openingMs: 2400, // matches the CSS timings in chambeli.css
};

/** "Chambeli": pure white pages with hand-drawn jasmine. */
export default function Chambeli(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
