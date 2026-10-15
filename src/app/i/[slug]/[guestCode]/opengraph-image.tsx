import { inviteImage, OG_SIZE } from "@/lib/og";

export const alt = "Wedding invitation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string; guestCode: string }> }) {
  const { slug, guestCode } = await params;
  return inviteImage(slug, guestCode);
}
