import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { toYmd } from "@/lib/dates";
import { getPlan } from "@/lib/plans";
import { SITE } from "@/lib/site";
import { getTemplate, getTrack } from "@/templates/registry";
import type { InvitationViewData, InviteFamilySide, RsvpAnswer } from "@/templates/types";

export type InvitationLoad =
  | { kind: "ok"; data: InvitationViewData; invitationId: string; ownerId: string; guest: { id: string; openedAt: Date | null } | null }
  | { kind: "expired"; groomName: string; brideName: string; brand: string }
  | { kind: "suspended"; brand: string }
  | { kind: "notfound" };

/**
 * Loads everything a guest needs to see an invitation, and decides whether it
 * may be shown at all (suspended / expired / unknown guest code).
 * Wrapped in `cache` so generateMetadata and the page share one database read.
 */
export const loadInvitation = cache(async (slug: string, guestCode: string | null): Promise<InvitationLoad> => {
  // One round trip: every query runs at the same time (each filters by slug itself).
  const [inv, familySides, allEvents, photos, guest] = await Promise.all([
    prisma.invitation.findUnique({ where: { slug } }),
    prisma.familySide.findMany({ where: { invitation: { slug } }, include: { members: { orderBy: { order: "asc" } } } }),
    prisma.event.findMany({ where: { invitation: { slug } }, orderBy: [{ date: "asc" }, { order: "asc" }] }),
    prisma.photo.findMany({ where: { invitation: { slug } }, orderBy: { order: "asc" } }),
    guestCode
      ? prisma.guest.findFirst({
          where: { code: guestCode.toLowerCase(), invitation: { slug } },
          include: { guestEvents: { select: { eventId: true } }, rsvps: true },
        })
      : Promise.resolve(null),
  ]);
  if (!inv || inv.status === "DRAFT") return { kind: "notfound" };

  const brand = SITE.brandName;
  if (inv.status === "SUSPENDED") return { kind: "suspended", brand };
  if (inv.status === "EXPIRED" || inv.expiresAt.getTime() <= Date.now()) {
    return { kind: "expired", groomName: inv.groomName, brideName: inv.brideName, brand };
  }

  // Personal link: the code must belong to THIS invitation (the query above already filtered on it).
  if (guestCode && !guest) return { kind: "notfound" };

  const plan = getPlan(inv.plan);
  const invitedIds = guest ? new Set(guest.guestEvents.map((g) => g.eventId)) : null;
  const events = allEvents.filter((e) => !invitedIds || invitedIds.has(e.id));

  const side = (type: "GROOM" | "BRIDE"): InviteFamilySide => {
    const s = familySides.find((f) => f.side === type);
    return {
      parentsLine: s?.parentsLine ?? null,
      members: (s?.members ?? []).map((m) => ({ id: m.id, name: m.name, phone: m.phone, showPhone: m.showPhone })),
    };
  };

  // Music: the customer's own MP3 (Premium) → their chosen track → the design's default.
  const meta = getTemplate(inv.templateKey);
  const track = getTrack(inv.musicKey) ?? getTrack(meta?.defaultTrack);
  const musicSrc = (plan.customMusicUpload && inv.customMusicUrl) || track?.file || null;

  const rsvps: InvitationViewData["rsvps"] = {};
  for (const r of guest?.rsvps ?? []) {
    rsvps[r.eventId] = { response: r.response as RsvpAnswer, headcount: r.headcount, message: r.message };
  }

  const data: InvitationViewData = {
    slug: inv.slug,
    templateKey: inv.templateKey,
    groomName: inv.groomName,
    brideName: inv.brideName,
    weddingDate: toYmd(inv.weddingDate),
    timezone: inv.timezone,
    hashtag: inv.hashtag,
    welcomeMessage: inv.welcomeMessage,
    verseText: inv.verseText,
    couplePhotoUrl: inv.couplePhotoUrl,
    groomFamily: side("GROOM"),
    brideFamily: side("BRIDE"),
    events: events.map((e) => ({
      id: e.id, type: e.type, title: e.title, date: toYmd(e.date), startTime: e.startTime, endTime: e.endTime,
      venueName: e.venueName, address: e.address, mapUrl: e.mapUrl, dressCode: e.dressCode, notes: e.notes,
    })),
    photos: plan.maxPhotos > 0 ? photos.slice(0, plan.maxPhotos).map((p) => ({ id: p.id, url: p.url })) : [],
    music: { enabled: inv.musicEnabled, src: musicSrc },
    features: {
      rsvp: plan.rsvp,
      gallery: plan.maxPhotos > 0,
      // Only Premium can hide the badge.
      showBadge: inv.showBadge || !plan.canRemoveBadge,
    },
    brand: { name: brand, url: SITE.url },
    guest: guest ? { code: guest.code, displayName: guest.displayName } : null,
    rsvps,
    mode: "live",
  };

  return {
    kind: "ok",
    data,
    invitationId: inv.id,
    ownerId: inv.ownerId,
    guest: guest ? { id: guest.id, openedAt: guest.openedAt } : null,
  };
});
