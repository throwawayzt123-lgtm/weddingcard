import { getPortalContext } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

/** Spreadsheet programs run text that starts with = + - @ as a formula. A leading ' makes it plain text. */
function cell(value: string | number | null | undefined): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Downloads every reply (and who has not replied yet) as a CSV file that opens in Excel. */
export async function GET(request: Request) {
  const { invitation: inv, plan } = await getPortalContext();
  if (!inv || !plan?.rsvp) return new Response("Not available", { status: 403 });

  const eventId = new URL(request.url).searchParams.get("event");
  const events = await prisma.event.findMany({ where: { invitationId: inv.id, ...(eventId && { id: eventId }) }, orderBy: [{ date: "asc" }, { order: "asc" }] });

  const guestEvents = await prisma.guestEvent.findMany({
    where: { eventId: { in: events.map((e) => e.id) } },
    include: { guest: { select: { id: true, displayName: true, phone: true } } },
  });
  const rsvps = await prisma.rsvp.findMany({ where: { eventId: { in: events.map((e) => e.id) } } });
  const answer = new Map(rsvps.map((r) => [`${r.guestId}|${r.eventId}`, r]));

  const lines = [["Guest", "Phone", "Event", "Reply", "People", "Message", "Replied on"].map(cell).join(",")];
  for (const ev of events) {
    for (const ge of guestEvents.filter((g) => g.eventId === ev.id).sort((a, b) => a.guest.displayName.localeCompare(b.guest.displayName))) {
      const r = answer.get(`${ge.guestId}|${ev.id}`);
      lines.push([
        ge.guest.displayName,
        ge.guest.phone ? `+${ge.guest.phone}` : "",
        ev.title,
        r ? { YES: "Attending", NO: "Not attending", MAYBE: "Maybe" }[r.response] : "No reply",
        r ? r.headcount : "",
        r?.message ?? "",
        r ? r.updatedAt.toISOString().slice(0, 10) : "",
      ].map(cell).join(","));
    }
  }

  // The leading BOM makes Excel read Urdu and other non-English names correctly.
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${inv.slug}-replies.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
