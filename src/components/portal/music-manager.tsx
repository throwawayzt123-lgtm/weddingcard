"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Music2, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeCustomMusicAction, saveMusicAction } from "@/app/portal/actions";
import { FileUploader } from "@/components/portal/uploader";
import { Card } from "@/components/ui/form";

type Track = { key: string; label: string; mood: string; file: string };

export function MusicManager({
  invitationId, tracks, selectedKey, enabled: initialEnabled, canUpload, customUrl, disabled, upgradeUrl,
}: {
  invitationId: string;
  tracks: Track[];
  selectedKey: string;
  enabled: boolean;
  canUpload: boolean;
  customUrl: string | null;
  disabled: boolean;
  upgradeUrl: string;
}) {
  const [selected, setSelected] = useState(selectedKey);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [playing, setPlaying] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const audio = useRef<HTMLAudioElement>(null);

  function preview(track: Track) {
    const el = audio.current;
    if (!el) return;
    if (playing === track.key) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = track.file;
    el.play().then(() => setPlaying(track.key)).catch(() => toast.error("This track could not be played."));
  }

  function save() {
    startTransition(async () => {
      const r = await saveMusicAction(invitationId, { musicKey: selected, musicEnabled: enabled });
      if (r?.ok) toast.success("Music saved");
      else toast.error(r ? r.error : "Something went wrong");
    });
  }

  return (
    <div className="space-y-6">
      <audio ref={audio} onEnded={() => setPlaying(null)} className="hidden" />

      <Card title="Music on your invitation">
        <label className="flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-cream/50 p-4">
          <span>
            <span className="block font-semibold">Play music when guests open the card</span>
            <span className="block text-xs text-ink/60">Music starts when the guest taps “Tap to Open”. They can mute it any time.</span>
          </span>
          <input type="checkbox" role="switch" checked={enabled} disabled={disabled} onChange={(e) => setEnabled(e.target.checked)} className="size-6 shrink-0 accent-maroon" />
        </label>
      </Card>

      <Card title="Choose a track" description={customUrl ? "You uploaded your own music, so it plays instead of these. Remove it below to choose one of our tracks." : "Tap the play button to listen."}>
        <ul className={`space-y-2.5 ${customUrl ? "pointer-events-none opacity-50" : ""}`}>
          {tracks.map((t) => (
            <li key={t.key}>
              <div className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${selected === t.key ? "border-maroon bg-cream/60" : "border-ink/10"}`}>
                <button type="button" onClick={() => preview(t)} aria-label={playing === t.key ? `Pause ${t.label}` : `Play ${t.label}`} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-maroon text-white">
                  {playing === t.key ? <Pause className="size-5" /> : <Play className="size-5" />}
                </button>
                <label className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-semibold">{t.label}</span>
                    <span className="block truncate text-xs text-ink/60">{t.mood}</span>
                  </span>
                  <input type="radio" name="track" value={t.key} checked={selected === t.key} disabled={disabled} onChange={() => setSelected(t.key)} className="size-5 shrink-0 accent-maroon" />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Your own music" description="Prime plan: upload an MP3 (up to 10 MB). Only use music you have the right to use.">
        {canUpload ? (
          customUrl ? (
            <div className="space-y-3">
              <audio controls src={customUrl} className="w-full" />
              <button type="button" disabled={disabled || pending} onClick={() => startTransition(async () => { const r = await removeCustomMusicAction(invitationId); if (r?.ok) toast.success("Your music was removed"); else if (r) toast.error(r.error); })} className="inline-flex items-center gap-2 text-sm font-semibold text-red-700 hover:underline">
                <Trash2 className="size-4" /> Remove my music
              </button>
            </div>
          ) : (
            !disabled && <FileUploader invitationId={invitationId} kind="music" label="Upload an MP3" hint="MP3 only, up to 10 MB." />
          )
        ) : (
          <p className="flex items-start gap-3 rounded-xl bg-cream/60 p-4 text-sm">
            <Music2 className="mt-0.5 size-5 shrink-0 text-gold-dark" />
            <span>
              Uploading your own music is included in the Prime plan.{" "}
              <a href={upgradeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-maroon underline">Upgrade by messaging us on WhatsApp</a>
            </span>
          </p>
        )}
      </Card>

      <button type="button" onClick={save} disabled={pending || disabled} className="btn-primary w-full sm:w-auto">
        {pending && <Loader2 className="size-5 animate-spin" />}
        {pending ? "Saving…" : "Save music"}
      </button>
    </div>
  );
}
