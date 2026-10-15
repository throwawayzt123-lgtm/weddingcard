"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock, Pause, Play, Trash2, CalendarPlus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { Card, Field, SubmitButton, fieldError, useActionToast, useServerForm } from "@/components/ui/form";
import { Dialog } from "@/components/ui/confirm-dialog";
import { ResetPasswordDialog } from "@/components/admin/reset-password";
import { PLAN_KEYS, PLANS } from "@/lib/plans";
import { TEMPLATES } from "@/templates/registry";
import {
  correctNamesAction, deleteInvitationAction, extendExpiryAction, setStatusAction, updateInvitationAction,
} from "@/app/admin/actions";
import { openCustomerPortalAction } from "@/app/portal/actions";

type InvitationData = {
  id: string;
  groomName: string;
  brideName: string;
  templateKey: string;
  plan: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "EXPIRED";
  weddingDate: string; // YYYY-MM-DD
  dateLocked: boolean;
  expiryAuto: boolean;
  expiresAt: string; // YYYY-MM-DD
  showBadge: boolean;
  paymentStatus: "PAID" | "UNPAID";
  paymentAmount: number | null;
  paymentMethod: string | null;
  paymentRef: string | null;
};

// ---------------------------------------------------------------
// Settings (design, plan, status, dates, payment)
// ---------------------------------------------------------------
export function SettingsForm({ inv }: { inv: InvitationData }) {
  const { state, onSubmit, pending } = useServerForm(updateInvitationAction.bind(null, inv.id));
  useActionToast(state);
  const [expiryMode, setExpiryMode] = useState<"auto" | "custom">(inv.expiryAuto ? "auto" : "custom");

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Card title="Design and plan">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Design" htmlFor="templateKey" hint="Changing the design keeps all the customer's details.">
            <select id="templateKey" name="templateKey" defaultValue={inv.templateKey} className="input">
              {TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
            </select>
          </Field>
          <Field label="Plan" htmlFor="plan" hint="Sets the limits for events, guests, photos and RSVP.">
            <select id="plan" name="plan" defaultValue={inv.plan} className="input">
              {PLAN_KEYS.map((k) => <option key={k} value={k}>{PLANS[k].label}</option>)}
            </select>
          </Field>
          <Field label="Status" htmlFor="status" hint="Suspended shows guests a polite “unavailable” page.">
            <select id="status" name="status" defaultValue={inv.status === "EXPIRED" ? "ACTIVE" : inv.status} className="input">
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DRAFT">Draft (hidden)</option>
            </select>
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-ink/10 bg-cream/50 p-4 sm:mt-7">
            <input type="checkbox" name="showBadge" defaultChecked={inv.showBadge} className="mt-1 size-5 accent-maroon" />
            <span className="text-sm"><strong>Show “Made with ❤” badge</strong><br /><span className="text-ink/65">Only Premium invitations can hide it.</span></span>
          </label>
        </div>
      </Card>

      <Card title="Dates">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Main wedding date" htmlFor="weddingDate" error={fieldError(state, "weddingDate")}>
            <input id="weddingDate" name="weddingDate" type="date" defaultValue={inv.weddingDate} className="input" />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-ink/10 bg-cream/50 p-4 sm:mt-7">
            <input type="checkbox" name="dateLocked" defaultChecked={inv.dateLocked} className="mt-1 size-5 accent-maroon" />
            <span className="text-sm"><strong className="flex items-center gap-1.5"><Lock className="size-4" /> Lock the wedding date</strong><span className="text-ink/65">The customer cannot change it.</span></span>
          </label>
        </div>
        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold">Expiry</p>
          <label className="flex items-start gap-3 text-sm">
            <input type="radio" name="expiryMode" value="auto" checked={expiryMode === "auto"} onChange={() => setExpiryMode("auto")} className="mt-1 size-4 accent-maroon" />
            <span><strong>Automatic</strong>: a set number of days after the last event (changes when the customer adds events)</span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input type="radio" name="expiryMode" value="custom" checked={expiryMode === "custom"} onChange={() => setExpiryMode("custom")} className="mt-1 size-4 accent-maroon" />
            <span><strong>Custom date</strong></span>
          </label>
          <Field label="Expires on" htmlFor="expiresAt" error={fieldError(state, "expiresAt")}>
            <input id="expiresAt" name="expiresAt" type="date" defaultValue={inv.expiresAt} disabled={expiryMode === "auto"} className="input max-w-xs" />
          </Field>
        </div>
      </Card>

      <Card title="Payment" description="For your records only.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payment status" htmlFor="paymentStatus">
            <select id="paymentStatus" name="paymentStatus" defaultValue={inv.paymentStatus} className="input">
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
            </select>
          </Field>
          <Field label="Amount (Rs)" htmlFor="paymentAmount" error={fieldError(state, "paymentAmount")}>
            <input id="paymentAmount" name="paymentAmount" inputMode="numeric" defaultValue={inv.paymentAmount ?? ""} className="input" />
          </Field>
          <Field label="Method" htmlFor="paymentMethod">
            <input id="paymentMethod" name="paymentMethod" defaultValue={inv.paymentMethod ?? ""} className="input" />
          </Field>
          <Field label="Reference / note" htmlFor="paymentRef">
            <input id="paymentRef" name="paymentRef" defaultValue={inv.paymentRef ?? ""} className="input" />
          </Field>
        </div>
      </Card>

      {state && !state.ok && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{state.error}</p>}
      <SubmitButton pending={pending} className="btn-primary w-full sm:w-auto">Save changes</SubmitButton>
    </form>
  );
}

// ---------------------------------------------------------------
// Correct the locked names
// ---------------------------------------------------------------
export function CorrectNamesCard({ inv }: { inv: Pick<InvitationData, "id" | "groomName" | "brideName"> }) {
  const { state, onSubmit, pending } = useServerForm(correctNamesAction.bind(null, inv.id));
  useActionToast(state);
  const dupWarning = state && !state.ok && state.fieldErrors?.confirmDuplicate;

  return (
    <Card title="Correct the couple's names" description="The names are locked for the customer. Only you can fix a spelling mistake. Every change is saved in the audit log.">
      <Dialog
        title="Change the locked names?"
        description="The web address stays the same, so links already shared on WhatsApp keep working. The old and new names are saved in the audit log."
        trigger={(open) => <button type="button" onClick={open} className="btn-secondary"><Lock className="size-4" /> Correct names…</button>}
      >
        {(close) => (
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className="space-y-4"
            noValidate
          >
            <Field label="Groom's name" htmlFor="cn-groom" error={fieldError(state, "groomName")}>
              <input id="cn-groom" name="groomName" defaultValue={inv.groomName} className="input" autoComplete="off" />
            </Field>
            <Field label="Bride's name" htmlFor="cn-bride" error={fieldError(state, "brideName")}>
              <input id="cn-bride" name="brideName" defaultValue={inv.brideName} className="input" autoComplete="off" />
            </Field>
            <Field label="Reason (optional)" htmlFor="cn-reason" hint="e.g. “Customer reported a spelling mistake on WhatsApp”">
              <input id="cn-reason" name="reason" className="input" />
            </Field>
            {dupWarning && (
              <label className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-900">
                <input type="checkbox" name="confirmDuplicate" className="size-5 accent-maroon" />
                Another invitation already uses these names. Continue anyway.
              </label>
            )}
            {state && !state.ok && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
            {state?.ok && <p className="text-sm font-medium text-green-700">{state.message}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={close} className="btn-secondary !min-h-11">{state?.ok ? "Close" : "Cancel"}</button>
              <SubmitButton pending={pending} pendingText="Saving…" className="btn-primary !min-h-11">Confirm change</SubmitButton>
            </div>
          </form>
        )}
      </Dialog>
    </Card>
  );
}

// ---------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------
export function QuickActions({
  inv, owner, siteUrl,
}: {
  inv: { id: string; status: InvitationData["status"]; groomName: string; brideName: string; slug: string };
  owner: { id: string; name: string; username: string; phone: string | null };
  siteUrl: string;
}) {
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; message?: string; error?: string } | undefined>) {
    startTransition(async () => {
      const r = await fn();
      if (r?.ok) toast.success(r.message ?? "Done");
      else toast.error(r && !r.ok ? (r as { error: string }).error : "Something went wrong");
    });
  }

  const suspended = inv.status === "SUSPENDED";

  return (
    <Card title="Quick actions">
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={pending} className="btn-secondary" onClick={() => run(() => setStatusAction(inv.id, suspended ? "ACTIVE" : "SUSPENDED"))}>
          {suspended ? <Play className="size-4" /> : <Pause className="size-4" />}
          {suspended ? "Activate" : "Suspend"}
        </button>
        <button type="button" disabled={pending} className="btn-secondary" onClick={() => run(() => extendExpiryAction(inv.id, 7))}>
          <CalendarPlus className="size-4" /> Extend +7 days
        </button>
        <button type="button" disabled={pending} className="btn-secondary" onClick={() => run(() => extendExpiryAction(inv.id, 30))}>
          <CalendarPlus className="size-4" /> Extend +30 days
        </button>

        <ResetPasswordDialog owner={owner} couple={`${inv.groomName} & ${inv.brideName}`} inviteUrl={`${siteUrl}/i/${inv.slug}`} loginUrl={`${siteUrl}/login`} />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------
// Delete
// ---------------------------------------------------------------
export function DeleteCard({ id, names }: { id: string; names: string }) {
  const { state, onSubmit, pending } = useServerForm(deleteInvitationAction.bind(null, id));
  useActionToast(state);
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5 sm:p-6">
      <h2 className="flex items-center gap-2 font-serif text-2xl text-red-800"><AlertTriangle className="size-5" /> Danger zone</h2>
      <p className="mt-1 text-sm text-red-900/75">Deleting removes the invitation, its guests, RSVPs and photos for good. The customer&apos;s login is kept.</p>
      <Dialog
        title={`Delete ${names}?`}
        description="This cannot be undone. The deletion is recorded in the audit log."
        trigger={(open) => <button type="button" onClick={open} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-300 bg-white px-5 font-semibold text-red-700 hover:bg-red-100"><Trash2 className="size-4" /> Delete invitation…</button>}
      >
        {(close) => (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Field label="Type DELETE to confirm" htmlFor="del-confirm" error={fieldError(state, "confirm")}>
              <input id="del-confirm" name="confirm" className="input" autoComplete="off" />
            </Field>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={close} className="btn-secondary !min-h-11">Cancel</button>
              <SubmitButton pending={pending} pendingText="Deleting…" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700">Delete for good</SubmitButton>
            </div>
          </form>
        )}
      </Dialog>
    </section>
  );
}

/** Opens the customer portal so you can see (and fix) what they see. */
export function OpenPortalButton({ invitationId }: { invitationId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="btn-secondary"
      onClick={() =>
        startTransition(async () => {
          const r = await openCustomerPortalAction(invitationId);
          if (r?.ok) router.push("/portal");
          else toast.error(r ? r.error : "Something went wrong");
        })
      }
    >
      <UserCog className="size-4" /> Open customer portal
    </button>
  );
}
