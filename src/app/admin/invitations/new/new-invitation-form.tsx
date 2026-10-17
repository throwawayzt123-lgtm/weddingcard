"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ExternalLink, Lock, MessageCircle, PlusCircle } from "lucide-react";
import { Card, CopyButton, Field, SubmitButton, fieldError, useActionToast, useServerForm } from "@/components/ui/form";
import { credentialsMessage } from "@/lib/messages";
import { PLAN_KEYS, PLANS } from "@/lib/plans";
import { TEMPLATES } from "@/templates/registry";
import { createInvitationAction, type CreatedPayload, type DuplicatePayload } from "../../actions";

type Client = { id: string; name: string; phone: string | null };

function isCreated(data: unknown): data is CreatedPayload {
  return !!data && typeof data === "object" && "invitationId" in data;
}
function isDuplicate(data: unknown): data is DuplicatePayload {
  return !!data && typeof data === "object" && "duplicates" in data;
}

export function NewInvitationForm({ clients, siteUrl, defaultExpiryDays }: { clients: Client[]; siteUrl: string; defaultExpiryDays: number }) {
  const { state, onSubmit, pending } = useServerForm(createInvitationAction);
  useActionToast(state);
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [plan, setPlan] = useState("STANDARD");
  const [paid, setPaid] = useState("UNPAID");
  const [amount, setAmount] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const created = state?.ok && isCreated(state.data) ? state.data : null;
  const duplicates = state && !state.ok && isDuplicate(state.data) ? state.data.duplicates : null;

  if (created) {
    return <CreatedPanel created={created} siteUrl={siteUrl} onAnother={() => setResetKey((k) => k + 1)} />;
  }

  return (
    <form key={resetKey} onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* 1. Design */}
      <Card title="1. Choose the design" description="The design the customer picked from the demos.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup">
          {TEMPLATES.map((t, i) => (
            <label key={t.key} className="group cursor-pointer">
              <input type="radio" name="templateKey" value={t.key} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block overflow-hidden rounded-2xl border-2 border-ink/10 bg-white transition peer-checked:border-maroon peer-checked:shadow-lg peer-focus-visible:outline-2 peer-focus-visible:outline-maroon">
                <span className="relative block aspect-[9/14] bg-cream">
                  <Image src={t.thumbnail} alt="" fill sizes="200px" className="object-cover object-top" />
                </span>
                <span className="block p-3 text-center font-serif text-lg text-maroon">{t.name}</span>
              </span>
            </label>
          ))}
        </div>
        {fieldError(state, "templateKey") && <p className="mt-2 text-sm font-medium text-red-600">{fieldError(state, "templateKey")}</p>}
      </Card>

      {/* 2. Couple */}
      <Card title="2. The couple" description="These names become LOCKED. The customer can never change them. Check the spelling carefully.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Groom's name" htmlFor="groomName" error={fieldError(state, "groomName")} hint="e.g. Ahmad">
            <input id="groomName" name="groomName" className="input" autoComplete="off" required />
          </Field>
          <Field label="Bride's name" htmlFor="brideName" error={fieldError(state, "brideName")} hint="e.g. Sara">
            <input id="brideName" name="brideName" className="input" autoComplete="off" required />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Main wedding date" htmlFor="weddingDate" error={fieldError(state, "weddingDate")} hint="Usually the Baraat or Nikkah day.">
            <input id="weddingDate" name="weddingDate" type="date" className="input" required />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-ink/10 bg-cream/50 p-4 sm:mt-7">
            <input type="checkbox" name="dateLocked" defaultChecked className="mt-1 size-5 accent-maroon" />
            <span className="text-sm">
              <strong className="flex items-center gap-1.5"><Lock className="size-4" /> Lock the wedding date</strong>
              <span className="text-ink/65">The customer cannot change this date. They can still edit times and venues.</span>
            </span>
          </label>
        </div>
      </Card>

      {/* 3. Plan & expiry */}
      <Card title="3. Plan and expiry">
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup">
          {PLAN_KEYS.map((key) => (
            <label key={key} className="cursor-pointer">
              <input type="radio" name="plan" value={key} checked={plan === key} onChange={() => { setPlan(key); if (!amount) setAmount(String(PLANS[key].pricePkr)); }} className="peer sr-only" />
              <span className="block rounded-2xl border-2 border-ink/10 p-4 transition peer-checked:border-maroon peer-checked:bg-cream/60">
                <span className="font-serif text-xl text-maroon">{PLANS[key].label}</span>
                <span className="block text-sm font-semibold">Rs {(PLANS[key].pricePkr).toLocaleString("en-PK")}</span>
                <span className="mt-1 block text-xs text-ink/60">{PLANS[key].blurb}</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Expiry date (optional)" htmlFor="expiresAt" error={fieldError(state, "expiresAt")} hint={`Leave empty and it will expire ${defaultExpiryDays} days after the last event (updates automatically when events are added).`}>
            <input id="expiresAt" name="expiresAt" type="date" className="input max-w-xs" />
          </Field>
        </div>
      </Card>

      {/* 4. Payment */}
      <Card title="4. Payment" description="For your own records. The customer does not see this.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payment status" htmlFor="paymentStatus">
            <select id="paymentStatus" name="paymentStatus" className="input" value={paid} onChange={(e) => setPaid(e.target.value)}>
              <option value="UNPAID">Unpaid (waiting for payment)</option>
              <option value="PAID">Paid</option>
            </select>
          </Field>
          <Field label="Amount (Rs)" htmlFor="paymentAmount" error={fieldError(state, "paymentAmount")}>
            <input id="paymentAmount" name="paymentAmount" inputMode="numeric" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={String(PLANS[plan as keyof typeof PLANS]?.pricePkr ?? "")} />
          </Field>
          <Field label="Payment method" htmlFor="paymentMethod">
            <input id="paymentMethod" name="paymentMethod" className="input" placeholder="JazzCash, EasyPaisa, Bank transfer…" />
          </Field>
          <Field label="Reference / note" htmlFor="paymentRef">
            <input id="paymentRef" name="paymentRef" className="input" placeholder="Transaction ID or note" />
          </Field>
        </div>
      </Card>

      {/* 5. Customer */}
      <Card title="5. The customer" description="We create their login automatically and give you a WhatsApp message to send.">
        <div className="mb-4 inline-flex rounded-xl border border-ink/15 bg-white p-1" role="radiogroup">
          {(["new", "existing"] as const).map((m) => (
            <label key={m} className="cursor-pointer">
              <input type="radio" name="customerMode" value={m} checked={mode === m} onChange={() => setMode(m)} className="peer sr-only" />
              <span className="block rounded-lg px-4 py-2 text-sm font-semibold text-ink/70 peer-checked:bg-maroon peer-checked:text-white">{m === "new" ? "New customer" : "Existing customer"}</span>
            </label>
          ))}
        </div>

        {mode === "new" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Customer name" htmlFor="customerName" error={fieldError(state, "customerName")} hint="Who we are talking to, e.g. Mr. Khalid Mehmood">
              <input id="customerName" name="customerName" className="input" autoComplete="off" />
            </Field>
            <Field label="WhatsApp number" htmlFor="customerPhone" error={fieldError(state, "customerPhone")} hint="e.g. 0300 1234567">
              <input id="customerPhone" name="customerPhone" type="tel" inputMode="tel" className="input" autoComplete="off" />
            </Field>
            <Field label="Email (optional)" htmlFor="customerEmail" error={fieldError(state, "customerEmail")} className="sm:col-span-2">
              <input id="customerEmail" name="customerEmail" type="email" className="input" autoComplete="off" />
            </Field>
          </div>
        ) : (
          <Field label="Choose the customer" htmlFor="existingOwnerId" error={fieldError(state, "existingOwnerId")} hint="For someone who has bought from you before.">
            <select id="existingOwnerId" name="existingOwnerId" className="input" defaultValue="">
              <option value="" disabled>Select…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.phone ? ` (+${c.phone})` : ""}
                </option>
              ))}
            </select>
          </Field>
        )}
      </Card>

      {duplicates && (
        <div role="alert" className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-5">
          <p className="flex items-center gap-2 font-semibold text-amber-900">
            <AlertTriangle className="size-5" />
            An invitation for this couple already exists
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-900">
            {duplicates.map((d) => (
              <li key={d.id}>
                <Link href={`/admin/invitations/${d.id}`} className="font-semibold underline" target="_blank">
                  {d.groomName} &amp; {d.brideName}
                </Link>{" "}
                (customer: {d.owner} /i/{d.slug})
              </li>
            ))}
          </ul>
          <label className="mt-3 flex items-center gap-3 text-sm font-medium text-amber-900">
            <input type="checkbox" name="confirmDuplicate" className="size-5 accent-maroon" />
            I checked: this is a different wedding, create it anyway
          </label>
        </div>
      )}

      {state && !state.ok && !duplicates && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</p>}

      <div className="sticky bottom-20 z-10 lg:bottom-4">
        <SubmitButton pending={pending} pendingText="Creating…" className="btn-primary w-full shadow-xl sm:w-auto" icon={<PlusCircle className="size-5" />}>
          Create invitation &amp; customer login
        </SubmitButton>
      </div>
    </form>
  );
}

/** Shown after the invitation is created: credentials, links and the WhatsApp message. */
function CreatedPanel({ created, siteUrl, onAnother }: { created: CreatedPayload; siteUrl: string; onAnother: () => void }) {
  const inviteUrl = `${siteUrl}/i/${created.slug}`;
  const loginUrl = `${siteUrl}/login`;
  const coupleName = `${created.groomName} & ${created.brideName}`;
  const message = credentialsMessage({
    customerName: created.ownerName,
    couple: coupleName,
    loginUrl,
    inviteUrl,
    username: created.credentials?.username ?? "(your existing username)",
    password: created.credentials?.password ?? null,
  });
  const waHref = created.ownerPhone ? `https://wa.me/${created.ownerPhone}?text=${encodeURIComponent(message)}` : null;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
        <p className="font-serif text-2xl text-green-900">Invitation created 🎉</p>
        <p className="mt-1 text-sm text-green-900/80">Send the details below to {created.ownerName}. {created.credentials && "The password is shown only now: copy it before you leave this page."}</p>
      </div>

      {created.credentials && (
        <Card title="Customer login">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-cream/60 p-4">
              <dt className="text-xs font-semibold tracking-wider text-ink/50 uppercase">Username</dt>
              <dd className="mt-1 flex items-center justify-between gap-2 font-mono text-lg">{created.credentials.username}<CopyButton text={created.credentials.username} /></dd>
            </div>
            <div className="rounded-xl bg-cream/60 p-4">
              <dt className="text-xs font-semibold tracking-wider text-ink/50 uppercase">Password</dt>
              <dd className="mt-1 flex items-center justify-between gap-2 font-mono text-lg">{created.credentials.password}<CopyButton text={created.credentials.password} /></dd>
            </div>
          </dl>
        </Card>
      )}

      <Card title="Message for the customer" description="Ready to send. It contains the login details and their invitation link.">
        <pre className="max-h-64 overflow-auto rounded-xl bg-ink/5 p-4 font-sans text-sm leading-relaxed whitespace-pre-wrap">{message}</pre>
        <div className="mt-4 flex flex-wrap gap-2">
          {waHref ? (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary !bg-[#25a244] hover:!bg-[#1e8a39]">
              <MessageCircle className="size-5" />
              Send on WhatsApp
            </a>
          ) : (
            <p className="text-sm text-ink/60">This customer has no phone number saved, so copy the message instead.</p>
          )}
          <CopyButton text={message} label="Copy message" className="!min-h-12 !px-4" />
        </div>
      </Card>

      <Card title="Links">
        <ul className="space-y-3 text-sm">
          <li className="flex flex-wrap items-center justify-between gap-2"><span className="break-all">{inviteUrl}</span><span className="flex gap-2"><CopyButton text={inviteUrl} /><a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium hover:bg-cream"><ExternalLink className="size-4" />Open</a></span></li>
        </ul>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href={`/admin/invitations/${created.invitationId}`} className="btn-primary">Manage this invitation</Link>
        <button type="button" onClick={onAnother} className="btn-secondary">Create another</button>
      </div>
    </div>
  );
}
