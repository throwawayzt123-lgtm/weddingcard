import { randomInt } from "node:crypto";
import { slugify } from "./slug";

// Characters that cannot be confused when read aloud or typed from WhatsApp (no 0/O, 1/l/I).
const PASSWORD_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** Strong random password, e.g. "Hk7mRq2Xvd" (10 characters ≈ 57 bits). */
export function generatePassword(length = 10): string {
  let out = "";
  for (let i = 0; i < length; i++) out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  return out;
}

/** "ahmad.sara" (+ digits when taken). `isTaken` checks the database. */
export async function generateUsername(groomName: string, brideName: string, isTaken: (u: string) => Promise<boolean>): Promise<string> {
  const base = `${slugify(groomName) || "groom"}.${slugify(brideName) || "bride"}`.slice(0, 30);
  if (!(await isTaken(base))) return base;
  for (let i = 0; i < 20; i++) {
    const candidate = `${base}${randomInt(10, 99)}`;
    if (!(await isTaken(candidate))) return candidate;
  }
  throw new Error("Could not generate a unique username");
}
