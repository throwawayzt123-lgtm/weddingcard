import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, Mail, PlusCircle, Users, Wallet } from "lucide-react";
import { Card } from "@/components/ui/form";
import { requireAdmin } from "@/lib/dal";
import { addDays, daysLeft } from "@/lib/invitations";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Dashboard" };

const RESPONSE_STYLE = { YES: "text-green-700", NO: "text-red-600", MAYBE: "text-amber-600" } as const;
const RESPONSE_LABEL = { YES: "is attending", NO: "can't come to", MAYBE: "may come to" } as const;

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const now = new Date();
  const weekAhead = addDays(now, 7);

  const [total, active, expiringSoon, guests, unpaid, recentRsvps, expiringList] = await Promise.all([
    prisma.invitation.count(),
    prisma.invitation.count({ where: { status: "ACTIVE", expiresAt: { gt: now } } }),
    prisma.invitation.count({ where: { status: "ACTIVE", expiresAt: { gt: now, lte: weekAhead } } }),
    prisma.guest.count(),
    prisma.invitation.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.rsvp.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { guest: { select: { displayName: true, invitation: { select: { id: true, groomName: true, brideName: true } } } }, event: { select: { title: true } } },
    }),
    prisma.invitation.findMany({
      where: { status: "ACTIVE", expiresAt: { gt: now, lte: weekAhead } },
      orderBy: { expiresAt: "asc" },
      take: 5,
      select: { id: true, groomName: true, brideName: true, expiresAt: true },
    }),
  ]);

  const stats = [
    { label: "Total invitations", value: total, icon: Mail, href: "/admin/invitations" },
    { label: "Active now", value: active, icon: CheckCircle2, href: "/admin/invitations?status=ACTIVE" },
    { label: "Expiring this week", value: expiringSoon, icon: CalendarClock, href: "/admin/invitations?status=EXPIRING", warn: expiringSoon > 0 },
    { label: "Total guests", value: guests, icon: Users },
    { label: "Awaiting payment", value: unpaid, icon: Wallet, href: "/admin/invitations?status=UNPAID", warn: unpaid > 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">Welcome, {admin.name}</h1>
          <p className="mt-1 text-sm text-ink/60">Here is what is happening with your invitations.</p>
        </div>
        <Link href="/admin/invitations/new" className="btn-primary">
          <PlusCircle className="size-5" />
          New invitation
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {stats.map((s) => {
          const body = (
            <div className={`card h-full p-4 transition ${s.href ? "hover:border-maroon/40 hover:shadow-md" : ""}`}>
              <s.icon className={`size-5 ${s.warn ? "text-amber-600" : "text-gold-dark"}`} />
              <p className="mt-3 text-3xl font-semibold">{s.value}</p>
              <p className="text-xs font-medium text-ink/60">{s.label}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {body}
            </Link>
          ) : (
            <div key={s.label}>{body}</div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card title="Recent replies" description="The latest RSVPs from guests across all invitations.">
          {recentRsvps.length === 0 ? (
            <p className="rounded-xl bg-cream/60 p-5 text-center text-sm text-ink/60">No replies yet. They will appear here as guests respond.</p>
          ) : (
            <ul className="divide-y divide-ink/10">
              {recentRsvps.map((r) => (
                <li key={r.id} className="py-3 text-sm">
                  <Link href={`/admin/invitations/${r.guest.invitation.id}`} className="font-semibold text-maroon hover:underline">
                    {r.guest.invitation.groomName} &amp; {r.guest.invitation.brideName}
                  </Link>
                  <p className="mt-0.5 text-ink/75">
                    {r.guest.displayName} <span className={`font-semibold ${RESPONSE_STYLE[r.response]}`}>{RESPONSE_LABEL[r.response]}</span> {r.event.title}
                    {r.response !== "NO" && ` (${r.headcount})`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Expiring soon" description="Invitations that end within 7 days.">
          {expiringList.length === 0 ? (
            <p className="rounded-xl bg-cream/60 p-5 text-center text-sm text-ink/60">Nothing is expiring this week.</p>
          ) : (
            <ul className="space-y-3">
              {expiringList.map((i) => (
                <li key={i.id}>
                  <Link href={`/admin/invitations/${i.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm hover:border-amber-400">
                    <span className="font-semibold">
                      {i.groomName} &amp; {i.brideName}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-800">
                      <AlertTriangle className="size-3.5" />
                      {daysLeft(i.expiresAt)}d left
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
