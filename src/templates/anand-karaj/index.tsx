"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { AnandKarajOpening } from "./opening";
import "./anand-karaj.css";

function AnandKarajBackdrop() {
  return <div className="ak-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: AnandKarajOpening,
  Backdrop: AnandKarajBackdrop,
  openingMs: 1000,
  loadContent: () => import("./content"),
};

/** "Anand Karaj": Royal Gurdwara palace sanctum in pastel pink and pure marble, with golden Palki Sahib and silk chadar canopy. */
export default function AnandKaraj(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
