"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { AasmaniOpening } from "./opening";
import "./aasmani.css";

function AasmaniBackdrop() {
  return <div className="aa-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: AasmaniOpening,
  Backdrop: AasmaniBackdrop,
  openingMs: 2300, // matches the CSS timings in aasmani.css
};

/** "Aasmani": soft sky blue and cloud white, on the classic scrolling page of cards. */
export default function Aasmani(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
