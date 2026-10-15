import type { Metadata } from "next";
import { EventsManager, type EventRow } from "@/components/portal/events-manager";
import { toYmd } from "@/lib/dates";
import { requirePortalInvitation } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { getSettings, waLink } from "@/lib/settings";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const { invitation: inv, plan, edit } = await requirePortalInvitation();
  const settings = await getSettings();
  const events = await prisma.event.findMany({ where: { invitationId: inv.id }, orderBy: [{ date: "asc" }, { order: "asc" }] });

  const rows: EventRow[] = events.map((e, i) => ({
    id: e.id, type: e.type, title: e.title, date: toYmd(e.date), startTime: e.startTime, endTime: e.endTime,
    venueName: e.venueName, address: e.address, mapUrl: e.mapUrl, dressCode: e.dressCode, notes: e.notes,
    canMoveUp: i > 0 && toYmd(events[i - 1].date) === toYmd(e.date),
    canMoveDown: i < events.length - 1 && toYmd(events[i + 1].date) === toYmd(e.date),
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Events</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">The celebrations your guests are invited to.</p>
      <EventsManager
        invitationId={inv.id}
        events={rows}
        limit={plan.maxEvents}
        planLabel={plan.label}
        disabled={!edit.editable}
        upgradeUrl={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}) to add more events.`)}
      />
    </div>
  );
}
