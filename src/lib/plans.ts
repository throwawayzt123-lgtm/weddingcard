import type { Plan } from "@prisma/client";

// ---------------------------------------------------------------
// ALL plan limits and prices live here. Change a number, redeploy, done.
// `null` means "unlimited". Limits are enforced on the server.
// ---------------------------------------------------------------

export type PlanConfig = {
  label: string;
  pricePkr: number;
  /** Short line shown under the price on the homepage. */
  blurb: string;
  maxEvents: number | null;
  maxGuests: number | null;
  rsvp: boolean;
  /** 0 = gallery not available on this plan. */
  maxPhotos: number;
  customMusicUpload: boolean;
  canRemoveBadge: boolean;
};

export const PLANS = {
  BASIC: {
    label: "Basic",
    pricePkr: 2500,
    blurb: "A beautiful card for a small celebration",
    maxEvents: 2,
    maxGuests: 50,
    rsvp: false,
    maxPhotos: 0,
    customMusicUpload: false,
    canRemoveBadge: false,
  },
  STANDARD: {
    label: "Standard",
    pricePkr: 4500,
    blurb: "Most popular — RSVP, gallery and up to 4 events",
    maxEvents: 4,
    maxGuests: 300,
    rsvp: true,
    maxPhotos: 10,
    customMusicUpload: false,
    canRemoveBadge: false,
  },
  PREMIUM: {
    label: "Premium",
    pricePkr: 7500,
    blurb: "Everything unlimited, your own music, no branding",
    maxEvents: null,
    maxGuests: null,
    rsvp: true,
    maxPhotos: 30,
    customMusicUpload: true,
    canRemoveBadge: true,
  },
} as const satisfies Record<Plan, PlanConfig>;

export const PLAN_KEYS = Object.keys(PLANS) as Plan[];

export function getPlan(plan: Plan): PlanConfig {
  return PLANS[plan];
}

/** True if one more item can be added without passing the limit. */
export function canAddMore(limit: number | null, currentCount: number): boolean {
  return limit === null || currentCount < limit;
}

/** "23 / 50" or "23 / Unlimited" — for the portal usage meters. */
export function formatUsage(currentCount: number, limit: number | null): string {
  return `${currentCount} / ${limit === null ? "Unlimited" : limit}`;
}

/** Human-readable feature list for a plan (used on the homepage and in the admin). */
export function planFeatures(plan: Plan): string[] {
  const p = PLANS[plan];
  const list = [
    `${p.maxEvents === null ? "Unlimited" : `Up to ${p.maxEvents}`} events (Mehndi, Nikkah, Baraat, Walima…)`,
    `${p.maxGuests === null ? "Unlimited" : `${p.maxGuests}`} personalised guest links`,
    "Animated opening, music & countdown",
    "Venue maps & add-to-calendar",
    p.rsvp ? "RSVP with headcount & messages" : "RSVP not included",
    p.maxPhotos > 0 ? `Photo gallery (${p.maxPhotos} photos)` : "No photo gallery",
    p.customMusicUpload ? "Upload your own music" : "Choose from built-in music",
    p.canRemoveBadge ? "Your invitation, no branding" : `"Made with ❤" badge in footer`,
  ];
  return list;
}
