import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { GuestsManager, type GuestRow } from "@/components/portal/guests-manager";
import { requirePortalInvitation } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { getSettings, waLink } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Guests" };
const PAGE_SIZE = 40;

export default async function GuestsPage({ searchParams }: PageProps<"/portal/guests">) {
  const { invitation: inv, plan, edit } = await requirePortalInvitation();
  const settings = await getSettings();
  const sp = await searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim().slice(0, 60);
  const filter = typeof sp.filter === "string" ? sp.filter : "";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);

  const where: Prisma.GuestWhereInput = {
    invitationId: inv.id,
    ...(q && { OR: [{ displayName: { contains: q, mode: "insensitive" } }, { phone: { contains: q.replace(/\D/g, "") || "~~~" } }] }),
    ...(filter === "opened" && { openCount: { gt: 0 } }),
    ...(filter === "unopened" && { openCount: 0 }),
    ...(filter === "replied" && { rsvps: { some: {} } }),
    ...(filter === "noreply" && { rsvps: { none: {} } }),
  };

  const [rows, count, total, events] = await Promise.all([
    prisma.guest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { guestEvents: { select: { eventId: true } }, rsvps: { select: { response: true } } },
    }),
    prisma.guest.count({ where }),
    prisma.guest.count({ where: { invitationId: inv.id } }),
    prisma.event.findMany({ where: { invitationId: inv.id }, orderBy: [{ date: "asc" }, { order: "asc" }], select: { id: true, title: true } }),
  ]);

  const guests: GuestRow[] = rows.map((g) => ({
    id: g.id, displayName: g.displayName, phone: g.phone, code: g.code, openCount: g.openCount,
    eventIds: g.guestEvents.map((e) => e.eventId),
    replies: { yes: g.rsvps.filter((r) => r.response === "YES").length, no: g.rsvps.filter((r) => r.response === "NO").length, maybe: g.rsvps.filter((r) => r.response === "MAYBE").length },
  }));

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const href = (p: number) => `/portal/guests?${new URLSearchParams({ ...(q && { q }), ...(filter && { filter }), page: String(p) })}`;
  const FILTERS = [
    { v: "", l: "All" }, { v: "unopened", l: "Not opened" }, { v: "opened", l: "Opened" },
    ...(plan.rsvp ? [{ v: "replied", l: "Replied" }, { v: "noreply", l: "No reply" }] : []),
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Guests</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Give every guest their own link. It greets them by name and shows only the events they are invited to.</p>

      {total > 0 && (
        <div className="mb-5 space-y-3">
          <form className="flex gap-2" role="search">
            {filter && <input type="hidden" name="filter" value={filter} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink/40" />
              <input name="q" defaultValue={q} placeholder="Search by name or phone…" className="input pl-11" />
            </div>
            <button className="btn-secondary">Search</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link key={f.v} href={`/portal/guests?${new URLSearchParams({ ...(q && { q }), ...(f.v && { filter: f.v }) })}`} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${filter === f.v ? "border-maroon bg-maroon text-white" : "border-ink/15 bg-white text-ink/75 hover:bg-cream"}`}>{f.l}</Link>
            ))}
          </div>
        </div>
      )}

      <GuestsManager
        invitationId={inv.id}
        slug={inv.slug}
        siteUrl={SITE.url}
        couple={`${inv.groomName} & ${inv.brideName}`}
        guests={guests}
        events={events}
        defaultMessage={settings.shareMessage}
        usage={{ used: total, limit: plan.maxGuests }}
        disabled={!edit.editable}
        upgradeUrl={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}) to add more guests.`)}
        rsvpEnabled={plan.rsvp}
      />

      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-between" aria-label="Pages">
          <Link href={href(page - 1)} aria-disabled={page <= 1} className={`btn-secondary !min-h-10 ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}><ChevronLeft className="size-4" /> Previous</Link>
          <span className="text-sm text-ink/60">Page {page} of {pages}</span>
          <Link href={href(page + 1)} aria-disabled={page >= pages} className={`btn-secondary !min-h-10 ${page >= pages ? "pointer-events-none opacity-40" : ""}`}>Next <ChevronRight className="size-4" /></Link>
        </nav>
      )}
    </div>
  );
}
