"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ChamanOpening } from "./opening";
import "./chaman.css";

function ChamanBackdrop() {
  return <div className="cm-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ChamanOpening,
  Backdrop: ChamanBackdrop,
  openingMs: 1000, // the fade out of the opening (the card itself is revealed on the first tap, see opening.tsx)
  // Its own inside, drawn for this design (see content.tsx)
  loadContent: () => import("./content"),
};

/** "Chaman": a sehra of jasmine strings parts onto a white rose garden. */
export default function Chaman(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
