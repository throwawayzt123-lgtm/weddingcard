import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { loadInvitation } from "@/lib/invitation-view";
import { prisma } from "@/lib/prisma";
import { ConcludedScreen, SuspendedScreen } from "@/components/invite-shared/status-screens";
import { TemplateHost } from "@/templates/template-host";
import { submitRsvp } from "./actions";

// WhatsApp, Facebook, Google etc. fetch a link to build its preview card.
// That must not count as the guest opening their invitation.
const BOT = /bot|crawler|spider|preview|whatsapp|facebookexternalhit|telegram|slack|discord|skype|linkedin|embedly|curl|wget|headless/i;

export async function invitationMetadata(slug: string, guestCode: string | null): Promise<Metadata> {
  const noindex = { robots: { index: false, follow: false } } as const;
  const result = await loadInvitation(slug, guestCode);
  if (result.kind === "ok") {
    const { data } = result;
    const title = `${data.groomName} & ${data.brideName} | Wedding Invitation`;
    const description = data.guest ? `You're invited, ${data.guest.displayName}` : "You are warmly invited to our wedding celebrations.";
    return { title, description, openGraph: { title, description, type: "website" }, ...noindex };
  }
  return { title: "Invitation", ...noindex };
}

export async function InvitationPage({ slug, guestCode }: { slug: string; guestCode: string | null }) {
  const result = await loadInvitation(slug, guestCode);

  if (result.kind === "notfound") notFound();
  if (result.kind === "suspended") return <SuspendedScreen brand={result.brand} />;
  if (result.kind === "expired") return <ConcludedScreen {...result} />;

  // Record "opened" for personal links — but not for link-preview bots, nor for
  // the family or admin checking their own card.
  const { guest } = result;
  if (guest) {
    const ua = (await headers()).get("user-agent") ?? "";
    const viewer = await getCurrentUser();
    const isOwnerOrAdmin = !!viewer && (viewer.role === "ADMIN" || viewer.id === result.ownerId);
    if (!BOT.test(ua) && !isOwnerOrAdmin) {
      after(async () => {
        await prisma.guest.update({
          where: { id: guest.id },
          data: { openCount: { increment: 1 }, openedAt: guest.openedAt ?? new Date() },
        });
      });
    }
  }

  return <TemplateHost data={result.data} rsvpAction={submitRsvp} />;
}
