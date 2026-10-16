import type { Metadata } from "next";
import { InvitationPage, invitationMetadata } from "../../invitation-page";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/i/[slug]/[guestCode]">): Promise<Metadata> {
  const { slug, guestCode } = await params;
  return invitationMetadata(slug, guestCode);
}

/** A personal link: "Dear Zainab & Family," with only their events and their RSVP form. */
export default async function Page({ params }: PageProps<"/i/[slug]/[guestCode]">) {
  const { slug, guestCode } = await params;
  return <InvitationPage slug={slug} guestCode={guestCode} />;
}
