"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Copy, Eye, FileUp, Loader2, MessageCircle, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { addGuestAction, bulkAddGuestsAction, deleteGuestAction, updateGuestAction } from "@/app/portal/guest-actions";
import { Dialog } from "@/components/ui/confirm-dialog";
import { Field } from "@/components/ui/form";
import type { BulkResult } from "@/lib/guests";
import { guestMessage } from "@/lib/messages";

export type GuestRow = {
  id: string;
  displayName: string;
  phone: string | null;
  code: string;
  openCount: number;
  eventIds: string[];
  replies: { yes: number; no: number; maybe: number };
};
export type EventOption = { id: string; title: string };

const TEMPLATE_KEY = "wc_guest_message";

function GuestForm({ initial, events, onSubmit, onDone, submitLabel }: {
  initial?: GuestRow;
  events: EventOption[];
  onSubmit: (v: { displayName: string; phone: string; eventIds: string[] }) => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined>;
  onDone: () => void;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial?.displayName ?? "");
  const [phone, setPhone] = useState(initial?.phone ? `+${initial.phone}` : "");
  const [picked, setPicked] = useState<string[]>(initial ? initial.eventIds : events.map((e) => e.id));
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const r = await onSubmit({ displayName: name, phone, eventIds: picked });
      if (r?.ok) {
        toast.success(initial ? "Guest updated" : "Guest added");
        onDone();
        if (!initial) { setName(""); setPhone(""); }
      } else {
        setErrors(r?.fieldErrors ?? {});
        toast.error(r?.error ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <Field label="Guest name" htmlFor="g-name" error={errors.displayName} hint="Exactly how it should appear: “Dear …,” e.g. Sarah & Family">
        <input id="g-name" value={name} onChange={(e) => setName(e.target.value)} className="input" maxLength={80} autoComplete="off" />
      </Field>
      <Field label="WhatsApp number (optional)" htmlFor="g-phone" error={errors.phone} hint="So the Send button opens their chat directly. e.g. 0300 1234567">
        <input id="g-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" inputMode="tel" maxLength={30} autoComplete="off" />
      </Field>
      {events.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Invited to</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((ev) => (
              <label key={ev.id} className="flex min-h-12 items-center gap-3 rounded-xl border border-ink/10 px-3.5 text-sm font-medium">
                <input type="checkbox" className="size-5 accent-maroon" checked={picked.includes(ev.id)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, ev.id] : p.filter((x) => x !== ev.id)))} />
                {ev.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn-secondary !min-h-11" onClick={onDone}>Cancel</button>
        <button type="submit" disabled={pending} className="btn-primary !min-h-11">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function BulkImport({ invitationId, events, onDone }: { invitationId: string; events: EventOption[]; onDone: () => void }) {
  const [text, setText] = useState("");
  const [picked, setPicked] = useState<string[]>(events.map((e) => e.id));
  const [result, setResult] = useState<BulkResult | null>(null);
  const [pending, startTransition] = useTransition();
  const file = useRef<HTMLInputElement>(null);

  return (
    <div className="max-h-[70dvh] space-y-4 overflow-y-auto pr-1">
      {result ? (
        <div className="space-y-3">
          <p className={`rounded-xl p-4 text-sm font-medium ${result.added ? "bg-green-50 text-green-900" : "bg-amber-50 text-amber-900"}`}>
            {result.added} added{result.skipped ? `, ${result.skipped} skipped` : ""}.
          </p>
          {result.notes.length > 0 && (
            <ul className="max-h-40 list-disc space-y-1 overflow-y-auto rounded-xl bg-cream/60 p-4 pl-8 text-xs text-ink/75">
              {result.notes.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
          <div className="flex justify-end"><button type="button" className="btn-primary !min-h-11" onClick={onDone}>Done</button></div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink/70">
            One guest per line: <strong>name, phone, events</strong>. Phone and events are optional. For events write names separated by <code>|</code> (for example <code>Mehndi|Walima</code>) or <code>all</code>.
          </p>
          <pre className="rounded-xl bg-ink/5 p-3 text-xs leading-relaxed">{`Sarah & Family, 0300 1112233, all
Uncle Asif, 0321 4445566, Nikkah|Walima
Hina`}</pre>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className="input font-mono text-sm" placeholder="Paste your list here…" />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary !min-h-10 !text-sm" onClick={() => file.current?.click()}><FileUp className="size-4" /> Choose a CSV file</button>
            <input ref={file} type="file" accept=".csv,.txt,text/csv,text/plain" className="sr-only" tabIndex={-1} onChange={async (e) => { const f = e.target.files?.[0]; if (f) setText(await f.text()); e.target.value = ""; }} />
          </div>
          {events.length > 0 && (
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">Guests with no events listed are invited to</legend>
              <div className="flex flex-wrap gap-2">
                {events.map((ev) => (
                  <label key={ev.id} className="flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-3.5 text-sm">
                    <input type="checkbox" className="size-4 accent-maroon" checked={picked.includes(ev.id)} onChange={(e) => setPicked((p) => (e.target.checked ? [...p, ev.id] : p.filter((x) => x !== ev.id)))} />
                    {ev.title}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary !min-h-11" onClick={onDone}>Cancel</button>
            <button type="button" disabled={pending || !text.trim()} className="btn-primary !min-h-11" onClick={() => startTransition(async () => {
              const r = await bulkAddGuestsAction(invitationId, text, picked);
              if (r?.ok && r.data) setResult(r.data);
              else toast.error(r && !r.ok ? r.error : "Something went wrong");
            })}>
              {pending && <Loader2 className="size-4 animate-spin" />} Import guests
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function GuestsManager({
  invitationId, slug, siteUrl, couple, guests, events, defaultMessage, usage, disabled, upgradeUrl, rsvpEnabled,
}: {
  invitationId: string;
  slug: string;
  siteUrl: string;
  couple: string;
  guests: GuestRow[];
  events: EventOption[];
  defaultMessage: string;
  usage: { used: number; limit: number | null };
  disabled: boolean;
  upgradeUrl: string;
  rsvpEnabled: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [template, setTemplate] = useState(defaultMessage);
  const [copied, setCopied] = useState<string | null>(null);
  const atLimit = usage.limit !== null && usage.used >= usage.limit;

  // The customer's own wording is remembered on this phone/computer.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEMPLATE_KEY);
      if (saved) setTemplate(saved);
    } catch {}
  }, []);
  function saveTemplate(value: string) {
    setTemplate(value);
    try { localStorage.setItem(TEMPLATE_KEY, value); } catch {}
  }

  const linkFor = (g: GuestRow) => `${siteUrl}/i/${slug}/${g.code}`;
  const messageFor = (g: GuestRow) => guestMessage(template, { name: g.displayName, couple, link: linkFor(g) });
  const waHref = (g: GuestRow) => `https://wa.me/${g.phone ?? ""}?text=${encodeURIComponent(messageFor(g))}`;

  async function copy(g: GuestRow) {
    try {
      await navigator.clipboard.writeText(linkFor(g));
      setCopied(g.id);
      toast.success(`Link for ${g.displayName} copied`);
      setTimeout(() => setCopied((c) => (c === g.id ? null : c)), 1800);
    } catch {
      toast.error("Could not copy. Please try again.");
    }
  }

  const eventTitle = (id: string) => events.find((e) => e.id === id)?.title;

  return (
    <div className="space-y-5">
      <div className="card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{usage.used} / {usage.limit ?? "Unlimited"} guest links used</p>
            {usage.limit !== null && (
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-cream">
                <div className={`h-full rounded-full ${atLimit ? "bg-amber-500" : "bg-maroon/70"}`} style={{ width: `${Math.min(100, (usage.used / Math.max(1, usage.limit)) * 100)}%` }} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog title="Add a guest" description="Each guest gets their own personal link." trigger={(open) => <button type="button" disabled={disabled || atLimit} onClick={open} className="btn-primary"><Plus className="size-5" /> Add a guest</button>}>
              {(close) => <GuestForm events={events} submitLabel="Add guest" onDone={close} onSubmit={(v) => addGuestAction(invitationId, v) as never} />}
            </Dialog>
            <Dialog title="Add many guests at once" trigger={(open) => <button type="button" disabled={disabled || atLimit} onClick={open} className="btn-secondary"><Users className="size-5" /> Paste a list</button>}>
              {(close) => <BulkImport invitationId={invitationId} events={events} onDone={close} />}
            </Dialog>
          </div>
        </div>
        {atLimit && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            You have used all the guest links in your plan. <a href={upgradeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Upgrade — contact us on WhatsApp</a>
          </p>
        )}
      </div>

      <details className="card p-4 sm:p-5">
        <summary className="cursor-pointer font-semibold text-maroon">Edit the WhatsApp message</summary>
        <p className="mt-2 text-xs text-ink/60">Used by the green Send buttons. {"{name}"}, {"{couple}"} and {"{link}"} are filled in for each guest. You can also change it in WhatsApp before sending.</p>
        <textarea value={template} onChange={(e) => saveTemplate(e.target.value)} rows={7} className="input mt-3" />
        <button type="button" className="mt-2 text-xs font-semibold text-maroon underline" onClick={() => { saveTemplate(defaultMessage); try { localStorage.removeItem(TEMPLATE_KEY); } catch {} }}>Use the standard message again</button>
        {guests[0] && <pre className="mt-3 rounded-xl bg-[#dcf8c6] p-3 font-sans text-xs whitespace-pre-wrap">{messageFor(guests[0])}</pre>}
      </details>

      {guests.length === 0 ? (
        <div className="card p-10 text-center">
          <Users className="mx-auto size-10 text-gold-dark" />
          <p className="mt-3 font-serif text-2xl text-maroon">No guests found</p>
          <p className="mt-1 text-sm text-ink/60">Add guests one by one, or paste a whole list. Each guest gets a link that greets them by name.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {guests.map((g) => (
            <li key={g.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-serif text-2xl text-maroon">{g.displayName}</p>
                  <p className="text-sm text-ink/60">{g.phone ? `+${g.phone}` : "No phone number"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${g.openCount > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    <Eye className="size-3.5" />
                    {g.openCount > 0 ? `Opened${g.openCount > 1 ? ` ${g.openCount}×` : ""}` : "Not opened"}
                  </span>
                  {rsvpEnabled && (g.replies.yes + g.replies.no + g.replies.maybe > 0 ? (
                    <span className="rounded-full bg-cream px-2.5 py-1 text-maroon">
                      {g.replies.yes > 0 && `${g.replies.yes} yes`}{g.replies.yes > 0 && g.replies.no + g.replies.maybe > 0 && " · "}
                      {g.replies.no > 0 && `${g.replies.no} no`}{g.replies.no > 0 && g.replies.maybe > 0 && " · "}
                      {g.replies.maybe > 0 && `${g.replies.maybe} maybe`}
                    </span>
                  ) : <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">No reply</span>)}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {g.eventIds.length === 0 && <span className="text-xs text-amber-700">Not invited to any event yet</span>}
                {g.eventIds.map((id) => eventTitle(id) && <span key={id} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-xs">{eventTitle(id)}</span>)}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a href={waHref(g)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#25a244] px-4 text-sm font-bold text-white hover:bg-[#1e8a39]">
                  <MessageCircle className="size-4" /> Send on WhatsApp
                </a>
                <button type="button" onClick={() => copy(g)} className="btn-secondary !min-h-11 !px-4 !text-sm">
                  {copied === g.id ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />} Copy link
                </button>
                <Dialog title={`Edit ${g.displayName}`} trigger={(open) => <button type="button" disabled={disabled} onClick={open} className="btn-secondary !min-h-11 !px-4 !text-sm"><Pencil className="size-4" /> Edit</button>}>
                  {(close) => <GuestForm initial={g} events={events} submitLabel="Save" onDone={close} onSubmit={(v) => updateGuestAction(invitationId, g.id, v) as never} />}
                </Dialog>
                <Dialog title={`Delete ${g.displayName}?`} description="Their personal link will stop working and their replies are removed." trigger={(open) => <button type="button" disabled={disabled} onClick={open} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 className="size-4" /> Delete</button>}>
                  {(close) => (
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-secondary !min-h-11" onClick={close}>Keep</button>
                      <button type="button" disabled={pending} className="inline-flex min-h-11 items-center rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700" onClick={() => { startTransition(async () => { const r = await deleteGuestAction(invitationId, g.id); if (r?.ok) toast.success("Guest deleted"); else if (r) toast.error(r.error); }); close(); }}>Yes, delete</button>
                    </div>
                  )}
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
