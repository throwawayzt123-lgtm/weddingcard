import type { Metadata } from "next";
import { GalleryManager } from "@/components/portal/gallery-manager";
import { requirePortalInvitation } from "@/lib/portal";
import { prisma } from "@/lib/prisma";
import { getSettings, waLink } from "@/lib/settings";

export const metadata: Metadata = { title: "Photos" };

export default async function GalleryPage() {
  const { invitation: inv, plan, edit } = await requirePortalInvitation();
  const settings = await getSettings();
  const photos = await prisma.photo.findMany({ where: { invitationId: inv.id }, orderBy: { order: "asc" }, select: { id: true, url: true } });

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Photos</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">The photo gallery on your invitation.</p>
      <GalleryManager
        invitationId={inv.id}
        photos={photos}
        limit={plan.maxPhotos}
        planLabel={plan.label}
        disabled={!edit.editable}
        upgradeUrl={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}) to add a photo gallery.`)}
      />
    </div>
  );
}
