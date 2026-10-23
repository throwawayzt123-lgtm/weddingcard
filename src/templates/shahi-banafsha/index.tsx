"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ShahiBanafshaOpening } from "./opening";
import "./shahi-banafsha.css";

function ShahiBanafshaBackdrop() {
  return <div className="sb-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ShahiBanafshaOpening,
  Backdrop: ShahiBanafshaBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Shahi Banafsha": Imperial royal amethyst crushed velvet with a scalloped Victorian gold die-cut card and crowned jewel seal. */
export default function ShahiBanafsha(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
