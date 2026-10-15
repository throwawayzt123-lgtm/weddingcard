"use client";

import { useTransition } from "react";
import { selectInvitationAction } from "@/app/portal/actions";

/** Only shown when a customer has more than one invitation. */
export function SwitchInvitation({ current, options }: { current: string; options: { id: string; label: string }[] }) {
  const [pending, startTransition] = useTransition();
  return (
    <label className="block text-sm font-semibold">
      Invitation
      <select
        className="input mt-1.5"
        value={current}
        disabled={pending}
        onChange={(e) => startTransition(async () => { await selectInvitationAction(e.target.value); })}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
