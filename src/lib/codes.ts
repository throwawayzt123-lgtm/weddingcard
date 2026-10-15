// Cryptographically random codes. No "server-only" import: the seed uses it.
import { randomInt } from "node:crypto";

// No 0/o, 1/l/i — easy to read aloud or retype from a screenshot.
const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

/** Random lowercase code, e.g. "k7m2xq9p". */
export function randomCode(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return out;
}

/**
 * Guest link code. 8 characters from a 31-letter alphabet gives ~850 billion
 * combinations, so personal links cannot be guessed or listed.
 */
export const GUEST_CODE_LENGTH = 8;

export function generateGuestCode(): string {
  return randomCode(GUEST_CODE_LENGTH);
}
