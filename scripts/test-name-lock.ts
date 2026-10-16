/**
 * PROOF that a customer cannot change the locked fields (couple names, slug,
 * design, plan, expiry, status) — and cannot change the wedding date when it is locked.
 *
 * Run:   npm run test:name-lock
 *
 * It creates a temporary customer + invitation in your database, tries to cheat in
 * every way the portal code allows, checks that nothing changed, and then deletes
 * everything it created. Nothing else in your database is touched.
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { ActionError } from "../src/lib/action-state";
import { guestSchema } from "../src/lib/guests";
import { updateDetails, saveEvent, saveFamily } from "../src/lib/portal-ops";
import { detailsSchema, eventSchema, familySchema } from "../src/lib/portal-schemas";
import { PLANS } from "../src/lib/plans";
import { normalizeNamesKey } from "../src/lib/slug";

const prisma = new PrismaClient();
const TAG = `zz-lock-test-${Date.now().toString(36)}`;
let passed = 0;
let failed = 0;

function check(name: string, ok: boolean, detail = "") {
  if (ok) { passed++; console.log(`  ✔ ${name}`); }
  else { failed++; console.log(`  ✖ ${name} ${detail}`); }
}

async function rejects(fn: () => Promise<unknown> | unknown): Promise<boolean> {
  try { await fn(); return false; } catch { return true; }
}

async function main() {
  console.log("\nSetting up a temporary customer and invitation…");
  const user = await prisma.user.create({
    data: { name: "Lock Test", username: TAG, passwordHash: await bcrypt.hash("not-used-123", 4), role: "CLIENT" },
  });
  const weddingDate = new Date("2030-06-15T00:00:00.000Z");
  const original = await prisma.invitation.create({
    data: {
      slug: TAG, templateKey: "shahi-darwaza", groomName: "Ahmad", brideName: "Mawra", namesNormalizedKey: normalizeNamesKey("Ahmad", "Mawra"),
      weddingDate, dateLocked: true, plan: "BASIC", status: "ACTIVE", expiresAt: new Date("2031-01-01T00:00:00.000Z"), ownerId: user.id,
    },
  });

  const unchanged = async (label: string) => {
    const now = await prisma.invitation.findUniqueOrThrow({ where: { id: original.id } });
    const same =
      now.groomName === original.groomName && now.brideName === original.brideName && now.slug === original.slug &&
      now.templateKey === original.templateKey && now.plan === original.plan && now.status === original.status &&
      now.expiresAt.getTime() === original.expiresAt.getTime() && now.ownerId === original.ownerId &&
      now.weddingDate.getTime() === original.weddingDate.getTime() && now.dateLocked === original.dateLocked &&
      now.namesNormalizedKey === original.namesNormalizedKey;
    check(`${label}: locked fields are unchanged`, same);
  };

  try {
    console.log("\n1. Every customer form schema REJECTS locked fields (strict schemas)");
    const forbidden = ["groomName", "brideName", "slug", "templateKey", "plan", "expiresAt", "status", "ownerId", "namesNormalizedKey", "dateLocked", "id", "paymentStatus", "showBadge"];
    for (const key of forbidden) {
      const evil = { hashtag: "#x", welcomeMessage: "hi", verseText: "", [key]: "HACKED" };
      check(`details form with "${key}" is rejected`, !detailsSchema.safeParse(evil).success);
    }
    check("event form with groomName is rejected", !eventSchema.safeParse({ type: "NIKKAH", title: "", date: "2030-06-14", groomName: "X" }).success);
    check("family form with brideName is rejected", !familySchema.safeParse({ groom: { parentsLine: "", members: [] }, bride: { parentsLine: "", members: [] }, brideName: "X" }).success);
    check("guest form with slug is rejected", !guestSchema.safeParse({ displayName: "Zainab", eventIds: [], slug: "x" }).success);

    console.log("\n2. Allowed edits work, and still never touch the locked fields");
    await updateDetails(original, { hashtag: "#AhmadWedsMawra", welcomeMessage: "Welcome <b>all</b>", verseText: "" });
    const edited = await prisma.invitation.findUniqueOrThrow({ where: { id: original.id } });
    check("hashtag saved (with # added automatically if missing)", edited.hashtag === "#AhmadWedsMawra");
    check("HTML tags are stripped from the welcome message", edited.welcomeMessage === "Welcome all");
    await unchanged("after a normal edit");

    console.log("\n3. Cheating attempts are rejected by the server code");
    check("details + groomName → rejected", await rejects(() => updateDetails(original, { hashtag: "", welcomeMessage: "", verseText: "", groomName: "Hacker" })));
    check("details + brideName → rejected", await rejects(() => updateDetails(original, { hashtag: "", welcomeMessage: "", verseText: "", brideName: "Hacker" })));
    check("details + slug/plan/expiresAt/status → rejected", await rejects(() => updateDetails(original, { hashtag: "", welcomeMessage: "", verseText: "", slug: "stolen", plan: "PREMIUM", expiresAt: "2099-01-01", status: "ACTIVE" })));
    check("event + templateKey → rejected", await rejects(() => saveEvent(original, PLANS.BASIC, null, { type: "NIKKAH", title: "", date: "2030-06-14", templateKey: "noor" })));
    check("family + groomName → rejected", await rejects(() => saveFamily(original, { groom: { parentsLine: "", members: [] }, bride: { parentsLine: "", members: [] }, groomName: "X" })));
    await unchanged("after every cheating attempt");

    console.log("\n4. The wedding date");
    let lockedError: unknown;
    try { await updateDetails(original, { hashtag: "", welcomeMessage: "", verseText: "", weddingDate: "2031-01-01" }); } catch (e) { lockedError = e; }
    check("changing a LOCKED date is refused", lockedError instanceof ActionError, String(lockedError));
    await unchanged("after the locked-date attempt");
    await updateDetails(original, { hashtag: "", welcomeMessage: "", verseText: "", weddingDate: "2030-06-15" });
    check("re-sending the SAME locked date is harmless", true);
    await prisma.invitation.update({ where: { id: original.id }, data: { dateLocked: false } });
    const unlocked = await prisma.invitation.findUniqueOrThrow({ where: { id: original.id } });
    await updateDetails(unlocked, { hashtag: "", welcomeMessage: "", verseText: "", weddingDate: "2030-06-20" });
    const moved = await prisma.invitation.findUniqueOrThrow({ where: { id: original.id } });
    check("an UNLOCKED date can be changed by the customer", moved.weddingDate.toISOString().slice(0, 10) === "2030-06-20");
    check("…but the names still cannot", moved.groomName === "Ahmad" && moved.brideName === "Mawra");

    console.log("\n5. Plan limits");
    await saveEvent(unlocked, PLANS.BASIC, null, { type: "MEHNDI", title: "", date: "2030-06-14" });
    await saveEvent(unlocked, PLANS.BASIC, null, { type: "NIKKAH", title: "", date: "2030-06-15" });
    check("Basic plan: a 3rd event is refused", await rejects(() => saveEvent(unlocked, PLANS.BASIC, null, { type: "WALIMA", title: "", date: "2030-06-16" })));
    check("Premium plan has no event limit", PLANS.PREMIUM.maxEvents === null);
  } finally {
    console.log("\nCleaning up the temporary data…");
    await prisma.invitation.deleteMany({ where: { slug: TAG } });
    await prisma.user.deleteMany({ where: { username: TAG } });
    await prisma.$disconnect();
  }

  console.log(`\n${failed === 0 ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"} — ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.invitation.deleteMany({ where: { slug: TAG } }).catch(() => undefined);
  await prisma.user.deleteMany({ where: { username: TAG } }).catch(() => undefined);
  await prisma.$disconnect();
  process.exit(1);
});
