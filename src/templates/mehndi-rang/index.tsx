"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { MehndiOpening } from "./opening";
import "./mehndi.css";

function MehndiBackdrop() {
  return (
    <div className="mr-backdrop" aria-hidden>
      <div className="mr-bunting" />
    </div>
  );
}

const parts: TemplateParts = {
  Opening: MehndiOpening,
  Backdrop: MehndiBackdrop,
  openingMs: 2700, // matches the CSS transition timings in mehndi.css
};

/** "Mehndi Rang" — vibrant, joyful and festive. */
export default function MehndiRang(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
