"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ShahiTajOpening } from "./opening";
import "./shahi-taj.css";

function ShahiTajBackdrop() {
  return <div className="st-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ShahiTajOpening,
  Backdrop: ShahiTajBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Shahi Taj": Diamond crown palace in champagne gold and ivory, opening onto a baroque gold arch with crystal chandeliers and royal swans. */
export default function ShahiTaj(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
