import type { Metadata } from "next";
import { MusicManager } from "@/components/portal/music-manager";
import { requirePortalInvitation } from "@/lib/portal";
import { getSettings, waLink } from "@/lib/settings";
import { getTemplate, getTrack, type MusicTrack } from "@/templates/registry";

export const metadata: Metadata = { title: "Music" };

export default async function MusicPage() {
  const { invitation: inv, plan, edit } = await requirePortalInvitation();
  const settings = await getSettings();
  const template = getTemplate(inv.templateKey);
  const tracks = (template?.tracks ?? []).map((k) => getTrack(k)).filter((t): t is MusicTrack => !!t);
  const selected = inv.musicKey && tracks.some((t) => t.key === inv.musicKey) ? inv.musicKey : (template?.defaultTrack ?? tracks[0]?.key ?? "");

  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Music</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">The soft music that plays when guests open your card.</p>
      <MusicManager
        invitationId={inv.id}
        tracks={tracks}
        selectedKey={selected}
        enabled={inv.musicEnabled}
        canUpload={plan.customMusicUpload}
        customUrl={plan.customMusicUpload ? inv.customMusicUrl : null}
        disabled={!edit.editable}
        upgradeUrl={waLink(settings, `Hi, I'd like to upgrade my invitation (${inv.groomName} & ${inv.brideName}) to Premium to upload my own music.`)}
      />
    </div>
  );
}
