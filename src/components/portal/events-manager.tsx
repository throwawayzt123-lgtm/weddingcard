"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, CalendarPlus, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteEventAction, moveEventAction, saveEventAction } from "@/app/portal/actions";
import { eventIcon } from "@/components/invite-shared/events";
import { Dialog } from "@/components/ui/confirm-dialog";
import { Field, SubmitButton, fieldError, useServerForm } from "@/components/ui/form";
import { formatLongDate, formatTimeRange } from "@/lib/dates";
import { EVENT_LABEL, EVENT_TYPES } from "@/lib/portal-schemas";

export type EventRow = {
  id: string;
  type: (typeof EVENT_TYPES)[number];
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  address: string | null;
  mapUrl: string | null;
  dressCode: string | null;
  notes: string | null;
  /** Another event on the same day sits above / below this one. */
  canMoveUp: boolean;
  canMoveDown: boolean;
};

function EventForm({ invitationId, event, onDone }: { invitationId: string; event: EventRow | null; onDone: () => void }) {
  const { state, onSubmit, pending } = useServerForm(saveEventAction.bind(null, invitationId, event?.id ?? null));
  const [type, setType] = useState<string>(event?.type ?? "MEHNDI");

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message ?? "Saved");
      onDone();
    } else if (state && !state.ok && !state.fieldErrors) {
      toast.error(state.error);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={onSubmit} className="max-h-[70dvh] space-y-4 overflow-y-auto pr-1" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kind of event" htmlFor="ev-type" error={fieldError(state, "type")}>
          <select id="ev-type" name="type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{EVENT_LABEL[t]}</option>)}
          </select>
        </Field>
        <Field label="Title" htmlFor="ev-title" error={fieldError(state, "title")} hint={type === "CUSTOM" ? "e.g. Qawwali Night" : `Leave empty to use “${EVENT_LABEL[type as keyof typeof EVENT_LABEL]}”`}>
          <input id="ev-title" name="title" className="input" defaultValue={event && event.title !== EVENT_LABEL[event.type] ? event.title : ""} maxLength={60} />
        </Field>
        <Field label="Date" htmlFor="ev-date" error={fieldError(state, "date")}>
          <input id="ev-date" name="date" type="date" className="input" defaultValue={event?.date} required />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Starts" htmlFor="ev-start" error={fieldError(state, "startTime")}>
            <input id="ev-start" name="startTime" type="time" className="input" defaultValue={event?.startTime ?? ""} />
          </Field>
          <Field label="Ends (optional)" htmlFor="ev-end" error={fieldError(state, "endTime")}>
            <input id="ev-end" name="endTime" type="time" className="input" defaultValue={event?.endTime ?? ""} />
          </Field>
        </div>
      </div>
      <Field label="Venue name" htmlFor="ev-venue" error={fieldError(state, "venueName")} hint="e.g. Shahi Mahal Banquet">
        <input id="ev-venue" name="venueName" className="input" defaultValue={event?.venueName ?? ""} maxLength={80} />
      </Field>
      <Field label="Full address" htmlFor="ev-address" error={fieldError(state, "address")}>
        <input id="ev-address" name="address" className="input" defaultValue={event?.address ?? ""} maxLength={200} />
      </Field>
      <Field label="Google Maps link (optional)" htmlFor="ev-map" error={fieldError(state, "mapUrl")} hint="Open the place in Google Maps → Share → Copy link. If empty, we search the address for you.">
        <input id="ev-map" name="mapUrl" type="url" inputMode="url" className="input" defaultValue={event?.mapUrl ?? ""} placeholder="https://maps.app.goo.gl/…" />
      </Field>
      <Field label="Dress code / colours (optional)" htmlFor="ev-dress" error={fieldError(state, "dressCode")}>
        <input id="ev-dress" name="dressCode" className="input" defaultValue={event?.dressCode ?? ""} maxLength={80} />
      </Field>
      <Field label="Note for guests (optional)" htmlFor="ev-notes" error={fieldError(state, "notes")} hint="e.g. Baraat arrival at 8:00 pm sharp.">
        <textarea id="ev-notes" name="notes" rows={2} className="input" defaultValue={event?.notes ?? ""} maxLength={300} />
      </Field>
      {state && !state.ok && state.fieldErrors && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" className="btn-secondary !min-h-11" onClick={onDone}>Cancel</button>
        <SubmitButton pending={pending} className="btn-primary !min-h-11">{event ? "Save event" : "Add event"}</SubmitButton>
      </div>
    </form>
  );
}

export function EventsManager({ invitationId, events, limit, planLabel, disabled, upgradeUrl }: { invitationId: string; events: EventRow[]; limit: number | null; planLabel: string; disabled: boolean; upgradeUrl: string }) {
  const [pending, startTransition] = useTransition();
  const atLimit = limit !== null && events.length >= limit;
  const [addKey, setAddKey] = useState(0);

  function run(fn: () => Promise<{ ok: boolean; message?: string; error?: string } | undefined>) {
    startTransition(async () => {
      const r = await fn();
      if (r && !r.ok) toast.error(r.error ?? "Something went wrong");
      else if (r?.message) toast.success(r.message);
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/65">
          {events.length} {limit === null ? "events" : `of ${limit} events`} · {planLabel} plan
        </p>
        <Dialog
          key={addKey}
          title="Add an event"
          description="Add each celebration your guests are invited to."
          trigger={(open) => (
            <button type="button" className="btn-primary" disabled={disabled || atLimit} onClick={open}>
              <Plus className="size-5" /> Add an event
            </button>
          )}
        >
          {(close) => <EventForm invitationId={invitationId} event={null} onDone={() => { close(); setAddKey((k) => k + 1); }} />}
        </Dialog>
      </div>

      {atLimit && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Your {planLabel} plan includes {limit} events and you have used them all.{" "}
          <a href={upgradeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Upgrade — contact us on WhatsApp</a>
        </p>
      )}

      {events.length === 0 ? (
        <div className="card p-10 text-center">
          <CalendarPlus className="mx-auto size-10 text-gold-dark" />
          <p className="mt-3 font-serif text-2xl text-maroon">No events yet</p>
          <p className="mt-1 text-sm text-ink/60">Add your Mehndi, Nikkah, Baraat or Walima. Guests see them with the date, time and a map button.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((e) => {
            const Icon = eventIcon(e.type);
            const time = formatTimeRange(e.startTime, e.endTime);
            return (
              <li key={e.id} className="card p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cream text-maroon"><Icon className="size-6" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-2xl text-maroon">{e.title}</p>
                    <p className="text-sm font-medium">{formatLongDate(e.date)}{time && ` · ${time}`}</p>
                    {(e.venueName || e.address) && (
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-ink/70"><MapPin className="mt-0.5 size-4 shrink-0" />{[e.venueName, e.address].filter(Boolean).join(", ")}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button type="button" aria-label="Move up" disabled={disabled || pending || !e.canMoveUp} onClick={() => run(() => moveEventAction(invitationId, e.id, "up"))} className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-ink/5 disabled:opacity-20"><ArrowUp className="size-4" /></button>
                    <button type="button" aria-label="Move down" disabled={disabled || pending || !e.canMoveDown} onClick={() => run(() => moveEventAction(invitationId, e.id, "down"))} className="flex size-8 items-center justify-center rounded-lg text-ink/50 hover:bg-ink/5 disabled:opacity-20"><ArrowDown className="size-4" /></button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Dialog title={`Edit ${e.title}`} trigger={(open) => <button type="button" disabled={disabled} className="btn-secondary !min-h-10 !px-4 !text-sm" onClick={open}><Pencil className="size-4" /> Edit</button>}>
                    {(close) => <EventForm invitationId={invitationId} event={e} onDone={close} />}
                  </Dialog>
                  <Dialog title={`Delete ${e.title}?`} description="Guests invited to this event will no longer see it, and their replies for it are removed." trigger={(open) => <button type="button" disabled={disabled} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={open}><Trash2 className="size-4" /> Delete</button>}>
                    {(close) => (
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-secondary !min-h-11" onClick={close}>Keep it</button>
                        <button type="button" disabled={pending} className="inline-flex min-h-11 items-center rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-700" onClick={() => { run(() => deleteEventAction(invitationId, e.id)); close(); }}>Yes, delete</button>
                      </div>
                    )}
                  </Dialog>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-ink/50">Events are listed by date. Use the arrows to change the order of events that happen on the same day.</p>
    </div>
  );
}
