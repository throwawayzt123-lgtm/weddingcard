import type { Metadata } from "next";
import { InvitationPage, invitationMetadata } from "../invitation-page";

// Invitations change (edits, expiry, RSVPs), so never cache the page.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/i/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return invitationMetadata(slug, null);
}

/** The general invitation link: "Dear Guest,". */
export default async function Page({ params }: PageProps<"/i/[slug]">) {
  const { slug } = await params;
  return <InvitationPage slug={slug} guestCode={null} />;
}
