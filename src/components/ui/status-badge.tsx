import type { InvitationStatus } from "@prisma/client";

const STYLES: Record<InvitationStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
  DRAFT: { label: "Draft", className: "bg-gray-200 text-gray-700" },
  SUSPENDED: { label: "Suspended", className: "bg-amber-100 text-amber-800" },
  EXPIRED: { label: "Expired", className: "bg-red-100 text-red-700" },
};

export function StatusBadge({ status }: { status: InvitationStatus }) {
  const s = STYLES[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${s.className}`}>{s.label}</span>;
}

export function PaidBadge({ paid }: { paid: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${paid ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"}`}>
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}
