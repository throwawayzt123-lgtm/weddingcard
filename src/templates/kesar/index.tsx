"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { KesarOpening } from "./opening";
import "./kesar.css";

function KesarBackdrop() {
  return <div className="ke-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: KesarOpening,
  Backdrop: KesarBackdrop,
  openingMs: 2400, // matches the CSS timings in kesar.css
};

/** "Kesar": saffron, cream and deep brown, on the classic scrolling page of cards. */
export default function Kesar(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
