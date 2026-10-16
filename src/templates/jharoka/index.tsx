"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { JharokaOpening } from "./opening";
import "./jharoka.css";

function JharokaBackdrop() {
  return <div className="jh-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: JharokaOpening,
  Backdrop: JharokaBackdrop,
  openingMs: 2300, // matches the CSS timings in jharoka.css
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Jharoka": sandstone, terracotta and a carved lattice window. */
export default function Jharoka(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
