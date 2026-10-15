import "server-only";
import { cache } from "react";
import type { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";
import { SITE } from "@/lib/site";

// Site-wide settings the owner edits in Admin → Settings. They live in the
// `Setting` table (one JSON value per key). Anything not saved yet falls back
// to the defaults in lib/site.ts and lib/plans.ts.

export type SiteSettings = {
  brandName: string;
  tagline: string;
  /** Logo image URL (Cloudinary), or null to show the brand name as text. */
  logoUrl: string | null;
  /** Digits only, international format, e.g. 923214317574 */
  whatsappNumber: string;
  /** How the number is shown to people, e.g. "+92 321 4317574" */
  whatsappDisplay: string;
  defaultExpiryDays: number;
  /** Message template for the guest "Send on WhatsApp" button. {name} {couple} {link} are replaced. */
  shareMessage: string;
  /** Prices in PKR shown on the homepage. */
  prices: Record<Plan, number>;
};

export const DEFAULT_SHARE_MESSAGE =
  "Assalam-o-Alaikum {name}! 🌸\n\nYou are warmly invited to the wedding of {couple}.\n\nPlease open your personal invitation here:\n{link}\n\n(Turn your sound on for the full experience.)";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: SITE.brandName,
  tagline: SITE.tagline,
  logoUrl: null,
  whatsappNumber: SITE.whatsappNumber,
  whatsappDisplay: SITE.whatsappDisplay,
  defaultExpiryDays: SITE.defaultExpiryDays,
  shareMessage: DEFAULT_SHARE_MESSAGE,
  prices: { BASIC: PLANS.BASIC.pricePkr, STANDARD: PLANS.STANDARD.pricePkr, PREMIUM: PLANS.PREMIUM.pricePkr },
};

/** Reads all settings. Never throws: if the database is unreachable the defaults are used. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.setting.findMany();
    const stored: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        stored[row.key] = JSON.parse(row.value);
      } catch {
        // ignore a corrupted row
      }
    }
    const s = { ...DEFAULT_SETTINGS } as Record<string, unknown>;
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (stored[key] !== undefined && stored[key] !== null && stored[key] !== "") s[key] = stored[key];
    }
    return {
      ...(s as SiteSettings),
      prices: { ...DEFAULT_SETTINGS.prices, ...((stored.prices as Partial<Record<Plan, number>> | undefined) ?? {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
});

/** Saves the given settings (only the keys provided). */
export async function saveSettings(values: Partial<SiteSettings>): Promise<void> {
  await prisma.$transaction(
    Object.entries(values)
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value: JSON.stringify(value) },
          update: { value: JSON.stringify(value) },
        }),
      ),
  );
}

/** wa.me link using the settings' number. */
export function waLink(settings: Pick<SiteSettings, "whatsappNumber">, text?: string): string {
  const base = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
