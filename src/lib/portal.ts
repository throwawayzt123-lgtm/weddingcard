import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Invitation } from "@prisma/client";
import { ActionError } from "@/lib/action-state";
import { requireUser, requireUserForAction, type CurrentUser } from "@/lib/dal";
import { getPlan, type PlanConfig } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------
// Everything a customer does goes through these checks:
//   1. who is logged in (re-checked from the database, never from the browser)
//   2. does this invitation belong to them? (admins may open any)
//   3. is the invitation still editable? (not suspended / not expired)
// ---------------------------------------------------------------

export const INVITATION_COOKIE = "wc_inv";

export type EditState = { editable: true } | { editable: false; reason: string };

export function editState(inv: Pick<Invitation, "status" | "expiresAt">, user: Pick<CurrentUser, "role">): EditState {
  if (user.role === "ADMIN") return { editable: true }; // support can always help
  if (inv.status === "SUSPENDED") return { editable: false, reason: "This invitation is suspended. Please contact us on WhatsApp." };
  if (inv.status === "EXPIRED" || inv.expiresAt.getTime() <= Date.now()) {
    return { editable: false, reason: "This invitation has expired, so it can no longer be edited. Contact us on WhatsApp to extend it." };
  }
  return { editable: true };
}

/** For pages: the logged-in user and the invitation they are working on. */
export const getPortalContext = cache(async () => {
  const user = await requireUser();
  const selected = (await cookies()).get(INVITATION_COOKIE)?.value;

  if (user.role === "ADMIN") {
    // An admin opens a customer's portal from the admin panel ("Open customer portal").
    if (!selected) redirect("/admin");
    const inv = await prisma.invitation.findUnique({ where: { id: selected } });
    if (!inv) redirect("/admin");
    return { user, invitation: inv, all: [inv], edit: editState(inv, user), plan: getPlan(inv.plan), asAdmin: true };
  }

  const all = await prisma.invitation.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: "desc" } });
  const invitation = all.find((i) => i.id === selected) ?? all[0] ?? null;
  return {
    user,
    invitation,
    all,
    edit: invitation ? editState(invitation, user) : ({ editable: false, reason: "No invitation" } as EditState),
    plan: invitation ? getPlan(invitation.plan) : null,
    asAdmin: false,
  };
});

/** Like getPortalContext, but for pages that need an invitation to exist. */
export async function requirePortalInvitation() {
  const ctx = await getPortalContext();
  if (!ctx.invitation || !ctx.plan) redirect("/portal");
  return { ...ctx, invitation: ctx.invitation, plan: ctx.plan };
}

/**
 * For server ACTIONS. `invitationId` comes from the browser, so it is NOT trusted:
 * we load it and compare its owner to the logged-in user.
 */
export async function guardInvitation(invitationId: unknown, options: { allowReadOnly?: boolean } = {}): Promise<{ user: CurrentUser; inv: Invitation; plan: PlanConfig }> {
  const user = await requireUserForAction();
  const inv = typeof invitationId === "string" ? await prisma.invitation.findUnique({ where: { id: invitationId } }) : null;
  // Same message whether it does not exist or belongs to someone else.
  if (!inv || (user.role !== "ADMIN" && inv.ownerId !== user.id)) throw new ActionError("You are not allowed to change this invitation.");
  if (!options.allowReadOnly) {
    const state = editState(inv, user);
    if (!state.editable) throw new ActionError(state.reason);
  }
  return { user, inv, plan: getPlan(inv.plan) };
}

/** Turn FormData into a plain object, ignoring Next.js's internal "$ACTION…" fields. */
export function formToObject(formData: FormData): Record<string, FormDataEntryValue> {
  const out: Record<string, FormDataEntryValue> = {};
  for (const [key, value] of formData.entries()) if (!key.startsWith("$ACTION")) out[key] = value;
  return out;
}
