"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Minus, Plus, Send } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import type { InvitationViewData, RsvpAnswer, RsvpResult, RsvpSubmission } from "@/templates/types";
import { eventIcon } from "./events";

type Draft = { response: RsvpAnswer | null; headcount: number };

const OPTIONS: { value: RsvpAnswer; label: string }[] = [
  { value: "YES", label: "Attending" },
  { value: "NO", label: "Can't come" },
  { value: "MAYBE", label: "Maybe" },
];

/** RSVP for each event this guest is invited to. Guests can come back and change their answers. */
export function RsvpForm({
  data,
  onRsvp,
}: {
  data: InvitationViewData;
  onRsvp: (submission: RsvpSubmission) => Promise<RsvpResult>;
}) {
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      data.events.map((e) => [e.id, { response: data.rsvps[e.id]?.response ?? null, headcount: data.rsvps[e.id]?.headcount ?? 1 }]),
    ),
  );
  const [message, setMessage] = useState(() => Object.values(data.rsvps).find((r) => r.message)?.message ?? "");
  const [status, setStatus] = useState<{ kind: "idle" } | { kind: "done" } | { kind: "error"; text: string }>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const hadPreviousAnswers = Object.keys(data.rsvps).length > 0;
  const answered = data.events.filter((e) => drafts[e.id]?.response).length;

  function update(id: string, patch: Partial<Draft>) {
    setStatus({ kind: "idle" });
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  function submit() {
    if (answered === 0) {
      setStatus({ kind: "error", text: "Please choose an answer for at least one event." });
      return;
    }
    const answers = data.events
      .filter((e) => drafts[e.id]?.response)
      .map((e) => ({
        eventId: e.id,
        response: drafts[e.id].response as RsvpAnswer,
        // "Can't make it" means 0 people, whatever the counter says.
        headcount: drafts[e.id].response === "NO" ? 0 : drafts[e.id].headcount,
        message: message.trim(),
      }));
    startTransition(async () => {
      const result = await onRsvp({ answers });
      setStatus(result.ok ? { kind: "done" } : { kind: "error", text: result.error });
    });
  }

  return (
    <div className="space-y-5">
      {data.events.map((event) => {
        const draft = drafts[event.id];
        const Icon = eventIcon(event.type);
        return (
          <fieldset key={event.id} className="inv-rsvp-card">
            <legend className="sr-only">{event.title}</legend>
            <div className="flex items-center gap-3">
              <span className="inv-event-icon !size-10">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="inv-event-title !text-xl">{event.title}</p>
                <p className="text-sm opacity-75">{formatLongDate(event.date)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label={`Will you attend ${event.title}?`}>
              {OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={draft.response === o.value}
                  onClick={() => update(event.id, { response: o.value })}
                  className="inv-choice"
                  data-active={draft.response === o.value}
                >
                  {draft.response === o.value && <Check className="size-4" aria-hidden />}
                  {o.label}
                </button>
              ))}
            </div>

            {(draft.response === "YES" || draft.response === "MAYBE") && (
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm">How many people will come?</span>
                <div className="inv-stepper">
                  <button type="button" onClick={() => update(event.id, { headcount: Math.max(1, draft.headcount - 1) })} aria-label="One less person">
                    <Minus className="size-4" />
                  </button>
                  <output aria-live="polite">{draft.headcount}</output>
                  <button type="button" onClick={() => update(event.id, { headcount: Math.min(20, draft.headcount + 1) })} aria-label="One more person">
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </fieldset>
        );
      })}

      <div>
        <label htmlFor="rsvp-message" className="inv-eyebrow mb-2 block text-center">
          A message for the couple (optional)
        </label>
        <textarea
          id="rsvp-message"
          value={message}
          onChange={(e) => { setMessage(e.target.value); setStatus({ kind: "idle" }); }}
          maxLength={500}
          rows={3}
          placeholder="Write your wishes here…"
          className="inv-textarea"
        />
      </div>

      {status.kind === "error" && (
        <p role="alert" className="inv-alert">
          {status.text}
        </p>
      )}
      {status.kind === "done" && (
        <p role="status" className="inv-success">
          <Check className="size-5 shrink-0" aria-hidden />
          {data.mode === "preview"
            ? "This is only a demo, so nothing was saved. On a real invitation, the family receives your reply."
            : "Thank you! Your reply has been sent. You can come back to this page and change it any time."}
        </p>
      )}

      <button type="button" onClick={submit} disabled={pending} className="inv-btn w-full !py-3.5 text-base">
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
        {pending ? "Sending…" : hadPreviousAnswers || status.kind === "done" ? "Update my reply" : "Send my reply"}
      </button>
    </div>
  );
}
