// Helpers for invitation URLs and the duplicate-couple check.
// No "server-only" import here: the seed script uses these too.

import { randomCode } from "./codes";

/** "Ahmad Raza" → "ahmad-raza". Non-Latin names (e.g. Urdu) become "". */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/**
 * Case-, space- and punctuation-insensitive key for a couple, used to warn the
 * admin about duplicates. "  AHMAD  " + "Sa ra." → "ahmad|sara".
 */
export function normalizeNamesKey(groomName: string, brideName: string): string {
  const clean = (s: string) => s.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  return `${clean(groomName)}|${clean(brideName)}`;
}

/** Slugs we try in order: ahmad-weds-sara → ahmad-sara-2026 → ahmad-weds-sara-k3x9. */
export function slugCandidates(groomName: string, brideName: string, year: number): string[] {
  const g = slugify(groomName) || "groom";
  const b = slugify(brideName) || "bride";
  return [`${g}-weds-${b}`, `${g}-${b}-${year}`];
}

/**
 * Returns the first free slug. `isTaken` checks the database, so this module
 * stays free of database imports.
 */
export async function generateUniqueSlug(
  groomName: string,
  brideName: string,
  year: number,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const candidates = slugCandidates(groomName, brideName, year);
  for (const slug of candidates) {
    if (!(await isTaken(slug))) return slug;
  }
  // Both readable options are taken: add a short random suffix.
  for (let i = 0; i < 10; i++) {
    const slug = `${candidates[0]}-${randomCode(4)}`;
    if (!(await isTaken(slug))) return slug;
  }
  throw new Error("Could not generate a unique slug");
}
