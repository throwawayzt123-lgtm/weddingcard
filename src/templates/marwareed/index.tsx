"use client";

import { InvitationExperience, type TemplateParts } from "@/components/invite-shared/experience";
import type { TemplateProps } from "../types";
import { MarwareedOpening } from "./opening";
import "./marwareed.css";

function MarwareedBackdrop() {
  return (
    <div className="mw-backdrop" aria-hidden>
      <div className="mw-backdrop-silk" />
      <div className="mw-backdrop-damask" />
      <div className="mw-backdrop-vignette" />
    </div>
  );
}

const parts: TemplateParts = {
  Opening: MarwareedOpening,
  Backdrop: MarwareedBackdrop,
  openingMs: 2400, // matches 3D gatefold swing transition in marwareed.css
  loadContent: () => import("./content"),
};

/** "Marwareed" — Luxury ivory silk gatefold with French lace, pearl brooch, and deckled-edge stationery. */
export default function Marwareed(props: TemplateProps) {
  return <InvitationExperience {...props} parts={parts} />;
}
