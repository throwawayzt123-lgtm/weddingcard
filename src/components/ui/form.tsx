"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/action-state";

/** Label + input + hint + error, laid out the same way everywhere. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-ink/60">{hint}</p>
      )}
    </div>
  );
}

/** Submit button that shows a spinner while the form is being sent. */
export function SubmitButton({
  children,
  pendingText = "Saving…",
  className = "btn-primary",
  icon,
  pending: pendingProp,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  icon?: React.ReactNode;
  /** Pass this when the form uses useServerForm; otherwise the button finds out by itself. */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 className="size-5 animate-spin" /> : icon}
      {pending ? pendingText : children}
    </button>
  );
}

/** Shows a toast whenever a form action finishes. */
export function useActionToast(state: ActionState<unknown>) {
  const last = useRef<unknown>(undefined);
  useEffect(() => {
    if (!state || last.current === state) return;
    last.current = state;
    if (state.ok && state.message) toast.success(state.message);
    if (!state.ok) toast.error(state.error);
  }, [state]);
}

/** Pulls the error text for one field out of an action result. */
export function fieldError(state: ActionState<unknown>, name: string): string | undefined {
  return state && !state.ok ? state.fieldErrors?.[name] : undefined;
}

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-ink/15 bg-white px-3 text-sm font-medium text-ink hover:bg-cream ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast.success("Copied");
          setTimeout(() => setCopied(false), 1800);
        } catch {
          toast.error("Could not copy. Please select the text and copy it yourself.");
        }
      }}
    >
      {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}

/** A section card for forms and dashboards. */
export function Card({ title, description, children, className = "" }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      {title && <h2 className="font-serif text-2xl text-maroon">{title}</h2>}
      {description && <p className="mt-1 text-sm text-ink/65">{description}</p>}
      <div className={title ? "mt-5" : ""}>{children}</div>
    </section>
  );
}

/**
 * Runs a server action from a form WITHOUT clearing what the user typed when
 * something fails validation (React normally empties the form after every submit).
 */
export function useServerForm<T = undefined>(action: (prev: ActionState<T>, formData: FormData) => Promise<ActionState<T>>) {
  const [state, dispatch, pending] = useActionState(action, undefined as ActionState<T>);
  const [, startTransition] = useTransition();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return { state, onSubmit, pending };
}
