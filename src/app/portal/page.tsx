import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Check, ChevronRight, Circle, ExternalLink, Lock, MessageCircle } from "lucide-react";
import { SwitchInvitation } from "@/components/portal/switch-invitation";
import { Card, CopyButton } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/status-badge";
import { daysLeft, effectiveStatus } from "@/lib/invitations";
import { formatUsage } from "@/lib/plans";
import { getPortalContext } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { getSettings, waLink } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { getTemplate } from "@/templates/registry";

export const metadata: Metadata = { title: "Home" };

export default async function PortalHome() {
  const ctx = await getPortalContext();
  const settings = await getSettings();
  const { user, invitation: inv, plan, all } = ctx;

  if (!inv || !plan) {
    return (
      <div className="card p-8 text-center">
        <h1 className="font-serif text-3xl text-maroon">Assalam-o-Alaikum, {user.name}</h1>
        <p className="mt-3 text-ink/70">No invitation is linked to your account yet. Please message us on WhatsApp and we will set it up.</p>
        <a href={waLink(settings)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">
          <MessageCircle className="size-5" /> Message us
        </a>
      </div>
    );
  }

  const [events, guests, openedGuests, photos, family, rsvp] = await Promise.all([
    prisma.event.count({ where: { invitationId: inv.id } }),
    prisma.guest.count({ where: { invitationId: inv.id } }),
    prisma.guest.count({ where: { invitationId: inv.id, openCount: { gt: 0 } } }),
    prisma.photo.count({ where: { invitationId: inv.id } }),
    prisma.familySide.findMany({ where: { invitationId: inv.id }, include: { _count: { select: { members: true } } } }),
    prisma.rsvp.groupBy({ by: ["response"], where: { guest: { invitationId: inv.id } }, _count: true, _sum: { headcount: true } }),
  ]);

  const status = effectiveStatus(inv);
  const left = daysLeft(inv.expiresAt);
  const inviteUrl = `${SITE.url}/i/${inv.slug}`;
  const template = getTemplate(inv.templateKey);
  const familyDone = family.some((f) => f.parentsLine || f._count.members > 0);
  const answers = (r: "YES" | "NO" | "MAYBE") => rsvp.find((x) => x.response === r)?._count ?? 0;
  const expected = rsvp.find((x) => x.response === "YES")?._sum.headcount ?? 0;

  const checklist = [
    { done: events > 0, label: "Add your events", hint: "Mehndi, Nikkah, Baraat, Walima…", href: "/portal/events" },
    { done: familyDone, label: "Add the families' names", hint: "Parents and relatives shown on the card", href: "/portal/family" },
    { done: !!inv.welcomeMessage, label: "Write a welcome message", hint: "A few warm words for your guests", href: "/portal/details" },
    { done: guests > 0, label: "Add your guests", hint: "Each guest gets their own link", href: "/portal/guests" },
    { done: openedGuests > 0, label: "Share the invitations", hint: "Send the links on WhatsApp", href: "/portal/guests" },
  ];
  const progress = Math.round((checklist.filter((c) => c.done).length / checklist.length) * 100);

  const meters = [
    { label: "Events", value: events, limit: plan.maxEvents },
    { label: "Guest links", value: guests, limit: plan.maxGuests },
    ...(plan.maxPhotos > 0 ? [{ label: "Photos", value: photos, limit: plan.maxPhotos }] : []),
  ];

  return (
    <div className="space-y-6">
      {all.length > 1 && <SwitchInvitation current={inv.id} options={all.map((i) => ({ id: i.id, label: `${i.groomName} & ${i.brideName}` }))} />}

      <div>
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Assalam-o-Alaikum, {user.name}</h1>
        <p className="mt-1 text-sm text-ink/60">Here is how your invitation is doing.</p>
      </div>

      {/* The invitation card */}
      <section className="overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#7a1f35,#4d1220)] p-6 text-ivory shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.25em] text-gold-light uppercase">
              <Lock className="size-3.5" /> Your invitation
            </p>
            <p className="mt-2 font-serif text-4xl">
              {inv.groomName} <span className="text-gold-light">&amp;</span> {inv.brideName}
            </p>
            <p className="mt-1 text-sm text-ivory/70">{template?.name} design · {plan.label} plan</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl bg-black/20 p-3 text-sm">
          <CalendarClock className="size-4 text-gold-light" />
          {left > 0 ? (
            <span>
              Online for <strong>{left} more {left === 1 ? "day" : "days"}</strong> (until {inv.expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })})
            </span>
          ) : (
            <span>This invitation has expired.</span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-gold !text-ink hover:!bg-gold-light">
            <ExternalLink className="size-5" /> Preview my invitation
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`You are invited to the wedding of ${inv.groomName} & ${inv.brideName} 🎉\n${inviteUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !border-white/25 !bg-white/10 !text-white hover:!bg-white/20"
          >
            <MessageCircle className="size-5" /> Share on WhatsApp
          </a>
          <CopyButton text={inviteUrl} label="Copy link" className="!min-h-12 !rounded-xl !border-white/25 !bg-white/10 !px-4 !text-white hover:!bg-white/20" />
        </div>
        <p className="mt-3 text-xs text-ivory/60">This general link says “Dear Guest”. For a link that greets each guest by name, use the Guests page.</p>
      </section>

      {/* Checklist */}
      <Card title="Get your invitation ready" description={`${progress}% done`}>
        <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-gold to-maroon transition-all" style={{ width: `${progress}%` }} />
        </div>
        <ul className="divide-y divide-ink/10">
          {checklist.map((c) => (
            <li key={c.label}>
              <Link href={c.href} className="flex min-h-14 items-center gap-3 py-2.5 hover:bg-cream/50">
                {c.done ? <Check className="size-6 shrink-0 rounded-full bg-green-600 p-1 text-white" /> : <Circle className="size-6 shrink-0 text-ink/25" />}
                <span className="min-w-0 flex-1">
                  <span className={`block font-semibold ${c.done ? "text-ink/50 line-through" : ""}`}>{c.label}</span>
                  <span className="block text-xs text-ink/55">{c.hint}</span>
                </span>
                <ChevronRight className="size-5 text-ink/30" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {/* Replies */}
      {plan.rsvp && (
        <Card title="Replies so far">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Attending", value: answers("YES"), color: "text-green-700" },
              { label: "Can't come", value: answers("NO"), color: "text-red-600" },
              { label: "Maybe", value: answers("MAYBE"), color: "text-amber-600" },
              { label: "People expected", value: expected, color: "text-maroon" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-cream/60 p-4 text-center">
                <p className={`text-3xl font-semibold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs font-medium text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>
          <Link href="/portal/rsvps" className="mt-4 inline-block text-sm font-semibold text-maroon underline underline-offset-4">
            See every reply
          </Link>
        </Card>
      )}

      {/* Plan usage */}
      <Card title="Your plan" description={`${plan.label} plan`}>
        <ul className="space-y-4">
          {meters.map((m) => {
            const pct = m.limit === null ? 8 : Math.min(100, Math.round((m.value / Math.max(1, m.limit)) * 100));
            const full = m.limit !== null && m.value >= m.limit;
            return (
              <li key={m.label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold">{m.label}</span>
                  <span className={full ? "font-bold text-amber-700" : "text-ink/65"}>{formatUsage(m.value, m.limit)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-cream">
                  <div className={`h-full rounded-full ${full ? "bg-amber-500" : "bg-maroon/70"}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        <a
          href={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-maroon underline underline-offset-4"
        >
          <MessageCircle className="size-4" /> Need more? Upgrade by messaging us on WhatsApp
        </a>
      </Card>
    </div>
  );
}
