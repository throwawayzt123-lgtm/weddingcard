import { z } from "zod";
import { stripTags } from "./admin-schemas";

// What a CUSTOMER is allowed to send. These schemas are STRICT: if the request
// contains anything else (groomName, brideName, slug, templateKey, plan,
// expiresAt, status…) it is rejected, not quietly ignored.

const cleanText = (max: number) =>
  z.preprocess((v) => (v == null ? "" : typeof v === "string" ? stripTags(v) : v), z.string().max(max, `Maximum ${max} characters`));

/** Like cleanText but keeps line breaks (for longer messages). */
const cleanParagraph = (max: number) =>
  z.preprocess(
    (v) => (v == null ? "" : typeof v === "string" ? v.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n/g, "\n").trim() : v),
    z.string().max(max, `Maximum ${max} characters`),
  );

const ymd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date")
  .refine((v) => !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime()) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v, "That date does not exist");

const time = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use the time picker").optional(),
);

const optionalUrl = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : typeof v === "string" ? v.trim() : v),
  z
    .string()
    .max(500)
    .refine((v) => /^https?:\/\//i.test(v), "The link must start with https://")
    .refine((v) => {
      try {
        new URL(v);
        return true;
      } catch {
        return false;
      }
    }, "That does not look like a link")
    .optional(),
);

const hashtag = z.preprocess(
  (v) => {
    if (v == null) return "";
    if (typeof v !== "string") return v;
    const t = stripTags(v).replace(/\s+/g, "");
    return t === "" ? "" : t.startsWith("#") ? t : `#${t}`;
  },
  z.string().max(40, "Maximum 40 characters").regex(/^(#[\p{L}\p{N}_]+)?$/u, "Use letters and numbers only"),
);

// ----- Details ---------------------------------------------------------------

export const detailsSchema = z.strictObject({
  hashtag,
  welcomeMessage: cleanParagraph(800),
  verseText: cleanParagraph(300),
  /** Only accepted when the admin has NOT locked the date. */
  weddingDate: z.preprocess((v) => (v === "" || v == null ? undefined : v), ymd.optional()),
});

// ----- Events ----------------------------------------------------------------

export const EVENT_TYPES = ["DHOLKI", "MAYUN", "MEHNDI", "NIKKAH", "BARAAT", "RUKHSATI", "WALIMA", "CUSTOM"] as const;
export const EVENT_LABEL: Record<(typeof EVENT_TYPES)[number], string> = {
  DHOLKI: "Dholki", MAYUN: "Mayun", MEHNDI: "Mehndi", NIKKAH: "Nikkah", BARAAT: "Baraat", RUKHSATI: "Rukhsati", WALIMA: "Walima", CUSTOM: "Other event",
};

export const eventSchema = z.strictObject({
  type: z.enum(EVENT_TYPES, "Choose the kind of event"),
  title: cleanText(60),
  date: ymd,
  startTime: time,
  endTime: time,
  venueName: cleanText(80),
  address: cleanText(200),
  mapUrl: optionalUrl,
  dressCode: cleanText(80),
  notes: cleanParagraph(300),
});

// ----- Family ----------------------------------------------------------------

const phone = z.preprocess(
  (v) => (typeof v === "string" ? v.replace(/[^\d+\-\s()]/g, "").trim() : v),
  z.string().max(25).optional().transform((v) => v || null),
);

const member = z.strictObject({
  name: cleanText(60).pipe(z.string().min(1, "Enter a name")),
  phone,
  showPhone: z.boolean(),
});

const side = z.strictObject({
  parentsLine: cleanText(120),
  members: z.array(member).max(12, "Up to 12 people per side"),
});

export const familySchema = z.strictObject({ groom: side, bride: side });
export type FamilyInput = z.infer<typeof familySchema>;

// ----- Account ---------------------------------------------------------------

export const passwordSchema = z
  .strictObject({
    currentPassword: z.string().min(1, "Enter your current password").max(200),
    newPassword: z.string().min(8, "At least 8 characters").max(100),
    confirmPassword: z.string().max(100),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { path: ["confirmPassword"], message: "The two passwords do not match" })
  .refine((v) => v.newPassword !== v.currentPassword, { path: ["newPassword"], message: "Choose a different password" });
