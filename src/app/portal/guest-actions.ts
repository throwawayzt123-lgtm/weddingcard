"use server";

import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";
import { ActionError, firstFieldErrors, runAction, type ActionState } from "@/lib/action-state";
import { addGuest, bulkAddGuests, deleteGuest, updateGuest, type BulkResult } from "@/lib/guests";
import { guardInvitation } from "@/lib/portal";

function refresh() {
  revalidatePath("/portal", "layout");
}

async function validated<T>(fn: () => Promise<ActionState<T>>): Promise<ActionState<T>> {
  return runAction<T>(async () => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof ZodError) {
        return { ok: false, error: "Please check the highlighted fields.", fieldErrors: firstFieldErrors(z.flattenError(error).fieldErrors) };
      }
      throw error;
    }
  });
}

export async function addGuestAction(invitationId: string, input: { displayName: string; phone: string; eventIds: string[] }): Promise<ActionState> {
  return validated(async () => {
    const { inv, plan } = await guardInvitation(invitationId);
    await addGuest(inv, plan, input);
    refresh();
    return { ok: true, message: "Guest added" };
  });
}

export async function updateGuestAction(invitationId: string, guestId: string, input: { displayName: string; phone: string; eventIds: string[] }): Promise<ActionState> {
  return validated(async () => {
    const { inv } = await guardInvitation(invitationId);
    await updateGuest(inv, guestId, input);
    refresh();
    return { ok: true, message: "Guest updated" };
  });
}

export async function deleteGuestAction(invitationId: string, guestId: string): Promise<ActionState> {
  return runAction(async () => {
    const { inv } = await guardInvitation(invitationId);
    await deleteGuest(inv, guestId);
    refresh();
    return { ok: true, message: "Guest deleted" };
  });
}

export async function bulkAddGuestsAction(invitationId: string, text: string, defaultEventIds: string[]): Promise<ActionState<BulkResult>> {
  return runAction<BulkResult>(async () => {
    const { inv, plan } = await guardInvitation(invitationId);
    if (typeof text !== "string" || text.length > 60_000) throw new ActionError("That list is too long.");
    if (!Array.isArray(defaultEventIds)) throw new ActionError("Invalid request.");
    const result = await bulkAddGuests(inv, plan, text, defaultEventIds.map(String));
    refresh();
    return { ok: true, data: result, message: result.added ? `${result.added} guests added` : undefined };
  });
}
