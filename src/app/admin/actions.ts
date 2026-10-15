"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ActionError, firstFieldErrors, runAction, type ActionState } from "@/lib/action-state";
import { correctNamesSchema, createInvitationSchema, settingsSchema, updateInvitationSchema } from "@/lib/admin-schemas";
import { requireAdminForAction } from "@/lib/dal";
import {
  correctNames, createInvitation, deleteInvitation, extendExpiry, findDuplicateCouples, resetClientPassword, setStatus, updateAdminFields, ymdToDate, addDays,
} from "@/lib/invitations";
import { normalizePhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { getSettings, saveSettings } from "@/lib/settings";
import { z } from "zod";

// ---------------------------------------------------------------
// Every action below starts with requireAdminForAction(): the admin
// panel is protected by the proxy AND by this check on every call, so
// a customer can never trigger these even by crafting a request.
// ---------------------------------------------------------------

export type CreatedPayload = {
  invitationId: string;
  slug: string;
  groomName: string;
  brideName: string;
  ownerName: string;
  ownerPhone: string | null;
  credentials: { username: string; password: string } | null;
};
export type DuplicatePayload = { duplicates: { id: string; slug: string; groomName: string; brideName: string; owner: string }[] };

function formToObject(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

function refresh() {
  revalidatePath("/admin", "layout");
}

export async function createInvitationAction(_prev: ActionState<CreatedPayload | DuplicatePayload>, formData: FormData): Promise<ActionState<CreatedPayload | DuplicatePayload>> {
  return runAction<CreatedPayload | DuplicatePayload>(async () => {
    const admin = await requireAdminForAction();
    const parsed = createInvitationSchema.safeParse(formToObject(formData));
    if (!parsed.success) {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(z.flattenError(parsed.error).fieldErrors) };
    }

    const result = await createInvitation(parsed.data, admin.id);
    if (result.kind === "duplicate") {
      return {
        ok: false,
        error: "An invitation for this couple already exists.",
        data: { duplicates: result.duplicates.map((d) => ({ id: d.id, slug: d.slug, groomName: d.groomName, brideName: d.brideName, owner: d.owner.name })) },
      };
    }
    refresh();
    return { ok: true, message: "Invitation created", data: {
        invitationId: result.invitationId,
        slug: result.slug,
        groomName: parsed.data.groomName,
        brideName: parsed.data.brideName,
        ownerName: result.ownerName,
        ownerPhone: result.ownerPhone,
        credentials: result.credentials,
      },
    };
  });
}

export async function updateInvitationAction(invitationId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const admin = await requireAdminForAction();
    const parsed = updateInvitationSchema.safeParse(formToObject(formData));
    if (!parsed.success) {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(z.flattenError(parsed.error).fieldErrors) };
    }
    const v = parsed.data;
    const current = await prisma.invitation.findUnique({ where: { id: invitationId }, select: { id: true, expiresAt: true, expiryAuto: true } });
    if (!current) throw new ActionError("Invitation not found.");

    const weddingDate = ymdToDate(v.weddingDate);
    const settings = await getSettings();
    let expiresAt = current.expiresAt;
    if (v.expiryMode === "custom") {
      if (!v.expiresAt) return { ok: false, error: "Please choose an expiry date.", fieldErrors: { expiresAt: "Choose a date" } };
      expiresAt = ymdToDate(v.expiresAt);
    } else {
      // Automatic: last event (or the wedding date) + default days.
      const events = await prisma.event.findMany({ where: { invitationId }, select: { date: true } });
      const last = Math.max(weddingDate.getTime(), ...events.map((e) => e.date.getTime()));
      expiresAt = addDays(new Date(last), settings.defaultExpiryDays);
    }

    const changed = await updateAdminFields(
      invitationId,
      {
        templateKey: v.templateKey,
        plan: v.plan as never,
        status: v.status,
        weddingDate,
        dateLocked: v.dateLocked,
        expiresAt,
        expiryAuto: v.expiryMode === "auto",
        showBadge: v.showBadge,
        paymentStatus: v.paymentStatus,
        paymentAmount: v.paymentAmount ?? null,
        paymentMethod: v.paymentMethod ?? null,
        paymentRef: v.paymentRef ?? null,
      },
      admin.id,
    );
    refresh();
    return { ok: true, message: changed.length ? "Saved" : "Nothing to change" };
  });
}

export async function correctNamesAction(invitationId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    const admin = await requireAdminForAction();
    const parsed = correctNamesSchema.safeParse(formToObject(formData));
    if (!parsed.success) {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(z.flattenError(parsed.error).fieldErrors) };
    }
    const { groomName, brideName, reason } = parsed.data;
    const dups = await findDuplicateCouples(groomName, brideName, invitationId);
    if (dups.length > 0 && formData.get("confirmDuplicate") !== "on") {
      return {
        ok: false,
        error: `Another invitation already uses ${groomName} & ${brideName} (/i/${dups[0].slug}). Tick the box to continue anyway.`,
        fieldErrors: { confirmDuplicate: "Tick to confirm" },
      };
    }
    await correctNames(invitationId, groomName, brideName, admin.id, reason);
    refresh();
    return { ok: true, message: "Names corrected and recorded in the audit log" };
  });
}

export async function setStatusAction(invitationId: string, status: "ACTIVE" | "SUSPENDED"): Promise<ActionState> {
  return runAction(async () => {
    const admin = await requireAdminForAction();
    if (status !== "ACTIVE" && status !== "SUSPENDED") throw new ActionError("Invalid status.");
    await setStatus(invitationId, status, admin.id);
    refresh();
    return { ok: true, message: status === "ACTIVE" ? "Invitation activated" : "Invitation suspended" };
  });
}

export async function extendExpiryAction(invitationId: string, days: number): Promise<ActionState> {
  return runAction(async () => {
    const admin = await requireAdminForAction();
    if (!Number.isInteger(days) || days < 1 || days > 365) throw new ActionError("Invalid number of days.");
    await extendExpiry(invitationId, days, admin.id);
    refresh();
    return { ok: true, message: `Expiry extended by ${days} days` };
  });
}

export async function resetPasswordAction(userId: string): Promise<ActionState<{ username: string; password: string }>> {
  return runAction(async () => {
    const admin = await requireAdminForAction();
    const credentials = await resetClientPassword(userId, admin.id);
    refresh();
    return { ok: true, message: "New password created", data: credentials };
  });
}

export async function deleteInvitationAction(invitationId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const result = await runAction<undefined>(async () => {
    const admin = await requireAdminForAction();
    if (String(formData.get("confirm") ?? "").trim() !== "DELETE") {
      return { ok: false, error: "Type DELETE (in capital letters) to confirm.", fieldErrors: { confirm: "Type DELETE" } };
    }
    await deleteInvitation(invitationId, admin.id);
    refresh();
    return { ok: true };
  });
  if (result?.ok) redirect("/admin/invitations");
  return result;
}

export async function removeLogoAction(): Promise<ActionState> {
  return runAction(async () => {
    await requireAdminForAction();
    await saveSettings({ logoUrl: null });
    revalidatePath("/", "layout");
    return { ok: true, message: "Logo removed" };
  });
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return runAction(async () => {
    await requireAdminForAction();
    const parsed = settingsSchema.safeParse(formToObject(formData));
    if (!parsed.success) {
      return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(z.flattenError(parsed.error).fieldErrors) };
    }
    const v = parsed.data;
    const digits = normalizePhone(v.whatsappNumber);
    if (!digits) return { ok: false, error: "That WhatsApp number does not look right.", fieldErrors: { whatsappNumber: "Example: 0300 1234567" } };

    await saveSettings({
      brandName: v.brandName,
      tagline: v.tagline,
      whatsappNumber: digits,
      defaultExpiryDays: v.defaultExpiryDays,
      shareMessage: v.shareMessage,
      prices: { BASIC: v.priceBASIC, STANDARD: v.priceSTANDARD, PREMIUM: v.pricePREMIUM },
    });
    revalidatePath("/", "layout");
    return { ok: true, message: "Settings saved" };
  });
}
