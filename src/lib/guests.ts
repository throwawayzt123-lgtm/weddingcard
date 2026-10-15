import "server-only";
import type { Invitation } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { stripTags } from "@/lib/admin-schemas";
import { ActionError } from "@/lib/action-state";
import { generateGuestCode } from "@/lib/codes";
import { normalizePhone } from "@/lib/phone";
import { canAddMore, type PlanConfig } from "@/lib/plans";
import { prisma } from "@/lib/prisma";

export const MAX_BULK_ROWS = 300;

export const guestSchema = z.strictObject({
  displayName: z.string().transform(stripTags).pipe(z.string().min(1, "Enter the guest's name").max(80, "Maximum 80 characters")),
  phone: z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(30).optional()),
  eventIds: z.array(z.string().max(50)).max(20),
});

function limitMessage(plan: PlanConfig) {
  return `Your plan includes ${plan.maxGuests} guest links and you have used them all. Message us on WhatsApp to upgrade.`;
}

/** Creates a guest with a fresh, random code. Retries in the (very unlikely) case of a code clash. */
async function createGuest(invitationId: string, data: { displayName: string; phone: string | null; eventIds: string[] }) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      return await prisma.guest.create({
        data: {
          invitationId,
          displayName: data.displayName,
          phone: data.phone,
          code: generateGuestCode(),
          guestEvents: { create: data.eventIds.map((eventId) => ({ eventId })) },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue; // code already used
      throw error;
    }
  }
  throw new ActionError("Could not create a link. Please try again.");
}

/** Only events that really belong to this invitation can be assigned. */
async function validEventIds(invitationId: string, requested: string[]): Promise<string[]> {
  if (requested.length === 0) return [];
  const found = await prisma.event.findMany({ where: { invitationId, id: { in: requested } }, select: { id: true } });
  return found.map((e) => e.id);
}

export async function addGuest(inv: Invitation, plan: PlanConfig, input: unknown) {
  const data = guestSchema.parse(input);
  const count = await prisma.guest.count({ where: { invitationId: inv.id } });
  if (!canAddMore(plan.maxGuests, count)) throw new ActionError(limitMessage(plan));

  const phone = data.phone ? normalizePhone(data.phone) : null;
  if (data.phone && !phone) throw new ActionError("That phone number does not look right. Example: 0321 4317574");
  const eventIds = await validEventIds(inv.id, data.eventIds);
  await createGuest(inv.id, { displayName: data.displayName, phone, eventIds });
}

export async function updateGuest(inv: Invitation, guestId: string, input: unknown) {
  const data = guestSchema.parse(input);
  const guest = await prisma.guest.findFirst({ where: { id: guestId, invitationId: inv.id }, select: { id: true } });
  if (!guest) throw new ActionError("That guest was not found.");
  const phone = data.phone ? normalizePhone(data.phone) : null;
  if (data.phone && !phone) throw new ActionError("That phone number does not look right. Example: 0321 4317574");
  const eventIds = await validEventIds(inv.id, data.eventIds);

  await prisma.$transaction([
    prisma.guest.update({ where: { id: guestId }, data: { displayName: data.displayName, phone } }),
    prisma.guestEvent.deleteMany({ where: { guestId, eventId: { notIn: eventIds } } }),
    prisma.guestEvent.createMany({ data: eventIds.map((eventId) => ({ guestId, eventId })), skipDuplicates: true }),
    // If a guest is no longer invited to an event, their old reply for it is removed too.
    prisma.rsvp.deleteMany({ where: { guestId, eventId: { notIn: eventIds } } }),
  ]);
}

export async function deleteGuest(inv: Invitation, guestId: string) {
  const result = await prisma.guest.deleteMany({ where: { id: guestId, invitationId: inv.id } });
  if (result.count === 0) throw new ActionError("That guest was not found.");
}

// ---------------------------------------------------------------
// Bulk import (pasted text or a CSV file): name, phone, events
// ---------------------------------------------------------------

/** Splits one line into cells. Understands "quoted, values" and comma / tab / semicolon separators. */
export function splitLine(line: string): string[] {
  const delimiter = line.includes("\t") ? "\t" : line.includes(",") ? "," : line.includes(";") ? ";" : ",";
  const cells: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === delimiter && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else cell += ch;
  }
  cells.push(cell.trim());
  return cells;
}

export type BulkResult = { added: number; skipped: number; notes: string[] };

export async function bulkAddGuests(inv: Invitation, plan: PlanConfig, text: string, defaultEventIds: string[]): Promise<BulkResult> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new ActionError("Paste at least one guest.");
  if (lines.length > MAX_BULK_ROWS + 1) throw new ActionError(`Please import at most ${MAX_BULK_ROWS} guests at a time.`);

  const [events, existing] = await Promise.all([
    prisma.event.findMany({ where: { invitationId: inv.id }, select: { id: true, title: true, type: true } }),
    prisma.guest.findMany({ where: { invitationId: inv.id }, select: { displayName: true, phone: true } }),
  ]);
  const allIds = events.map((e) => e.id);
  const fallback = (await validEventIds(inv.id, defaultEventIds)).length ? await validEventIds(inv.id, defaultEventIds) : allIds;
  const known = new Set(existing.map((g) => `${g.displayName.toLowerCase()}|${g.phone ?? ""}`));

  let count = existing.length;
  const result: BulkResult = { added: 0, skipped: 0, notes: [] };

  // Skip a header row such as "name, phone, events"
  const first = splitLine(lines[0])[0]?.toLowerCase();
  const rows = first === "name" || first === "guest" || first === "guest name" ? lines.slice(1) : lines;

  for (const [i, line] of rows.entries()) {
    const [rawName = "", rawPhone = "", rawEvents = ""] = splitLine(line);
    const displayName = stripTags(rawName).slice(0, 80);
    const row = i + 1;
    if (!displayName) { result.skipped++; result.notes.push(`Row ${row}: no name`); continue; }
    if (!canAddMore(plan.maxGuests, count)) {
      result.skipped += rows.length - i;
      result.notes.push(limitMessage(plan));
      break;
    }

    let phone: string | null = null;
    if (rawPhone) {
      phone = normalizePhone(rawPhone);
      if (!phone) result.notes.push(`Row ${row} (${displayName}): phone number not recognised, added without a phone`);
    }

    let eventIds = fallback;
    const wanted = rawEvents.trim().toLowerCase();
    if (wanted && wanted !== "all") {
      const parts = wanted.split(/[|/+]/).map((p) => p.trim()).filter(Boolean);
      const matched = events.filter((e) => parts.some((p) => e.title.toLowerCase() === p || e.type.toLowerCase() === p));
      if (matched.length === 0) result.notes.push(`Row ${row} (${displayName}): events “${rawEvents}” not recognised, invited to the default events`);
      else eventIds = matched.map((e) => e.id);
    }

    const key = `${displayName.toLowerCase()}|${phone ?? ""}`;
    if (known.has(key)) { result.skipped++; result.notes.push(`Row ${row} (${displayName}): already in your list`); continue; }

    await createGuest(inv.id, { displayName, phone, eventIds });
    known.add(key);
    count++;
    result.added++;
  }
  return result;
}
