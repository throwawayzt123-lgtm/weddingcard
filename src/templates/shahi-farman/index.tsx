"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ShahiFarmanOpening } from "./opening";
import "./shahi-farman.css";

function ShahiFarmanBackdrop() {
  return <div className="sf-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ShahiFarmanOpening,
  Backdrop: ShahiFarmanBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Shahi Farman": Antique royal parchment scroll resting inside a crushed velvet casket, unrolling into an imperial wedding decree. */
export default function ShahiFarman(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
