import { z } from "zod";
import { PLAN_KEYS } from "./plans";
import { TEMPLATES } from "@/templates/registry";

// Form validation for the admin panel. Shared by the forms (for hints) and the
// server actions (which re-check everything — the browser is never trusted).

/** Removes anything that looks like an HTML tag, and control characters. */
export function stripTags(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
}

const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

const ymd = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "That date does not exist");

const optionalYmd = z.preprocess((v) => (v === "" || v == null ? undefined : v), ymd.optional());

const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === "string" ? stripTags(v) : v), z.string().max(max).optional().transform((v) => v || undefined));

const optionalAmount = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(String(v).replace(/[, ]/g, ""))),
  z.number("Enter a number").int().min(0).max(100_000_000).optional(),
);

export const coupleName = z
  .string()
  .transform(stripTags)
  .pipe(z.string().min(1, "Required").max(60, "Maximum 60 characters"));

const templateKey = z.enum(TEMPLATES.map((t) => t.key) as [string, ...string[]], "Choose a design");
const plan = z.enum(PLAN_KEYS as [string, ...string[]], "Choose a plan");
const paymentStatus = z.enum(["UNPAID", "PAID"]);

export const createInvitationSchema = z
  .object({
    templateKey,
    groomName: coupleName,
    brideName: coupleName,
    weddingDate: ymd,
    dateLocked: checkbox,
    plan,
    expiresAt: optionalYmd,
    paymentStatus,
    paymentAmount: optionalAmount,
    paymentMethod: optionalText(60),
    paymentRef: optionalText(200),
    customerMode: z.enum(["new", "existing"]),
    existingOwnerId: optionalText(50),
    customerName: optionalText(80),
    customerPhone: optionalText(30),
    customerEmail: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : typeof v === "string" ? v.trim().toLowerCase() : v),
      z.email("Enter a valid email").max(120).optional(),
    ),
    confirmDuplicate: checkbox,
  })
  .superRefine((v, ctx) => {
    if (v.customerMode === "existing" && !v.existingOwnerId) {
      ctx.addIssue({ code: "custom", path: ["existingOwnerId"], message: "Choose a customer" });
    }
    if (v.customerMode === "new") {
      if (!v.customerName || v.customerName.length < 2) ctx.addIssue({ code: "custom", path: ["customerName"], message: "Enter the customer's name" });
      if (!v.customerPhone) ctx.addIssue({ code: "custom", path: ["customerPhone"], message: "Enter the customer's WhatsApp number" });
    }
  });
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const updateInvitationSchema = z.object({
  templateKey,
  plan,
  status: z.enum(["DRAFT", "ACTIVE", "SUSPENDED"]),
  weddingDate: ymd,
  dateLocked: checkbox,
  expiryMode: z.enum(["auto", "custom"]),
  expiresAt: optionalYmd,
  showBadge: checkbox,
  paymentStatus,
  paymentAmount: optionalAmount,
  paymentMethod: optionalText(60),
  paymentRef: optionalText(200),
});

export const correctNamesSchema = z.object({
  groomName: coupleName,
  brideName: coupleName,
  reason: optionalText(200),
});

export const settingsSchema = z.object({
  brandName: z.string().transform(stripTags).pipe(z.string().min(2, "Enter your brand name").max(60)),
  tagline: z.string().transform(stripTags).pipe(z.string().min(2).max(140)),
  whatsappNumber: z.string().min(8, "Enter your WhatsApp number").max(30),
  defaultExpiryDays: z.preprocess((v) => Number(v), z.number("Enter a number").int().min(1, "At least 1 day").max(730)),
  shareMessage: z.string().trim().min(10, "The message is too short").max(1000).refine((v) => v.includes("{link}"), "The message must contain {link}"),
  priceBASIC: z.preprocess((v) => Number(String(v).replace(/[, ]/g, "")), z.number("Enter a number").int().min(0).max(10_000_000)),
  priceSTANDARD: z.preprocess((v) => Number(String(v).replace(/[, ]/g, "")), z.number("Enter a number").int().min(0).max(10_000_000)),
  pricePREMIUM: z.preprocess((v) => Number(String(v).replace(/[, ]/g, "")), z.number("Enter a number").int().min(0).max(10_000_000)),
});
