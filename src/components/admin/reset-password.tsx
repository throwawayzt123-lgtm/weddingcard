"use client";

import { useState, useTransition } from "react";
import { KeyRound, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/confirm-dialog";
import { CopyButton } from "@/components/ui/form";
import { credentialsMessage } from "@/lib/messages";
import { resetPasswordAction } from "@/app/admin/actions";

/** "Reset password" button + pop-up that shows the new password once, with a ready WhatsApp message. */
export function ResetPasswordDialog({
  owner, couple, inviteUrl, loginUrl, small = false,
}: {
  owner: { id: string; name: string; phone: string | null };
  couple: string;
  inviteUrl: string;
  loginUrl: string;
  small?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<{ username: string; password: string } | null>(null);
  const message = creds
    ? credentialsMessage({ customerName: owner.name, couple, loginUrl, inviteUrl, username: creds.username, password: creds.password })
    : "";

  return (
    <Dialog
      title="Reset the customer's password?"
      description={`This creates a new password for ${owner.name} and logs them out everywhere. The old password stops working immediately.`}
      trigger={(open) => (
        <button type="button" className={`btn-secondary ${small ? "!min-h-10 !px-4 !text-sm" : ""}`} onClick={open}>
          <KeyRound className="size-4" /> Reset password
        </button>
      )}
    >
      {(close) =>
        creds ? (
          <div className="space-y-3">
            <dl className="space-y-2 rounded-xl bg-cream/60 p-4 text-sm">
              <div className="flex items-center justify-between gap-2"><dt className="text-ink/60">Username</dt><dd className="font-mono">{creds.username}</dd></div>
              <div className="flex items-center justify-between gap-2"><dt className="text-ink/60">New password</dt><dd className="font-mono text-lg">{creds.password}</dd></div>
            </dl>
            <p className="text-xs text-ink/60">Copy it now: it will not be shown again.</p>
            <div className="flex flex-wrap gap-2">
              {owner.phone && (
                <a className="btn-primary !min-h-11 !bg-[#25a244]" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${owner.phone}?text=${encodeURIComponent(message)}`}>
                  <MessageCircle className="size-4" /> Send on WhatsApp
                </a>
              )}
              <CopyButton text={message} label="Copy message" className="!min-h-11" />
              <button type="button" className="btn-secondary !min-h-11" onClick={() => { setCreds(null); close(); }}>Done</button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary !min-h-11" onClick={close}>Cancel</button>
            <button
              type="button"
              disabled={pending}
              className="btn-primary !min-h-11"
              onClick={() => startTransition(async () => {
                const r = await resetPasswordAction(owner.id);
                if (r?.ok && r.data) setCreds(r.data);
                else toast.error(r && !r.ok ? r.error : "Something went wrong");
              })}
            >
              Create new password
            </button>
          </div>
        )
      }
    </Dialog>
  );
}
