import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import { NewInvitationForm } from "./new-invitation-form";

export const metadata: Metadata = { title: "New invitation" };

export default async function NewInvitationPage() {
  await requireAdmin();
  const [clients, settings] = await Promise.all([
    prisma.user.findMany({ where: { role: "CLIENT" }, orderBy: { name: "asc" }, select: { id: true, name: true, phone: true } }),
    getSettings(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">New invitation</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Use this when a customer has chosen a design and paid. It takes about a minute.</p>
      <NewInvitationForm clients={clients} siteUrl={SITE.url} defaultExpiryDays={settings.defaultExpiryDays} />
    </div>
  );
}
