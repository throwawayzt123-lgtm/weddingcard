"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { NeelamOpening } from "./opening";
import "./neelam.css";

function NeelamBackdrop() {
  return <div className="nl-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: NeelamOpening,
  Backdrop: NeelamBackdrop,
  openingMs: 1750, // matches the CSS timings in neelam.css
};

/** "Neelam Kashi": sapphire blue and Multani glazed-tile work. */
export default function NeelamKashi(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
