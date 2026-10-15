import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, ExternalLink, PlusCircle, Search } from "lucide-react";
import { PaidBadge, StatusBadge } from "@/components/ui/status-badge";
import { requireAdmin } from "@/lib/dal";
import { addDays, daysLeft, effectiveStatus } from "@/lib/invitations";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/templates/registry";

export const metadata: Metadata = { title: "Invitations" };

const PAGE_SIZE = 20;
const FILTERS = [
  { value: "", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "EXPIRING", label: "Expiring soon" },
  { value: "EXPIRED", label: "Expired" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "UNPAID", label: "Unpaid" },
];

function buildWhere(q: string, status: string): Prisma.InvitationWhereInput {
  const now = new Date();
  const and: Prisma.InvitationWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { groomName: { contains: q, mode: "insensitive" } },
        { brideName: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { owner: { name: { contains: q, mode: "insensitive" } } },
        { owner: { phone: { contains: q.replace(/\D/g, "") || "~~~" } } },
        { owner: { username: { contains: q, mode: "insensitive" } } },
      ],
    });
  }
  if (status === "ACTIVE") and.push({ status: "ACTIVE", expiresAt: { gt: now } });
  if (status === "EXPIRING") and.push({ status: "ACTIVE", expiresAt: { gt: now, lte: addDays(now, 7) } });
  if (status === "EXPIRED") and.push({ OR: [{ status: "EXPIRED" }, { status: "ACTIVE", expiresAt: { lte: now } }] });
  if (status === "SUSPENDED") and.push({ status: "SUSPENDED" });
  if (status === "UNPAID") and.push({ paymentStatus: "UNPAID" });
  return and.length ? { AND: and } : {};
}

export default async function InvitationsPage({ searchParams }: PageProps<"/admin/invitations">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 60);
  const status = typeof sp.status === "string" ? sp.status : "";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const where = buildWhere(q, status);

  const [rows, count] = await Promise.all([
    prisma.invitation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { owner: { select: { name: true, phone: true } }, _count: { select: { guests: true } } },
    }),
    prisma.invitation.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const href = (p: number) => `/admin/invitations?${new URLSearchParams({ ...(q && { q }), ...(status && { status }), page: String(p) })}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl">Invitations</h1>
          <p className="mt-1 text-sm text-ink/60">{count} {count === 1 ? "invitation" : "invitations"}{q || status ? " found" : " in total"}</p>
        </div>
        <Link href="/admin/invitations/new" className="btn-primary">
          <PlusCircle className="size-5" />
          New invitation
        </Link>
      </div>

      <form className="flex gap-2" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink/40" />
          <input name="q" defaultValue={q} placeholder="Search names, web address, customer or phone…" className="input pl-11" />
        </div>
        <button className="btn-secondary">Search</button>
      </form>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/invitations?${new URLSearchParams({ ...(q && { q }), ...(f.value && { status: f.value }) })}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${status === f.value ? "border-maroon bg-maroon text-white" : "border-ink/15 bg-white text-ink/75 hover:bg-cream"}`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-serif text-2xl text-maroon">No invitations found</p>
          <p className="mt-2 text-sm text-ink/60">{q || status ? "Try a different search or filter." : "Create your first invitation when a customer pays."}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((inv) => {
            const status = effectiveStatus(inv);
            const left = daysLeft(inv.expiresAt);
            return (
              <li key={inv.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/admin/invitations/${inv.id}`} className="font-serif text-2xl text-maroon hover:underline">
                      {inv.groomName} &amp; {inv.brideName}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink/65">
                      {inv.owner.name}
                      {inv.owner.phone && ` · +${inv.owner.phone}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={status} />
                    <PaidBadge paid={inv.paymentStatus === "PAID"} />
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
                  <div><dt className="text-xs text-ink/50">Design</dt><dd className="font-medium">{getTemplate(inv.templateKey)?.name ?? inv.templateKey}</dd></div>
                  <div><dt className="text-xs text-ink/50">Plan</dt><dd className="font-medium">{PLANS[inv.plan].label}</dd></div>
                  <div><dt className="text-xs text-ink/50">Guests</dt><dd className="font-medium">{inv._count.guests}</dd></div>
                  <div>
                    <dt className="text-xs text-ink/50">Expires</dt>
                    <dd className={`font-medium ${left <= 7 && left > 0 ? "text-amber-700" : ""}`}>
                      {inv.expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}
                      <span className="text-xs text-ink/50"> {left > 0 ? `(${left}d)` : ""}</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/admin/invitations/${inv.id}`} className="btn-secondary !min-h-10 !px-4 !text-sm">Manage</Link>
                  <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary !min-h-10 !px-4 !text-sm">
                    <ExternalLink className="size-4" />
                    Open invitation
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav className="flex items-center justify-between pt-2" aria-label="Pages">
          <Link href={href(page - 1)} aria-disabled={page <= 1} className={`btn-secondary !min-h-10 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}>
            <ChevronLeft className="size-4" /> Previous
          </Link>
          <span className="text-sm text-ink/60">Page {page} of {pages}</span>
          <Link href={href(page + 1)} aria-disabled={page >= pages} className={`btn-secondary !min-h-10 ${page >= pages ? "pointer-events-none opacity-40" : ""}`}>
            Next <ChevronRight className="size-4" />
          </Link>
        </nav>
      )}
    </div>
  );
}
