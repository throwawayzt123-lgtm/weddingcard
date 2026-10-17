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
    label: "Regular",
    pricePkr: 2599,
    blurb: "A graceful invitation for an intimate celebration",
    maxEvents: 2,
    maxGuests: 50,
    rsvp: false,
    maxPhotos: 0,
    customMusicUpload: false,
    canRemoveBadge: false,
  },
  STANDARD: {
    label: "Advanced",
    pricePkr: 3399,
    blurb: "RSVP, a photo gallery and up to 4 events",
    maxEvents: 4,
    maxGuests: 300,
    rsvp: true,
    maxPhotos: 10,
    customMusicUpload: false,
    canRemoveBadge: false,
  },
  PREMIUM: {
    label: "Prime",
    pricePkr: 6899,
    blurb: "Our fullest experience, with unlimited guests and your own music",
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

/** "23 / 50" or "23 / Unlimited", for the portal usage meters. */
export function formatUsage(currentCount: number, limit: number | null): string {
  return `${currentCount} / ${limit === null ? "Unlimited" : limit}`;
}

/** Human readable feature list for a plan (used on the website and in the admin). */
export function planFeatures(plan: Plan): string[] {
  const p = PLANS[plan];
  return [
    `${p.maxEvents === null ? "Unlimited" : `Up to ${p.maxEvents}`} events (Mehndi, Nikkah, Baraat, Walima and more)`,
    `${p.maxGuests === null ? "Unlimited" : `${p.maxGuests}`} personal guest links`,
    "Animated opening, music and countdown",
    "Venue maps and add to calendar",
    p.rsvp ? "RSVP with headcount and messages" : "RSVP not included",
    p.maxPhotos > 0 ? `Photo gallery (${p.maxPhotos} photos)` : "No photo gallery",
    p.customMusicUpload ? "Upload your own music" : "Choose from the music we provide",
    p.canRemoveBadge ? "No Made with love badge in the footer" : "A small Made with love badge in the footer",
  ];
}
