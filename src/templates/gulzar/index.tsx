"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { CornerCluster, FallingPetals, FloralDefs } from "./florals";
import { GulzarOpening } from "./opening";
import "./gulzar.css";

function GulzarBackdrop() {
  return (
    <div className="gz-backdrop" aria-hidden>
      <FloralDefs />
      <CornerCluster className="gz-corner gz-tl" />
      <CornerCluster className="gz-corner gz-tr" />
      <CornerCluster className="gz-corner gz-bl" />
      <CornerCluster className="gz-corner gz-br" />
      <FallingPetals />
    </div>
  );
}

const parts: TemplateParts = {
  Opening: GulzarOpening,
  Backdrop: GulzarBackdrop,
  openingMs: 3200, // matches the CSS transition timings in gulzar.css
  // Full-screen chapters: a new picture, colour and layout with every scroll (see chapters.tsx)
  loadContent: () => import("./chapters"),
};

/** "Gulzar" — romantic floral garden with a wax-sealed envelope. */
export default function Gulzar(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
