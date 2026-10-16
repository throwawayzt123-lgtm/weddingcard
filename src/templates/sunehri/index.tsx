"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { SunehriOpening } from "./opening";
import "./sunehri.css";

function SunehriBackdrop() {
  return <div className="su-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: SunehriOpening,
  Backdrop: SunehriBackdrop,
  openingMs: 2300, // matches the CSS timings in sunehri.css
};

/** "Sunehri": champagne gold and ivory, on the classic scrolling page of cards. */
export default function Sunehri(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
