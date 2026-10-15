import type { Metadata } from "next";
import { PasswordForm } from "./password-form";
import { getPortalContext } from "@/lib/portal";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const { user } = await getPortalContext();
  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Account</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">
        Logged in as <strong>{user.username}</strong>.
      </p>
      <PasswordForm />
    </div>
  );
}
