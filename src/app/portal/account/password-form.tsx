"use client";

import { changePasswordAction } from "@/app/portal/actions";
import { Card, Field, SubmitButton, fieldError, useActionToast, useServerForm } from "@/components/ui/form";

export function PasswordForm() {
  const { state, onSubmit, pending } = useServerForm(changePasswordAction);
  useActionToast(state);

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card title="Change your password" description="After changing it you will be asked to log in again.">
        <div className="max-w-md space-y-4">
          <Field label="Current password" htmlFor="currentPassword" error={fieldError(state, "currentPassword")}>
            <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" className="input" />
          </Field>
          <Field label="New password" htmlFor="newPassword" error={fieldError(state, "newPassword")} hint="At least 8 characters.">
            <input id="newPassword" name="newPassword" type="password" autoComplete="new-password" className="input" />
          </Field>
          <Field label="New password again" htmlFor="confirmPassword" error={fieldError(state, "confirmPassword")}>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className="input" />
          </Field>
          {state && !state.ok && !state.fieldErrors && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
          <SubmitButton pending={pending} pendingText="Saving…">Change password</SubmitButton>
        </div>
      </Card>
    </form>
  );
}
