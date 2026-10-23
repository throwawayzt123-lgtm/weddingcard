"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { QasrNoorOpening } from "./opening";
import "./qasr-noor.css";

function QasrNoorBackdrop() {
  return <div className="qn-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: QasrNoorOpening,
  Backdrop: QasrNoorBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Qasr-e-Noor": Crystal grand ballroom palace with soaring baroque gold arches, cascading chandeliers, and 3D opening gates. */
export default function QasrNoor(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
