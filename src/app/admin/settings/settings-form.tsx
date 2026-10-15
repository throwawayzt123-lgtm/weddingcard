"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { removeLogoAction, saveSettingsAction } from "@/app/admin/actions";
import { FileUploader } from "@/components/portal/uploader";
import { Card, Field, SubmitButton, fieldError, useActionToast, useServerForm } from "@/components/ui/form";
import { guestMessage } from "@/lib/messages";
import { formatPhone } from "@/lib/phone";
import type { SiteSettings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { state, onSubmit, pending } = useServerForm(saveSettingsAction);
  useActionToast(state);
  const [message, setMessage] = useState(settings.shareMessage);
  const [removing, startRemove] = useTransition();

  return (
    <div className="space-y-6">
    <Card title="Logo" description="Shown next to your brand name on the website. A square picture works best. Optional.">
      <div className="flex flex-wrap items-center gap-5">
        {settings.logoUrl ? (
          <Image src={settings.logoUrl} alt="Your logo" width={72} height={72} className="size-18 rounded-full border border-ink/10 object-cover" />
        ) : (
          <div className="flex size-18 items-center justify-center rounded-full border-2 border-dashed border-ink/20 text-xs text-ink/40">No logo</div>
        )}
        <div className="space-y-3">
          <FileUploader invitationId="site" kind="logo" label={settings.logoUrl ? "Change logo" : "Upload logo"} hint="JPG, PNG or WebP." />
          {settings.logoUrl && (
            <button type="button" disabled={removing} onClick={() => startRemove(async () => { const r = await removeLogoAction(); if (r?.ok) toast.success("Logo removed"); else if (r) toast.error(r.error); })} className="text-sm font-semibold text-red-700 hover:underline">Remove logo</button>
          )}
        </div>
      </div>
    </Card>

    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card title="Brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand name" htmlFor="brandName" error={fieldError(state, "brandName")} hint="Shown on the website and in the “Made with ❤ by …” badge.">
            <input id="brandName" name="brandName" defaultValue={settings.brandName} className="input" />
          </Field>
          <Field label="WhatsApp number" htmlFor="whatsappNumber" error={fieldError(state, "whatsappNumber")} hint="Customers message this number to order. Example: 0321 4317574">
            <input id="whatsappNumber" name="whatsappNumber" defaultValue={formatPhone(settings.whatsappNumber)} className="input" inputMode="tel" />
          </Field>
          <Field label="Tagline" htmlFor="tagline" error={fieldError(state, "tagline")} className="sm:col-span-2">
            <input id="tagline" name="tagline" defaultValue={settings.tagline} className="input" />
          </Field>
        </div>
      </Card>

      <Card title="Prices (Rs)" description="Shown on the homepage. The plan limits (how many events, guests, photos) are set in src/lib/plans.ts.">
        <div className="grid gap-4 sm:grid-cols-3">
          {(["BASIC", "STANDARD", "PREMIUM"] as const).map((k) => (
            <Field key={k} label={k.charAt(0) + k.slice(1).toLowerCase()} htmlFor={`price${k}`} error={fieldError(state, `price${k}`)}>
              <input id={`price${k}`} name={`price${k}`} inputMode="numeric" defaultValue={settings.prices[k]} className="input" />
            </Field>
          ))}
        </div>
      </Card>

      <Card title="Expiry" description="How long an invitation stays online after the last event.">
        <Field label="Days after the last event" htmlFor="defaultExpiryDays" error={fieldError(state, "defaultExpiryDays")}>
          <input id="defaultExpiryDays" name="defaultExpiryDays" inputMode="numeric" defaultValue={settings.defaultExpiryDays} className="input max-w-32" />
        </Field>
      </Card>

      <Card title="Guest message" description="The message customers send to guests from their portal (“Send on WhatsApp”). Customers can edit it before sending.">
        <Field label="Message" htmlFor="shareMessage" error={fieldError(state, "shareMessage")} hint="Keep {name}, {couple} and {link}: they are replaced automatically.">
          <textarea id="shareMessage" name="shareMessage" rows={7} value={message} onChange={(e) => setMessage(e.target.value)} className="input" />
        </Field>
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-semibold tracking-wider text-ink/50 uppercase">Preview</p>
          <pre className="rounded-xl bg-[#dcf8c6] p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {guestMessage(message, { name: "Sarah & Family", couple: "Ahmad & Mawra", link: "https://…/i/ahmad-weds-mawra/k7m2xq9p" })}
          </pre>
        </div>
      </Card>

      {state && !state.ok && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <SubmitButton pending={pending} className="btn-primary w-full sm:w-auto">
        Save settings
      </SubmitButton>
    </form>
    </div>
  );
}
