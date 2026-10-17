// Brand defaults. From Phase 4 the admin can override most of these in
// Admin → Settings (stored in the database); these are the fallbacks.

export const SITE = {
  brandName: "Aesthetic Wedding Cards",
  tagline: "Animated wedding invitations, shared on WhatsApp",
  /**
   * THE ONE PLACE for the business WhatsApp number: international format, digits only.
   * Every wa.me link, button and footer on the site uses it (the display text is made from it).
   * The owner can also change it in Admin → Settings, which then takes over.
   */
  whatsappNumber: "923197138377",
  currency: "PKR",
  /** Invitation expiry = last event date + this many days (admin can change). */
  defaultExpiryDays: 30,
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

/** Pre-filled WhatsApp message of every "Order Custom Design" button. */
export const CUSTOM_ORDER_MESSAGE = "Hi, I would like to order a custom wedding invitation design.";

/** Builds a WhatsApp chat link, optionally with a pre-filled message. */
export function whatsappLink(text?: string, number: string = SITE.whatsappNumber): string {
  const digits = number.replace(/\D/g, "");
  return text ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/${digits}`;
}

/** Formats a PKR amount, e.g. 2599 becomes "PKR 2,599". */
export function formatPkr(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** The small credit shown on every invitation. It opens WhatsApp with this message. */
export const WATERMARK_NAME = "Dawatnamaa";
export const WATERMARK_MESSAGE = "Hi, I saw an invitation made by Dawatnamaa and I would like one for my wedding.";
