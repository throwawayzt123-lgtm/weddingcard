import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Audit log" };

const dateTime = (d: Date) =>
  d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" });
const ACTIONS = ["", "NAMES_CORRECTED", "INVITATION_CREATED", "FIELD_CHANGED", "STATUS_CHANGED", "EXPIRY_EXTENDED", "PASSWORD_RESET", "INVITATION_DELETED"];

export default async function AuditPage({ searchParams }: PageProps<"/admin/audit">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 60);
  const action = typeof sp.action === "string" && ACTIONS.includes(sp.action) ? sp.action : "";

  const rows = await prisma.auditLog.findMany({
    where: {
      ...(action && { action }),
      ...(q && {
        OR: [
          { invitationSlug: { contains: q, mode: "insensitive" } },
          { oldValue: { contains: q, mode: "insensitive" } },
          { newValue: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { name: true } } },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl">Audit log</h1>
        <p className="mt-1 text-sm text-ink/60">
          A permanent record of every important admin change, including every correction to the locked couple names. Showing the latest {rows.length}.
        </p>
      </div>

      <form className="flex flex-wrap gap-2" role="search">
        <div className="relative min-w-60 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={q} placeholder="Search web address or names…" className="input pl-11" />
        </div>
        <select name="action" defaultValue={action} className="input w-auto">
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a ? a.replaceAll("_", " ").toLowerCase() : "All actions"}
            </option>
          ))}
        </select>
        <button className="btn-secondary">Filter</button>
      </form>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-ink/60">Nothing recorded yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <ul className="divide-y divide-ink/10">
            {rows.map((r) => (
              <li key={r.id} className="grid gap-1 p-4 text-sm sm:grid-cols-[11rem_1fr_9rem] sm:gap-4">
                <p className="text-xs text-ink/55 sm:pt-0.5">{dateTime(r.createdAt)}</p>
                <div>
                  <p className="font-semibold">
                    {r.action.replaceAll("_", " ").toLowerCase()}
                    {r.field && <span className="font-normal text-ink/55"> · {r.field}</span>}
                  </p>
                  {(r.oldValue || r.newValue) && (
                    <p className="mt-0.5 break-words text-ink/75">
                      {r.oldValue && <span className="text-red-700 line-through">{r.oldValue}</span>} {r.oldValue && r.newValue && "→"}{" "}
                      {r.newValue && <span className="font-medium text-green-800">{r.newValue}</span>}
                    </p>
                  )}
                  {r.invitationSlug &&
                    (r.invitationId ? (
                      <Link href={`/admin/invitations/${r.invitationId}`} className="text-xs text-maroon underline">
                        /i/{r.invitationSlug}
                      </Link>
                    ) : (
                      <span className="text-xs text-ink/50">/i/{r.invitationSlug} (deleted)</span>
                    ))}
                </div>
                <p className="text-xs text-ink/55 sm:text-right">{r.actor?.name ?? "System"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
