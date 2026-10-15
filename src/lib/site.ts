// Brand defaults. From Phase 4 the admin can override most of these in
// Admin → Settings (stored in the database); these are the fallbacks.

export const SITE = {
  brandName: "Aesthetic Wedding Cards",
  tagline: "Animated wedding invitations, shared on WhatsApp",
  /** International format, digits only — used in wa.me links. */
  whatsappNumber: "923214317574",
  whatsappDisplay: "+92 321 4317574",
  currency: "PKR",
  /** Invitation expiry = last event date + this many days (admin can change). */
  defaultExpiryDays: 30,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/** Builds a WhatsApp chat link, optionally with a pre-filled message. */
export function whatsappLink(text?: string, number: string = SITE.whatsappNumber): string {
  const digits = number.replace(/\D/g, "");
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

/** Formats a PKR amount, e.g. 4500 → "Rs 4,500". */
export function formatPkr(amount: number): string {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}
