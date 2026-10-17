"use client";

import { useTransition } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePhotoAction, movePhotoAction } from "@/app/portal/actions";
import { FileUploader } from "@/components/portal/uploader";

type Photo = { id: string; url: string };

export function GalleryManager({
  invitationId, photos, limit, planLabel, disabled, upgradeUrl,
}: {
  invitationId: string;
  photos: Photo[];
  limit: number;
  planLabel: string;
  disabled: boolean;
  upgradeUrl: string;
}) {
  const [pending, startTransition] = useTransition();

  if (limit === 0) {
    return (
      <div className="card p-8 text-center">
        <ImageIcon className="mx-auto size-10 text-gold-dark" />
        <p className="mt-3 font-serif text-2xl text-maroon">The photo gallery is not in your plan</p>
        <p className="mt-1 text-sm text-ink/65">The {planLabel} plan does not include a gallery. Upgrade to Advanced (10 photos) or Prime (30 photos).</p>
        <a href={upgradeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">Upgrade by messaging us on WhatsApp</a>
      </div>
    );
  }

  const full = photos.length >= limit;
  const run = (fn: () => Promise<{ ok: boolean; error?: string; message?: string } | undefined>) =>
    startTransition(async () => {
      const r = await fn();
      if (r && !r.ok) toast.error(r.error ?? "Something went wrong");
      else if (r?.message) toast.success(r.message);
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/65">{photos.length} / {limit} photos · {planLabel} plan</p>
        {!disabled && !full && <FileUploader invitationId={invitationId} kind="photo" label="Add photos" multiple className="btn-primary" />}
      </div>

      {full && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You have used all {limit} photos in your {planLabel} plan.{" "}
          <a href={upgradeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Upgrade by messaging us on WhatsApp</a>
        </p>
      )}

      {photos.length === 0 ? (
        <div className="card p-10 text-center">
          <ImageIcon className="mx-auto size-10 text-gold-dark" />
          <p className="mt-3 font-serif text-2xl text-maroon">No photos yet</p>
          <p className="mt-1 text-sm text-ink/60">Add your favourite photos. Guests can swipe through them on your invitation.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p, i) => (
            <li key={p.id} className="card overflow-hidden">
              <div className="relative aspect-[3/4] bg-cream">
                <Image src={p.url} alt={`Photo ${i + 1}`} fill sizes="(max-width: 640px) 45vw, 220px" className="object-cover" />
                <span className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">{i + 1}</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex">
                  <button type="button" aria-label="Move earlier" disabled={disabled || pending || i === 0} onClick={() => run(() => movePhotoAction(invitationId, p.id, "left"))} className="flex size-10 items-center justify-center rounded-lg text-ink/60 hover:bg-ink/5 disabled:opacity-25"><ArrowLeft className="size-4" /></button>
                  <button type="button" aria-label="Move later" disabled={disabled || pending || i === photos.length - 1} onClick={() => run(() => movePhotoAction(invitationId, p.id, "right"))} className="flex size-10 items-center justify-center rounded-lg text-ink/60 hover:bg-ink/5 disabled:opacity-25"><ArrowRight className="size-4" /></button>
                </div>
                <button type="button" aria-label="Delete photo" disabled={disabled || pending} onClick={() => { if (confirm("Delete this photo?")) run(() => deletePhotoAction(invitationId, p.id)); }} className="flex size-10 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="size-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
