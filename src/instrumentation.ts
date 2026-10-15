// Runs once when the server starts. Prints a clear message if a required
// setting is missing from .env, instead of failing later with a vague error.

const REQUIRED = ["DATABASE_URL", "DIRECT_URL", "AUTH_SECRET"] as const;
const PLACEHOLDERS = ["replace-me", "USER:PASSWORD", "ep-xxxx"];

export function register() {
  const problems = REQUIRED.filter((key) => {
    const value = process.env[key];
    return !value || PLACEHOLDERS.some((p) => value.includes(p));
  });
  if (problems.length === 0) return;

  console.error(
    [
      "",
      "────────────────────────────────────────────────────────────",
      `  ✖ Missing settings in .env: ${problems.join(", ")}`,
      "  Login and database pages will not work until these are set.",
      "  See README.md → First-time setup, then restart: npm run dev",
      "────────────────────────────────────────────────────────────",
      "",
    ].join("\n"),
  );
}
