import { inviteImage, OG_SIZE } from "@/lib/og";

export const alt = "Wedding invitation";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return inviteImage(slug, null);
}
