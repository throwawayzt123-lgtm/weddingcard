"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Lock, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeCouplePhotoAction, updateDetailsAction } from "@/app/portal/actions";
import { FileUploader } from "@/components/portal/uploader";
import { Card, Field, SubmitButton, fieldError, useActionToast, useServerForm } from "@/components/ui/form";

type Props = {
  invitationId: string;
  groomName: string;
  brideName: string;
  weddingDate: string; // YYYY-MM-DD
  weddingDateLabel: string;
  dateLocked: boolean;
  hashtag: string;
  welcomeMessage: string;
  verseText: string;
  couplePhotoUrl: string | null;
  helpUrl: string;
  disabled: boolean;
};

export function DetailsForm(p: Props) {
  const { state, onSubmit, pending } = useServerForm(updateDetailsAction.bind(null, p.invitationId));
  useActionToast(state);
  const [removing, startRemove] = useTransition();

  return (
    <div className="space-y-6">
      {/* LOCKED names: shown as plain text, there is no input to edit */}
      <Card title="The couple">
        <div className="grid gap-4 sm:grid-cols-2">
          {[["Groom", p.groomName], ["Bride", p.brideName]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-ink/10 bg-ink/[0.04] p-4">
              <p className="text-xs font-semibold tracking-wider text-ink/50 uppercase">{label}</p>
              <p className="mt-1 flex items-center justify-between gap-2 font-serif text-2xl">
                {value}
                <Lock className="size-5 shrink-0 text-ink/40" aria-label="Locked" />
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-cream/70 p-3 text-sm text-ink/80">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <span>
            Couple names are locked. For a spelling correction, contact us on{" "}
            <a href={p.helpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-maroon underline underline-offset-2">
              <MessageCircle className="size-3.5" />
              WhatsApp
            </a>
            .
          </span>
        </p>
      </Card>

      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <Card title="Wedding date and hashtag">
          <div className="grid gap-4 sm:grid-cols-2">
            {p.dateLocked ? (
              <div className="rounded-xl border border-ink/10 bg-ink/[0.04] p-4">
                <p className="text-xs font-semibold tracking-wider text-ink/50 uppercase">Wedding date</p>
                <p className="mt-1 flex items-center justify-between gap-2 text-lg font-medium">
                  {p.weddingDateLabel}
                  <Lock className="size-4 text-ink/40" aria-label="Locked" />
                </p>
                <p className="mt-1 text-xs text-ink/55">Locked. Message us if the date changes.</p>
              </div>
            ) : (
              <Field label="Wedding date" htmlFor="weddingDate" error={fieldError(state, "weddingDate")} hint="The main day, shown big on your card.">
                <input id="weddingDate" name="weddingDate" type="date" defaultValue={p.weddingDate} className="input" disabled={p.disabled} />
              </Field>
            )}
            <Field label="Hashtag (optional)" htmlFor="hashtag" error={fieldError(state, "hashtag")} hint="For example #AhmadWedsSara">
              <input id="hashtag" name="hashtag" defaultValue={p.hashtag} className="input" disabled={p.disabled} autoComplete="off" />
            </Field>
          </div>
        </Card>

        <Card title="Your words" description="Shown on your invitation. You can write in English or Urdu.">
          <div className="space-y-5">
            <Field label="Welcome message" htmlFor="welcomeMessage" error={fieldError(state, "welcomeMessage")} hint="A warm note to your guests. Up to 800 characters.">
              <textarea id="welcomeMessage" name="welcomeMessage" rows={6} defaultValue={p.welcomeMessage} className="input" dir="auto" disabled={p.disabled} />
            </Field>
            <Field label="Bismillah or verse (optional)" htmlFor="verseText" error={fieldError(state, "verseText")} hint="Shown at the very top, e.g. بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ">
              <textarea id="verseText" name="verseText" rows={2} defaultValue={p.verseText} className="input urdu text-xl" dir="auto" disabled={p.disabled} />
            </Field>
          </div>
        </Card>

        {state && !state.ok && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</p>}
        <SubmitButton pending={pending} className="btn-primary w-full sm:w-auto">Save changes</SubmitButton>
      </form>

      <Card title="Couple photo (optional)" description="A portrait shown on your invitation inside an arch frame. Portrait photos look best.">
        <div className="flex flex-wrap items-center gap-5">
          {p.couplePhotoUrl ? (
            <div className="relative h-40 w-30 overflow-hidden rounded-t-full border-2 border-gold">
              <Image src={p.couplePhotoUrl} alt="Your couple photo" fill sizes="120px" className="object-cover" />
            </div>
          ) : (
            <div className="flex h-40 w-30 items-center justify-center rounded-t-full border-2 border-dashed border-ink/20 text-xs text-ink/40">No photo</div>
          )}
          {!p.disabled && (
            <div className="space-y-3">
              <FileUploader invitationId={p.invitationId} kind="couple" label={p.couplePhotoUrl ? "Change photo" : "Choose a photo"} hint="JPG, PNG or WebP." />
              {p.couplePhotoUrl && (
                <button
                  type="button"
                  disabled={removing}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:underline"
                  onClick={() => startRemove(async () => {
                    const r = await removeCouplePhotoAction(p.invitationId);
                    if (r?.ok) toast.success("Photo removed");
                    else if (r) toast.error(r.error);
                  })}
                >
                  <Trash2 className="size-4" /> Remove photo
                </button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
