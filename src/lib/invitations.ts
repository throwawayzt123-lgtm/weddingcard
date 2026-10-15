import "server-only";
import bcrypt from "bcryptjs";
import type { InvitationStatus, Plan, PaymentStatus, Prisma } from "@prisma/client";
import { logAudit } from "@/lib/audit";
import { generatePassword, generateUsername } from "@/lib/credentials";
import { normalizePhone } from "@/lib/phone";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { generateUniqueSlug, normalizeNamesKey } from "@/lib/slug";
import type { CreateInvitationInput } from "@/lib/admin-schemas";
import { ActionError } from "@/lib/action-state";

// ---------------------------------------------------------------
// Business rules for invitations that only the ADMIN can trigger.
// Everything that changes the LOCKED fields (couple names, slug, design,
// plan, expiry, status) lives here or in actions that call here.
// ---------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;

/** "2026-12-15" → Date at midnight UTC (how Postgres DATE columns are read). */
export function ymdToDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00.000Z`);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** What the admin sees: an ACTIVE invitation past its expiry date counts as EXPIRED. */
export function effectiveStatus(inv: { status: InvitationStatus; expiresAt: Date }): InvitationStatus {
  return inv.status === "ACTIVE" && inv.expiresAt.getTime() <= Date.now() ? "EXPIRED" : inv.status;
}

export function daysLeft(expiresAt: Date): number {
  return Math.ceil((expiresAt.getTime() - Date.now()) / DAY_MS);
}

// ---------------------------------------------------------------
// Duplicate check
// ---------------------------------------------------------------

export async function findDuplicateCouples(groomName: string, brideName: string, excludeId?: string) {
  return prisma.invitation.findMany({
    where: { namesNormalizedKey: normalizeNamesKey(groomName, brideName), ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true, slug: true, groomName: true, brideName: true, weddingDate: true, owner: { select: { name: true } } },
  });
}

// ---------------------------------------------------------------
// Create (the "sale")
// ---------------------------------------------------------------

export type CreateResult =
  | { kind: "duplicate"; duplicates: Awaited<ReturnType<typeof findDuplicateCouples>> }
  | {
      kind: "created";
      invitationId: string;
      slug: string;
      ownerName: string;
      ownerPhone: string | null;
      /** Only present when a NEW client account was made. Shown once; we store only a hash. */
      credentials: { username: string; password: string } | null;
    };

export async function createInvitation(input: CreateInvitationInput, actorId: string): Promise<CreateResult> {
  const duplicates = await findDuplicateCouples(input.groomName, input.brideName);
  if (duplicates.length > 0 && !input.confirmDuplicate) return { kind: "duplicate", duplicates };

  const settings = await getSettings();
  const weddingDate = ymdToDate(input.weddingDate);
  const customExpiry = input.expiresAt ? ymdToDate(input.expiresAt) : null;
  const expiresAt = customExpiry ?? addDays(weddingDate, settings.defaultExpiryDays);

  let phone: string | null = null;
  if (input.customerMode === "new") {
    phone = normalizePhone(input.customerPhone);
    if (!phone) throw new ActionError("That WhatsApp number does not look right. Example: 0321 4317574");
    if (input.customerEmail && (await prisma.user.findUnique({ where: { email: input.customerEmail }, select: { id: true } }))) {
      throw new ActionError("A user with that email already exists. Choose “Existing customer” instead.");
    }
  }

  const slug = await generateUniqueSlug(input.groomName, input.brideName, weddingDate.getUTCFullYear(), async (s) =>
    !!(await prisma.invitation.findUnique({ where: { slug: s }, select: { id: true } })),
  );

  let credentials: { username: string; password: string } | null = null;
  let ownerId: string;
  let ownerName: string;
  let ownerPhone: string | null;

  if (input.customerMode === "existing") {
    const owner = await prisma.user.findFirst({ where: { id: input.existingOwnerId, role: "CLIENT" } });
    if (!owner) throw new ActionError("That customer was not found.");
    ownerId = owner.id;
    ownerName = owner.name;
    ownerPhone = owner.phone;
  } else {
    const username = await generateUsername(input.groomName, input.brideName, async (u) => !!(await prisma.user.findUnique({ where: { username: u }, select: { id: true } })));
    const password = generatePassword();
    credentials = { username, password };
    ownerName = input.customerName!;
    ownerPhone = phone;
    ownerId = ""; // set inside the transaction below
  }

  const invitation = await prisma.$transaction(async (tx) => {
    if (credentials) {
      const user = await tx.user.create({
        data: {
          name: ownerName,
          username: credentials.username,
          email: input.customerEmail ?? null,
          phone,
          passwordHash: await bcrypt.hash(credentials.password, 12),
          role: "CLIENT",
        },
      });
      ownerId = user.id;
    }

    const created = await tx.invitation.create({
      data: {
        slug,
        templateKey: input.templateKey,
        groomName: input.groomName,
        brideName: input.brideName,
        namesNormalizedKey: normalizeNamesKey(input.groomName, input.brideName),
        weddingDate,
        dateLocked: input.dateLocked,
        plan: input.plan as Plan,
        status: "ACTIVE",
        expiresAt,
        expiryAuto: !customExpiry,
        ownerId,
        paymentStatus: input.paymentStatus as PaymentStatus,
        paymentAmount: input.paymentAmount ?? null,
        paymentMethod: input.paymentMethod ?? null,
        paymentRef: input.paymentRef ?? null,
        // Empty family sides so the customer can start typing straight away.
        familySides: { create: [{ side: "GROOM" }, { side: "BRIDE" }] },
      },
    });

    await logAudit(
      { actorId, invitationId: created.id, invitationSlug: slug, action: "INVITATION_CREATED", field: "names", newValue: `${input.groomName} & ${input.brideName}` },
      tx,
    );
    return created;
  });

  return { kind: "created", invitationId: invitation.id, slug, ownerName, ownerPhone, credentials };
}

// ---------------------------------------------------------------
// Correct the LOCKED names (admin only, always audited)
// ---------------------------------------------------------------

export async function correctNames(invitationId: string, groomName: string, brideName: string, actorId: string, reason?: string) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!inv) throw new ActionError("Invitation not found.");
  if (inv.groomName === groomName && inv.brideName === brideName) throw new ActionError("Those are already the current names.");

  await prisma.$transaction(async (tx) => {
    await tx.invitation.update({
      where: { id: invitationId },
      // The web address (slug) is intentionally NOT changed: links already shared on WhatsApp keep working.
      data: { groomName, brideName, namesNormalizedKey: normalizeNamesKey(groomName, brideName) },
    });
    if (inv.groomName !== groomName) {
      await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "NAMES_CORRECTED", field: "groomName", oldValue: inv.groomName, newValue: groomName }, tx);
    }
    if (inv.brideName !== brideName) {
      await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "NAMES_CORRECTED", field: "brideName", oldValue: inv.brideName, newValue: brideName }, tx);
    }
    if (reason) {
      await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "NAMES_CORRECTION_REASON", field: "reason", newValue: reason }, tx);
    }
  });
}

// ---------------------------------------------------------------
// Other admin-only changes, each recorded in the audit log
// ---------------------------------------------------------------

type AdminFieldChanges = {
  templateKey: string;
  plan: Plan;
  status: InvitationStatus;
  weddingDate: Date;
  dateLocked: boolean;
  expiresAt: Date;
  expiryAuto: boolean;
  showBadge: boolean;
  paymentStatus: PaymentStatus;
  paymentAmount: number | null;
  paymentMethod: string | null;
  paymentRef: string | null;
};

export async function updateAdminFields(invitationId: string, next: AdminFieldChanges, actorId: string) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId } });
  if (!inv) throw new ActionError("Invitation not found.");

  const keys = Object.keys(next) as (keyof AdminFieldChanges)[];
  const same = (a: unknown, b: unknown) => (a instanceof Date && b instanceof Date ? a.getTime() === b.getTime() : a === b);
  const changed = keys.filter((k) => !same(inv[k], next[k]));
  if (changed.length === 0) return changed;

  await prisma.$transaction(async (tx) => {
    await tx.invitation.update({ where: { id: invitationId }, data: next as Prisma.InvitationUpdateInput });
    for (const field of changed) {
      await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "FIELD_CHANGED", field, oldValue: inv[field] as never, newValue: next[field] as never }, tx);
    }
  });
  return changed;
}

export async function setStatus(invitationId: string, status: InvitationStatus, actorId: string) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId }, select: { status: true, slug: true } });
  if (!inv) throw new ActionError("Invitation not found.");
  if (inv.status === status) return;
  await prisma.$transaction(async (tx) => {
    await tx.invitation.update({ where: { id: invitationId }, data: { status } });
    await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "STATUS_CHANGED", field: "status", oldValue: inv.status, newValue: status }, tx);
  });
}

/** Moves the expiry date forward (from today if it has already passed). The date then stays custom. */
export async function extendExpiry(invitationId: string, days: number, actorId: string) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId }, select: { expiresAt: true, slug: true, status: true } });
  if (!inv) throw new ActionError("Invitation not found.");
  const from = Math.max(inv.expiresAt.getTime(), Date.now());
  const expiresAt = addDays(new Date(from), days);
  await prisma.$transaction(async (tx) => {
    await tx.invitation.update({ where: { id: invitationId }, data: { expiresAt, expiryAuto: false, status: inv.status === "EXPIRED" ? "ACTIVE" : inv.status } });
    await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "EXPIRY_EXTENDED", field: "expiresAt", oldValue: inv.expiresAt, newValue: expiresAt }, tx);
  });
  return expiresAt;
}

/**
 * For invitations on automatic expiry: expiry = (last event, or the wedding
 * date) + the default number of days. Call after events are added or edited.
 */
export async function recomputeAutoExpiry(invitationId: string): Promise<void> {
  const inv = await prisma.invitation.findUnique({
    where: { id: invitationId },
    select: { expiryAuto: true, weddingDate: true, events: { select: { date: true } } },
  });
  if (!inv || !inv.expiryAuto) return;
  const settings = await getSettings();
  const last = Math.max(inv.weddingDate.getTime(), ...inv.events.map((e) => e.date.getTime()));
  await prisma.invitation.update({ where: { id: invitationId }, data: { expiresAt: addDays(new Date(last), settings.defaultExpiryDays) } });
}

export async function resetClientPassword(userId: string, actorId: string): Promise<{ username: string; password: string }> {
  const user = await prisma.user.findFirst({ where: { id: userId, role: "CLIENT" } });
  if (!user) throw new ActionError("Customer not found.");
  const password = generatePassword();
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      // Bumping sessionVersion logs the customer out everywhere straight away.
      data: { passwordHash: await bcrypt.hash(password, 12), sessionVersion: { increment: 1 } },
    });
    await logAudit({ actorId, action: "PASSWORD_RESET", field: "user", newValue: user.username }, tx);
  });
  return { username: user.username, password };
}

export async function deleteInvitation(invitationId: string, actorId: string) {
  const inv = await prisma.invitation.findUnique({ where: { id: invitationId }, select: { slug: true, groomName: true, brideName: true } });
  if (!inv) throw new ActionError("Invitation not found.");
  await prisma.$transaction(async (tx) => {
    // Audit rows survive deletion (the slug is saved on the row itself).
    await logAudit({ actorId, invitationId, invitationSlug: inv.slug, action: "INVITATION_DELETED", field: "names", oldValue: `${inv.groomName} & ${inv.brideName}` }, tx);
    await tx.invitation.delete({ where: { id: invitationId } });
  });
}
