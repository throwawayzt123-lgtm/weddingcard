import type { Metadata } from "next";
import { requireAdmin } from "@/lib/dal";
import { getSettings } from "@/lib/settings";
import { PasswordForm } from "@/app/portal/account/password-form";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div>
      <h1 className="font-serif text-3xl sm:text-4xl">Settings</h1>
      <p className="mt-1 mb-6 text-sm text-ink/60">Your brand and contact details. Changes appear on the website straight away.</p>
      <SettingsForm settings={settings} />
      <h2 className="mt-10 mb-4 font-serif text-2xl text-ink">Your admin account</h2>
      <PasswordForm />
    </div>
  );
}
