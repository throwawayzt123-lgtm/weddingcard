"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { InvitationViewData, RsvpResult, RsvpSubmission, TemplateProps } from "./types";

// Every design is loaded on demand, so a guest only downloads the design
// their invitation uses. Add new designs here (and in registry.ts).
const DESIGNS: Record<string, ComponentType<TemplateProps>> = {
  marwareed: dynamic(() => import("./marwareed")),
  "sadaf-e-noor": dynamic(() => import("./sadaf-e-noor")),
  "shahi-darwaza": dynamic(() => import("./shahi-darwaza")),
  gulzar: dynamic(() => import("./gulzar")),
  "mehndi-rang": dynamic(() => import("./mehndi-rang")),
  noor: dynamic(() => import("./noor")),
  "nikah-nama": dynamic(() => import("./nikah-nama")),
  chandni: dynamic(() => import("./chandni")),
  "siyah-taj": dynamic(() => import("./siyah-taj")),
  "neelam-kashi": dynamic(() => import("./neelam-kashi")),
  chambeli: dynamic(() => import("./chambeli")),
  bazm: dynamic(() => import("./bazm")),
  aasmani: dynamic(() => import("./aasmani")),
  sunehri: dynamic(() => import("./sunehri")),
  kesar: dynamic(() => import("./kesar")),
  farman: dynamic(() => import("./farman")),
  jharoka: dynamic(() => import("./jharoka")),
  "mor-pankh": dynamic(() => import("./mor-pankh")),
  "gulab-mahal": dynamic(() => import("./gulab-mahal")),
};

/** Server action that saves a guest's RSVP (live invitations only). */
export type RsvpAction = (slug: string, guestCode: string, submission: RsvpSubmission) => Promise<RsvpResult>;

/**
 * Picks the right design and wires up RSVP:
 *  - live invitation → saves via the server action
 *  - preview page → pretends to save (nothing is stored)
 */
export function TemplateHost({ data, rsvpAction }: { data: InvitationViewData; rsvpAction?: RsvpAction }) {
  const Design = DESIGNS[data.templateKey];
  if (!Design) return null;

  const onRsvp = async (submission: RsvpSubmission): Promise<RsvpResult> => {
    if (data.mode === "preview" || !rsvpAction || !data.guest) {
      await new Promise((r) => setTimeout(r, 700));
      return { ok: true };
    }
    return rsvpAction(data.slug, data.guest.code, submission);
  };

  return <Design data={data} onRsvp={onRsvp} />;
}
