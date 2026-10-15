"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { RsvpResult, RsvpSubmission } from "@/templates/types";

/** Removes HTML tags and control characters from free text. */
function cleanText(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

const submissionSchema = z.object({
  answers: z
    .array(
      z.object({
        eventId: z.string().min(1).max(50),
        response: z.enum(["YES", "NO", "MAYBE"]),
        headcount: z.number().int().min(0).max(20),
        message: z.string().max(500).transform(cleanText),
      }),
    )
    .min(1)
    .max(12),
});

/**
 * Saves (or updates) a guest's RSVP. The guest is identified by the secret
 * code in their personal link — nothing the browser sends about WHICH guest or
 * invitation is trusted until it has been checked against the database.
 */
export async function submitRsvp(slug: string, guestCode: string, submission: RsvpSubmission): Promise<RsvpResult> {
  const parsed = submissionSchema.safeParse(submission);
  if (!parsed.success || typeof slug !== "string" || typeof guestCode !== "string") {
    return { ok: false, error: "Something looks wrong with your reply. Please check and try again." };
  }

  // 15 replies per hour per guest link, and 60 per hour per internet connection.
  const ip = getClientIp(await headers());
  const [byGuest, byIp] = await Promise.all([
    rateLimit(`rsvp:guest:${guestCode}`, 15, 3600),
    rateLimit(`rsvp:ip:${ip}`, 60, 3600),
  ]);
  if (!byGuest.ok || !byIp.ok) {
    return { ok: false, error: "You have sent too many replies. Please try again in a little while." };
  }

  const guest = await prisma.guest.findFirst({
    where: { code: guestCode.toLowerCase(), invitation: { slug } },
    include: { invitation: true, guestEvents: { select: { eventId: true } } },
  });
  if (!guest) return { ok: false, error: "This invitation link is not valid." };

  const inv = guest.invitation;
  if (inv.status !== "ACTIVE" || inv.expiresAt.getTime() <= Date.now()) {
    return { ok: false, error: "This invitation is no longer accepting replies." };
  }
  if (!getPlan(inv.plan).rsvp) {
    return { ok: false, error: "Replies are not available for this invitation." };
  }

  // Only events this guest was actually invited to can be answered.
  const allowed = new Set(guest.guestEvents.map((g) => g.eventId));
  const answers = parsed.data.answers.filter((a) => allowed.has(a.eventId));
  if (answers.length === 0) return { ok: false, error: "No valid events were selected." };

  await prisma.$transaction(
    answers.map((a) => {
      const headcount = a.response === "NO" ? 0 : Math.max(1, a.headcount);
      return prisma.rsvp.upsert({
        where: { guestId_eventId: { guestId: guest.id, eventId: a.eventId } },
        create: { guestId: guest.id, eventId: a.eventId, response: a.response, headcount, message: a.message || null },
        update: { response: a.response, headcount, message: a.message || null },
      });
    }),
  );

  return { ok: true };
}
