import type { Metadata } from "next";
import Link from "next/link";
import { Download, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { toYmd } from "@/lib/dates";
import { requirePortalInvitation } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { getSettings, waLink } from "@/lib/settings";

export const metadata: Metadata = { title: "Replies" };

const STYLE = {
  YES: { label: "Attending", cls: "bg-green-100 text-green-800" },
  NO: { label: "Can't come", cls: "bg-red-100 text-red-700" },
  MAYBE: { label: "Maybe", cls: "bg-amber-100 text-amber-800" },
} as const;

export default async function RsvpsPage({ searchParams }: PageProps<"/portal/rsvps">) {
  const { invitation: inv, plan } = await requirePortalInvitation();
  const settings = await getSettings();

  if (!plan.rsvp) {
    return (
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl">Replies</h1>
        <div className="card mt-6 p-8 text-center">
          <MessageCircle className="mx-auto size-10 text-gold-dark" />
          <p className="mt-3 font-serif text-2xl text-maroon">RSVP is not in your plan</p>
          <p className="mt-1 text-sm text-ink/65">With RSVP, guests reply Yes, No or Maybe for each event and tell you how many people are coming. Available on Standard and Premium.</p>
          <a href={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}) to get RSVP.`)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">Upgrade — contact us on WhatsApp</a>
        </div>
      </div>
    );
  }

  const sp = await searchParams;
  const events = await prisma.event.findMany({ where: { invitationId: inv.id }, orderBy: [{ date: "asc" }, { order: "asc" }] });
  const selectedId = typeof sp.event === "string" && events.some((e) => e.id === sp.event) ? sp.event : "";

  const [sums, invited, replies] = await Promise.all([
    prisma.rsvp.groupBy({ by: ["eventId", "response"], where: { event: { invitationId: inv.id } }, _count: true, _sum: { headcount: true } }),
    prisma.guestEvent.groupBy({ by: ["eventId"], where: { event: { invitationId: inv.id } }, _count: true }),
    prisma.rsvp.findMany({
      where: { event: { invitationId: inv.id }, ...(selectedId && { eventId: selectedId }) },
      orderBy: { updatedAt: "desc" },
      take: 300,
      include: { guest: { select: { displayName: true } }, event: { select: { title: true } } },
    }),
  ]);

  const summary = events.map((e) => {
    const get = (r: "YES" | "NO" | "MAYBE") => sums.find((s) => s.eventId === e.id && s.response === r);
    const replied = (["YES", "NO", "MAYBE"] as const).reduce((n, r) => n + (get(r)?._count ?? 0), 0);
    const invitedCount = invited.find((i) => i.eventId === e.id)?._count ?? 0;
    return { event: e, yes: get("YES")?._count ?? 0, people: get("YES")?._sum.headcount ?? 0, no: get("NO")?._count ?? 0, maybe: get("MAYBE")?._count ?? 0, maybePeople: get("MAYBE")?._sum.headcount ?? 0, pending: Math.max(0, invitedCount - replied) };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl">Replies</h1>
          <p className="mt-1 text-sm text-ink/60">What your guests answered.</p>
        </div>
        <a href={`/portal/rsvps/export${selectedId ? `?event=${selectedId}` : ""}`} className="btn-secondary"><Download className="size-5" /> Download Excel (CSV)</a>
      </div>

      {events.length === 0 ? (
        <div className="card p-8 text-center text-ink/65">Add your events first. Guests reply per event.</div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.map((s) => (
              <div key={s.event.id} className="card p-4">
                <p className="font-serif text-2xl text-maroon">{s.event.title}</p>
                <p className="text-xs text-ink/55">{formatDate(toYmd(s.event.date))}</p>
                <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-xl bg-green-50 p-2"><dd className="text-2xl font-semibold text-green-700">{s.people}</dd><dt className="text-[0.65rem] font-semibold text-green-800">People coming</dt></div>
                  <div className="rounded-xl bg-red-50 p-2"><dd className="text-2xl font-semibold text-red-600">{s.no}</dd><dt className="text-[0.65rem] font-semibold text-red-700">Can&apos;t come</dt></div>
                  <div className="rounded-xl bg-amber-50 p-2"><dd className="text-2xl font-semibold text-amber-600">{s.maybe}</dd><dt className="text-[0.65rem] font-semibold text-amber-800">Maybe</dt></div>
                  <div className="rounded-xl bg-gray-100 p-2"><dd className="text-2xl font-semibold text-gray-600">{s.pending}</dd><dt className="text-[0.65rem] font-semibold text-gray-700">No reply</dt></div>
                </dl>
                <p className="mt-2 text-xs text-ink/55">{s.yes} {s.yes === 1 ? "guest" : "guests"} attending{s.maybePeople > 0 && `, plus up to ${s.maybePeople} maybe`}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/portal/rsvps" className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${!selectedId ? "border-maroon bg-maroon text-white" : "border-ink/15 bg-white hover:bg-cream"}`}>All events</Link>
            {events.map((e) => (
              <Link key={e.id} href={`/portal/rsvps?event=${e.id}`} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${selectedId === e.id ? "border-maroon bg-maroon text-white" : "border-ink/15 bg-white hover:bg-cream"}`}>{e.title}</Link>
            ))}
          </div>

          {replies.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="font-serif text-2xl text-maroon">No replies yet</p>
              <p className="mt-1 text-sm text-ink/60">When guests answer on their personal link, you will see them here.</p>
            </div>
          ) : (
            <ul className="card divide-y divide-ink/10 overflow-hidden">
              {replies.map((r) => (
                <li key={r.id} className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{r.guest.displayName}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${STYLE[r.response].cls}`}>{STYLE[r.response].label}{r.response !== "NO" && ` · ${r.headcount} ${r.headcount === 1 ? "person" : "people"}`}</span>
                  </div>
                  <p className="text-xs text-ink/55">{r.event.title} · {r.updatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Karachi" })}</p>
                  {r.message && <p className="mt-2 rounded-xl bg-cream/60 p-3 text-sm italic">“{r.message}”</p>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
