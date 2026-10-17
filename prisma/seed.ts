/**
 * Seed script — run with:  npm run db:seed
 *
 * 1. Creates (or updates) the admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
 * 2. (unless SEED_DEMO=false) Creates a demo client (username "demo") who owns a demo invitation,
 *    "Ahmad & Sara", with family, 4 events and one guest ("Mr & Mrs Ali").
 *
 * Safe to run more than once: the demo invitation is rebuilt each time with
 * fresh dates (about 2 months from today).
 */
import { PrismaClient, type EventType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { normalizeNamesKey } from "../src/lib/slug";

const prisma = new PrismaClient();

const DEMO_SLUG = "ahmad-weds-sara";
const DEMO_GUEST_CODE = "demosara"; // fixed so the test link never changes

/** A calendar date `days` from today, stored as midnight UTC (Postgres DATE). */
function dateFromToday(days: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days));
}

function mapsSearch(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.");
  }
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters.");

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      username: "admin",
      name: process.env.ADMIN_NAME?.trim() || "Owner",
      passwordHash,
      role: "ADMIN",
    },
    update: { passwordHash, role: "ADMIN" },
  });
  console.log(`✔ Admin ready: ${admin.email} (username: ${admin.username})`);
}

async function seedDemo() {
  const passwordHash = await bcrypt.hash(process.env.DEMO_CLIENT_PASSWORD || "demo12345", 12);
  const client = await prisma.user.upsert({
    where: { username: "demo" },
    create: { username: "demo", name: "Demo Family", phone: "+923001234567", passwordHash, role: "CLIENT" },
    update: { passwordHash },
  });

  // Rebuild the demo invitation from scratch (related rows cascade-delete).
  await prisma.invitation.deleteMany({ where: { slug: DEMO_SLUG } });

  const events: { type: EventType; title: string; day: number; start: string; end?: string; venue: string; address: string; dress: string; notes?: string }[] = [
    {
      type: "MEHNDI",
      title: "Mehndi",
      day: 60,
      start: "19:00",
      end: "23:30",
      venue: "Rose Garden Lawn",
      address: "Main Boulevard, Gulberg III, Lahore",
      dress: "Yellow, green & bright festive colours",
      notes: "Dholak, songs and dancing. Come ready to perform!",
    },
    {
      type: "NIKKAH",
      title: "Nikkah",
      day: 61,
      start: "17:00",
      end: "19:00",
      venue: "Family Residence",
      address: "Street 12, DHA Phase 5, Lahore",
      dress: "Ivory, white & pastels",
    },
    {
      type: "BARAAT",
      title: "Baraat",
      day: 62,
      start: "19:30",
      end: "23:00",
      venue: "Shahi Mahal Banquet",
      address: "Canal Bank Road, near Thokar Niaz Baig, Lahore",
      dress: "Formal, in reds, maroons and gold",
      notes: "Baraat arrival at 8:00 pm sharp.",
    },
    {
      type: "WALIMA",
      title: "Walima",
      day: 63,
      start: "20:00",
      end: "23:00",
      venue: "Noor Pavilion",
      address: "MM Alam Road, Gulberg II, Lahore",
      dress: "Formal, in soft pastel tones",
    },
  ];

  const lastEventDate = dateFromToday(events[events.length - 1].day);
  const expiresAt = new Date(lastEventDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  const invitation = await prisma.invitation.create({
    data: {
      slug: DEMO_SLUG,
      templateKey: "shahi-darwaza",
      groomName: "Ahmad",
      brideName: "Sara",
      namesNormalizedKey: normalizeNamesKey("Ahmad", "Sara"),
      weddingDate: dateFromToday(62), // Baraat day
      dateLocked: true,
      plan: "PREMIUM",
      status: "ACTIVE",
      expiresAt,
      ownerId: client.id,
      hashtag: "#AhmadWedsSara",
      welcomeMessage:
        "Your presence is the blessing we are asking for. Over these few days two families become one, and it would not be complete without the people who have loved us all our lives. Come eat with us, dance with us, pray with us and stay late. We have saved you a place.",
      verseText: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
      musicEnabled: true,
      showBadge: true,
      paymentStatus: "PAID",
      paymentAmount: 7500,
      paymentMethod: "Demo",
      familySides: {
        create: [
          {
            side: "GROOM",
            parentsLine: "Mr. & Mrs. Khalid Mehmood",
            members: {
              create: [
                { name: "Hamza Mehmood", phone: "+92 300 1234567", showPhone: true, order: 0 },
                { name: "Usman Mehmood", phone: "+92 321 1234567", showPhone: true, order: 1 },
                { name: "Areeba Mehmood", order: 2 },
              ],
            },
          },
          {
            side: "BRIDE",
            parentsLine: "Mr. & Mrs. Naveed Iqbal",
            members: {
              create: [
                { name: "Hina Iqbal", order: 0 },
                { name: "Maryam Iqbal", order: 1 },
              ],
            },
          },
        ],
      },
      events: {
        create: events.map((e, i) => ({
          type: e.type,
          title: e.title,
          date: dateFromToday(e.day),
          startTime: e.start,
          endTime: e.end,
          venueName: e.venue,
          address: e.address,
          mapUrl: mapsSearch(`${e.venue}, ${e.address}`),
          dressCode: e.dress,
          notes: e.notes,
          order: i,
        })),
      },
    },
    include: { events: true },
  });

  await prisma.guest.create({
    data: {
      invitationId: invitation.id,
      displayName: "Mr & Mrs Ali",
      phone: "+923001112233",
      code: DEMO_GUEST_CODE,
      guestEvents: { create: invitation.events.map((e) => ({ eventId: e.id })) },
    },
  });

  console.log(`✔ Demo client ready: username "demo"`);
  console.log(`✔ Demo invitation: /i/${DEMO_SLUG}  (guest link: /i/${DEMO_SLUG}/${DEMO_GUEST_CODE})`);
}

async function main() {
  await seedAdmin();
  // On the live website set SEED_DEMO=false so no demo customer or demo invitation is created.
  if (process.env.SEED_DEMO === "false") console.log("• Skipped the demo customer and invitation (SEED_DEMO=false)");
  else await seedDemo();
}

main()
  .catch((error) => {
    console.error("✖ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
