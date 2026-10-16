"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { ShahiOpening } from "./opening";
import "./shahi.css";

function ShahiBackdrop() {
  return <div className="shahi-backdrop" aria-hidden />;
}

const parts: TemplateParts = {
  Opening: ShahiOpening,
  Backdrop: ShahiBackdrop,
  openingMs: 2800, // matches the CSS transition timings in shahi.css
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Shahi Darwaza" — royal Mughal door. */
export default function ShahiDarwaza(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
