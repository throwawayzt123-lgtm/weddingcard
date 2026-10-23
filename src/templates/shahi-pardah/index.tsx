"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ShahiPardahOpening } from "./opening";
import "./shahi-pardah.css";

function ShahiPardahBackdrop() {
  return <div className="sp-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ShahiPardahOpening,
  Backdrop: ShahiPardahBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Shahi Pardah": Imperial ivory chiffon curtains and hanging Moroccan lanterns parting onto a grand candlelit rose stage with a trailing bridal velvet train. */
export default function ShahiPardah(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
