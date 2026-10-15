// Phone helpers (no server-only import: used by forms and by server code).

/**
 * Turns whatever the user typed into WhatsApp's international format, digits only.
 *   "0321 4317574"    → "923214317574"
 *   "+92 321 4317574" → "923214317574"
 *   "3214317574"      → "923214317574"
 * Returns null when it does not look like a phone number.
 */
export function normalizePhone(input: string | null | undefined, defaultCountry = "92"): string | null {
  if (!input) return null;
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = defaultCountry + digits.slice(1);
  else if (digits.length === 10 && digits.startsWith("3")) digits = defaultCountry + digits;
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

/** "923214317574" → "+92 321 4317574" (for display). */
export function formatPhone(digits: string | null | undefined): string {
  if (!digits) return "";
  const d = digits.replace(/\D/g, "");
  if (d.startsWith("92") && d.length === 12) return `+92 ${d.slice(2, 5)} ${d.slice(5)}`;
  return `+${d}`;
}
