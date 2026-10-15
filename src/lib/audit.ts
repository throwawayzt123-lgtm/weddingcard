import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type AuditEntry = {
  actorId: string | null;
  invitationId?: string | null;
  invitationSlug?: string | null;
  /** e.g. "NAMES_CORRECTED", "PLAN_CHANGED" */
  action: string;
  field?: string;
  oldValue?: string | number | boolean | Date | null;
  newValue?: string | number | boolean | Date | null;
};

function asText(v: AuditEntry["oldValue"]): string | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/**
 * Records an admin change. Pass `tx` to write inside the same database
 * transaction as the change itself, so the two always succeed or fail together.
 */
export async function logAudit(entry: AuditEntry, tx: Prisma.TransactionClient | typeof prisma = prisma): Promise<void> {
  await tx.auditLog.create({
    data: {
      actorId: entry.actorId,
      invitationId: entry.invitationId ?? null,
      invitationSlug: entry.invitationSlug ?? null,
      action: entry.action,
      field: entry.field ?? null,
      oldValue: asText(entry.oldValue),
      newValue: asText(entry.newValue),
    },
  });
}
