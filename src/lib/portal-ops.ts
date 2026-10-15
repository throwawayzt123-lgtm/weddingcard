import "server-only";
import type { Invitation } from "@prisma/client";
import { ActionError } from "@/lib/action-state";
import { recomputeAutoExpiry, ymdToDate } from "@/lib/invitations";
import { canAddMore, type PlanConfig } from "@/lib/plans";
import { detailsSchema, EVENT_LABEL, eventSchema, familySchema } from "@/lib/portal-schemas";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------
// What a CUSTOMER can change. Notice what is NOT here: couple names, slug,
// design, plan, expiry and status. Each function below writes an explicit,
// short list of columns — it never spreads the request into the database —
// so even a hand-crafted request cannot touch the locked fields.
// ---------------------------------------------------------------

function rows(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/** Hashtag, welcome message, verse and (only if the admin has not locked it) the wedding date. */
export async function updateDetails(inv: Invitation, input: unknown): Promise<void> {
  const data = detailsSchema.parse(input); // strict: unknown fields such as groomName are rejected

  let weddingDate: Date | undefined;
  if (data.weddingDate) {
    const requested = ymdToDate(data.weddingDate);
    if (requested.getTime() !== inv.weddingDate.getTime()) {
      if (inv.dateLocked) throw new ActionError("The wedding date is locked. Please contact us on WhatsApp to change it.");
      weddingDate = requested;
    }
  }

  await prisma.invitation.update({
    where: { id: inv.id },
    data: {
      hashtag: data.hashtag || null,
      welcomeMessage: data.welcomeMessage || null,
      verseText: data.verseText || null,
      ...(weddingDate && { weddingDate }),
    },
  });
  if (weddingDate) await recomputeAutoExpiry(inv.id);
}

/** Create (eventId = null) or edit an event, respecting the plan's event limit. */
export async function saveEvent(inv: Invitation, plan: PlanConfig, eventId: string | null, input: unknown) {
  const data = eventSchema.parse(input);
  const fields = {
    type: data.type,
    title: data.title || EVENT_LABEL[data.type],
    date: ymdToDate(data.date),
    startTime: data.startTime ?? null,
    endTime: data.endTime ?? null,
    venueName: data.venueName || null,
    address: data.address || null,
    mapUrl: data.mapUrl ?? null,
    dressCode: data.dressCode || null,
    notes: data.notes || null,
  };

  if (eventId) {
    const existing = await prisma.event.findFirst({ where: { id: eventId, invitationId: inv.id }, select: { id: true } });
    if (!existing) throw new ActionError("That event was not found.");
    await prisma.event.update({ where: { id: eventId }, data: fields });
  } else {
    const [count, last] = await Promise.all([
      prisma.event.count({ where: { invitationId: inv.id } }),
      prisma.event.findFirst({ where: { invitationId: inv.id }, orderBy: { order: "desc" }, select: { order: true } }),
    ]);
    if (!canAddMore(plan.maxEvents, count)) {
      throw new ActionError(`Your plan includes ${rows(plan.maxEvents ?? 0, "event", "events")}. To add more, message us on WhatsApp and we will upgrade you.`);
    }
    await prisma.event.create({ data: { ...fields, invitationId: inv.id, order: (last?.order ?? -1) + 1 } });
  }
  await recomputeAutoExpiry(inv.id);
}

export async function deleteEvent(inv: Invitation, eventId: string) {
  const result = await prisma.event.deleteMany({ where: { id: eventId, invitationId: inv.id } });
  if (result.count === 0) throw new ActionError("That event was not found.");
  await recomputeAutoExpiry(inv.id);
}

/** Swaps an event with its neighbour on the same day (events are listed by date, then this order). */
export async function moveEvent(inv: Invitation, eventId: string, direction: "up" | "down") {
  const event = await prisma.event.findFirst({ where: { id: eventId, invitationId: inv.id } });
  if (!event) throw new ActionError("That event was not found.");
  const sameDay = await prisma.event.findMany({ where: { invitationId: inv.id, date: event.date }, orderBy: { order: "asc" } });
  const i = sameDay.findIndex((e) => e.id === eventId);
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= sameDay.length) return;
  await prisma.$transaction([
    prisma.event.update({ where: { id: sameDay[i].id }, data: { order: sameDay[j].order } }),
    prisma.event.update({ where: { id: sameDay[j].id }, data: { order: sameDay[i].order } }),
  ]);
}

/** Replaces both families (parents lines and members, in the order given). */
export async function saveFamily(inv: Invitation, input: unknown) {
  const data = familySchema.parse(input);
  await prisma.$transaction(async (tx) => {
    for (const [side, value] of [["GROOM", data.groom], ["BRIDE", data.bride]] as const) {
      const familySide = await tx.familySide.upsert({
        where: { invitationId_side: { invitationId: inv.id, side } },
        create: { invitationId: inv.id, side, parentsLine: value.parentsLine || null },
        update: { parentsLine: value.parentsLine || null },
      });
      await tx.familyMember.deleteMany({ where: { familySideId: familySide.id } });
      if (value.members.length) {
        await tx.familyMember.createMany({
          data: value.members.map((m, order) => ({ familySideId: familySide.id, name: m.name, phone: m.phone, showPhone: m.showPhone && !!m.phone, order })),
        });
      }
    }
  });
}
