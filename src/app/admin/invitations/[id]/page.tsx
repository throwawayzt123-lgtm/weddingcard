import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { CorrectNamesCard, DeleteCard, OpenPortalButton, QuickActions, SettingsForm } from "@/components/admin/invitation-forms";
import { Card, CopyButton } from "@/components/ui/form";
import { PaidBadge, StatusBadge } from "@/components/ui/status-badge";
import { requireAdmin } from "@/lib/dal";
import { daysLeft, effectiveStatus } from "@/lib/invitations";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";
import { toYmd } from "@/lib/dates";
import { getTemplate } from "@/templates/registry";

export const metadata: Metadata = { title: "Manage invitation" };

const date = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const dateTime = (d: Date) => d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi" });

export default async function ManageInvitation({ params }: PageProps<"/admin/invitations/[id]">) {
  await requireAdmin();
  const { id } = await params;

  const inv = await prisma.invitation.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, username: true, phone: true, email: true } },
      _count: { select: { events: true, guests: true, photos: true } },
    },
  });
  if (!inv) notFound();

  const [rsvpTotals, opened, audit] = await Promise.all([
    prisma.rsvp.groupBy({ by: ["response"], where: { guest: { invitationId: id } }, _count: true }),
    prisma.guest.count({ where: { invitationId: id, openCount: { gt: 0 } } }),
    prisma.auditLog.findMany({ where: { invitationId: id }, orderBy: { createdAt: "desc" }, take: 12, include: { actor: { select: { name: true } } } }),
  ]);

  const status = effectiveStatus(inv);
  const left = daysLeft(inv.expiresAt);
  const plan = PLANS[inv.plan];
  const inviteUrl = `${SITE.url}/i/${inv.slug}`;
  const yes = rsvpTotals.find((r) => r.response === "YES")?._count ?? 0;

  return (
    <div className="space-y-6">
      <Link href="/admin/invitations" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/65 hover:text-maroon">
        <ArrowLeft className="size-4" /> All invitations
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-3xl sm:text-4xl">
            {inv.groomName} &amp; {inv.brideName}
            <Lock className="size-5 text-ink/35" aria-label="Names are locked" />
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <PaidBadge paid={inv.paymentStatus === "PAID"} />
            <span className="text-sm text-ink/60">{getTemplate(inv.templateKey)?.name} · {plan.label}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <OpenPortalButton invitationId={inv.id} />
          <a href={`/i/${inv.slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <ExternalLink className="size-4" /> Open invitation
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Overview">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div><dt className="text-xs text-ink/50">Wedding date</dt><dd className="font-medium">{date(inv.weddingDate)}{inv.dateLocked && " 🔒"}</dd></div>
            <div><dt className="text-xs text-ink/50">Expires</dt><dd className={`font-medium ${left <= 7 && left > 0 ? "text-amber-700" : ""}`}>{date(inv.expiresAt)} {left > 0 ? `(${left} days)` : "(expired)"}</dd></div>
            <div><dt className="text-xs text-ink/50">Events</dt><dd className="font-medium">{inv._count.events}{plan.maxEvents !== null && ` / ${plan.maxEvents}`}</dd></div>
            <div><dt className="text-xs text-ink/50">Guests</dt><dd className="font-medium">{inv._count.guests}{plan.maxGuests !== null && ` / ${plan.maxGuests}`} <span className="text-xs text-ink/50">({opened} opened)</span></dd></div>
            <div><dt className="text-xs text-ink/50">Photos</dt><dd className="font-medium">{inv._count.photos}{plan.maxPhotos > 0 && ` / ${plan.maxPhotos}`}</dd></div>
            <div><dt className="text-xs text-ink/50">Replies “attending”</dt><dd className="font-medium">{yes}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-ink/50">Created</dt><dd className="font-medium">{dateTime(inv.createdAt)}</dd></div>
          </dl>
        </Card>

        <Card title="Customer">
          <dl className="space-y-3 text-sm">
            <div><dt className="text-xs text-ink/50">Name</dt><dd className="font-medium">{inv.owner.name}</dd></div>
            <div><dt className="text-xs text-ink/50">WhatsApp</dt><dd className="font-medium">{inv.owner.phone ? <a className="text-maroon underline" href={`https://wa.me/${inv.owner.phone}`} target="_blank" rel="noopener noreferrer">+{inv.owner.phone}</a> : "—"}</dd></div>
            <div><dt className="text-xs text-ink/50">Login username</dt><dd className="font-mono">{inv.owner.username}</dd></div>
            <div>
              <dt className="text-xs text-ink/50">Invitation link</dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2"><span className="break-all font-medium">{inviteUrl}</span><CopyButton text={inviteUrl} /></dd>
            </div>
          </dl>
        </Card>
      </div>

      <QuickActions
        inv={{ id: inv.id, status, groomName: inv.groomName, brideName: inv.brideName, slug: inv.slug }}
        owner={inv.owner}
        siteUrl={SITE.url}
      />

      <CorrectNamesCard inv={{ id: inv.id, groomName: inv.groomName, brideName: inv.brideName }} />

      <SettingsForm
        inv={{
          id: inv.id, groomName: inv.groomName, brideName: inv.brideName, templateKey: inv.templateKey, plan: inv.plan,
          status: inv.status, weddingDate: toYmd(inv.weddingDate), dateLocked: inv.dateLocked, expiryAuto: inv.expiryAuto,
          expiresAt: toYmd(inv.expiresAt), showBadge: inv.showBadge, paymentStatus: inv.paymentStatus,
          paymentAmount: inv.paymentAmount, paymentMethod: inv.paymentMethod, paymentRef: inv.paymentRef,
        }}
      />

      <Card title="History" description="Changes made by admins to this invitation.">
        {audit.length === 0 ? (
          <p className="text-sm text-ink/60">No changes recorded yet.</p>
        ) : (
          <ul className="divide-y divide-ink/10 text-sm">
            {audit.map((a) => (
              <li key={a.id} className="py-2.5">
                <p className="font-medium">{a.action.replaceAll("_", " ").toLowerCase()}{a.field && <span className="text-ink/55"> · {a.field}</span>}</p>
                {(a.oldValue || a.newValue) && <p className="text-ink/70">{a.oldValue && <span className="line-through opacity-60">{a.oldValue}</span>} {a.oldValue && a.newValue && "→"} {a.newValue}</p>}
                <p className="text-xs text-ink/45">{a.actor?.name ?? "System"} · {dateTime(a.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/audit" className="mt-3 inline-block text-sm font-medium text-maroon underline">View full audit log</Link>
      </Card>

      <DeleteCard id={inv.id} names={`${inv.groomName} & ${inv.brideName}`} />
    </div>
  );
}
