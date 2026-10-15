"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";
import { signOut } from "@/auth";
import { ActionError, firstFieldErrors, runAction, type ActionState } from "@/lib/action-state";
import { requireAdminForAction, requireUserForAction } from "@/lib/dal";
import { guardInvitation, formToObject, INVITATION_COOKIE } from "@/lib/portal";
import { deleteEvent, moveEvent, saveEvent, saveFamily, updateDetails } from "@/lib/portal-ops";
import { passwordSchema } from "@/lib/portal-schemas";
import { prisma } from "@/lib/prisma";
import { getTemplate, getTrack } from "@/templates/registry";
import {
  deletePhoto, finalizeCloudinaryUpload, movePhoto, prepareUpload, removeCouplePhoto, removeCustomMusic, type PrepareResult, type UploadKind, type UploadMeta,
} from "@/lib/uploads";

// ---------------------------------------------------------------
// Customer actions. The FIRST thing each one does is guardInvitation():
// it re-loads the invitation from the database and refuses unless the
// logged-in user owns it (admins excepted) and it is still editable.
// The invitation id sent by the browser is never trusted on its own.
// ---------------------------------------------------------------

function refresh() {
  revalidatePath("/portal", "layout");
}

/** Turns validation errors into friendly messages next to each field. */
function validationError(error: ZodError): ActionState {
  const flat = z.flattenError(error);
  const unknownKeys = error.issues.some((i) => i.code === "unrecognized_keys");
  if (unknownKeys) return { ok: false, error: "That change is not allowed." };
  return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: firstFieldErrors(flat.fieldErrors) };
}

async function withValidation(fn: () => Promise<ActionState>): Promise<ActionState> {
  return runAction(async () => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof ZodError) return validationError(error);
      throw error;
    }
  });
}

// ----- Which invitation is open (only matters if a customer has several) -----

export async function selectInvitationAction(invitationId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId, { allowReadOnly: true });
    (await cookies()).set(INVITATION_COOKIE, inv.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
    refresh();
    return { ok: true };
  });
}

/** Admin only: open a customer's portal to help them. */
export async function openCustomerPortalAction(invitationId: string): Promise<ActionState> {
  return runAction(async () => {
    await requireAdminForAction();
    const inv = await prisma.invitation.findUnique({ where: { id: invitationId }, select: { id: true } });
    if (!inv) throw new ActionError("Invitation not found.");
    (await cookies()).set(INVITATION_COOKIE, inv.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
    return { ok: true };
  });
}

// ----- Details ---------------------------------------------------------------

export async function updateDetailsAction(invitationId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return withValidation(async () => {
    const { inv } = await guardInvitation(invitationId);
    // Anything other than the whitelisted fields makes the schema reject the request.
    await updateDetails(inv, formToObject(formData));
    refresh();
    return { ok: true, message: "Saved" };
  });
}

// ----- Events ----------------------------------------------------------------

export async function saveEventAction(invitationId: string, eventId: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  return withValidation(async () => {
    const { inv, plan } = await guardInvitation(invitationId);
    await saveEvent(inv, plan, eventId, formToObject(formData));
    refresh();
    return { ok: true, message: eventId ? "Event updated" : "Event added" };
  });
}

export async function deleteEventAction(invitationId: string, eventId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await deleteEvent(inv, eventId);
    refresh();
    return { ok: true, message: "Event deleted" };
  });
}

export async function moveEventAction(invitationId: string, eventId: string, direction: "up" | "down"): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    if (direction !== "up" && direction !== "down") throw new ActionError("Invalid direction.");
    await moveEvent(inv, eventId, direction);
    refresh();
    return { ok: true };
  });
}

// ----- Family ----------------------------------------------------------------

export async function saveFamilyAction(invitationId: string, payload: unknown): Promise<ActionState> {
  return withValidation(async () => {
    const { inv } = await guardInvitation(invitationId);
    await saveFamily(inv, payload);
    refresh();
    return { ok: true, message: "Family details saved" };
  });
}

// ----- Photos, couple photo, music files -------------------------------------

export async function prepareUploadAction(invitationId: string, kind: UploadKind, meta: UploadMeta): Promise<ActionState<PrepareResult>> {
  return runAction<PrepareResult>(async () => {
    if (!["photo", "couple", "music", "logo"].includes(kind)) throw new ActionError("Invalid upload.");
    let inv = null;
    if (kind === "logo") await requireAdminForAction();
    else inv = (await guardInvitation(invitationId)).inv;
    const data = await prepareUpload(inv, kind, meta);
    return { ok: true, data };
  });
}

export async function finalizeUploadAction(invitationId: string, kind: UploadKind, file: { url: string; publicId: string }): Promise<ActionState> {
  return runAction(async () => {
    if (!["photo", "couple", "music", "logo"].includes(kind)) throw new ActionError("Invalid upload.");
    let inv = null;
    if (kind === "logo") await requireAdminForAction();
    else inv = (await guardInvitation(invitationId)).inv;
    await finalizeCloudinaryUpload(inv, kind, file);
    refresh();
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Uploaded" };
  });
}

export async function deletePhotoAction(invitationId: string, photoId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await deletePhoto(inv, photoId);
    refresh();
    return { ok: true, message: "Photo deleted" };
  });
}

export async function movePhotoAction(invitationId: string, photoId: string, direction: "left" | "right"): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await movePhoto(inv, photoId, direction);
    refresh();
    return { ok: true };
  });
}

export async function removeCouplePhotoAction(invitationId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await removeCouplePhoto(inv);
    refresh();
    return { ok: true, message: "Photo removed" };
  });
}

// ----- Music -----------------------------------------------------------------

export async function saveMusicAction(invitationId: string, input: { musicKey: string | null; musicEnabled: boolean }): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    const template = getTemplate(inv.templateKey);
    // Only tracks offered for this design are accepted; anything else falls back to the design default.
    const key = input.musicKey && template?.tracks.includes(input.musicKey) && getTrack(input.musicKey) ? input.musicKey : (template?.defaultTrack ?? null);
    await prisma.invitation.update({ where: { id: inv.id }, data: { musicEnabled: input.musicEnabled === true, musicKey: key } });
    refresh();
    return { ok: true, message: "Music saved" };
  });
}

export async function removeCustomMusicAction(invitationId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await removeCustomMusic(inv);
    refresh();
    return { ok: true, message: "Your music was removed" };
  });
}

// ----- Account ---------------------------------------------------------------

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  return withValidation(async () => {
    const user = await requireUserForAction();
    const parsed = passwordSchema.parse(formToObject(formData));

    const row = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
    if (!row || !(await bcrypt.compare(parsed.currentPassword, row.passwordHash))) {
      return { ok: false, error: "Your current password is not correct.", fieldErrors: { currentPassword: "Not correct" } };
    }
    await prisma.user.update({
      where: { id: user.id },
      // New hash + bumped version: every device (including this one) must log in again.
      data: { passwordHash: await bcrypt.hash(parsed.newPassword, 12), sessionVersion: { increment: 1 } },
    });
    await signOut({ redirectTo: "/login?changed=1" });
    return { ok: true };
  });
}
