import type { Metadata } from "next";
import { FamilyForm } from "@/components/portal/family-form";
import { requirePortalInvitation } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Family" };

export default async function FamilyPage() {
  const { invitation: inv, edit } = await requirePortalInvitation();
  const sides = await prisma.familySide.findMany({ where: { invitationId: inv.id }, include: { members: { orderBy: { order: "asc" } } } });

  const side = (type: "GROOM" | "BRIDE") => {
    const s = sides.find((x) => x.side === type);
    return { parentsLine: s?.parentsLine ?? "", members: (s?.members ?? []).map((m) => ({ name: m.name, phone: m.phone ?? "", showPhone: m.showPhone })) };
  };

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Family</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">The blessings section of your invitation: both families, in the order you choose.</p>
      <FamilyForm invitationId={inv.id} initial={{ groom: side("GROOM"), bride: side("BRIDE") }} disabled={!edit.editable} />
    </div>
  );
}
