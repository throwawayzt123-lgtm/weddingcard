"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { SadafOpening } from "./opening";
import "./sadaf.css";

function SadafBackdrop() {
  return (
    <div className="sd-backdrop" aria-hidden>
      <div className="sd-backdrop-blush" />
      <div className="sd-backdrop-damask" />
      <div className="sd-backdrop-vignette" />
    </div>
  );
}

const parts: TemplateParts = {
  Opening: SadafOpening,
  Backdrop: SadafBackdrop,
  openingMs: 2400,
  loadContent: () => import("./content"),
};

/** "Sadaf-e-Noor" — Blush silk satin gatefold with rose gold scalloped lace, crystal buckle, and loaded royal suite. */
export default function SadafENoor(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
