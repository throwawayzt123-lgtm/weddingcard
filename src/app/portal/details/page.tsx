import type { Metadata } from "next";
import { DetailsForm } from "@/components/portal/details-form";
import { toYmd, formatLongDate } from "@/lib/dates";
import { requirePortalInvitation } from "@/lib/portal";
import { getSettings, waLink } from "@/lib/settings";

export const metadata: Metadata = { title: "Details" };

export default async function DetailsPage() {
  const { invitation: inv, edit } = await requirePortalInvitation();
  const settings = await getSettings();
  const ymd = toYmd(inv.weddingDate);

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Details</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">The main information on your invitation.</p>
      <DetailsForm
        invitationId={inv.id}
        groomName={inv.groomName}
        brideName={inv.brideName}
        weddingDate={ymd}
        weddingDateLabel={formatLongDate(ymd)}
        dateLocked={inv.dateLocked}
        hashtag={inv.hashtag ?? ""}
        welcomeMessage={inv.welcomeMessage ?? ""}
        verseText={inv.verseText ?? ""}
        couplePhotoUrl={inv.couplePhotoUrl}
        helpUrl={waLink(settings, `Hi, I need to correct a name on my invitation (${inv.groomName} & ${inv.brideName}).`)}
        disabled={!edit.editable}
      />
    </div>
  );
}
