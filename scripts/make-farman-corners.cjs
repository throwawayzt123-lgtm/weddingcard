/**
 * Draws the four gold corner flourishes used by the Farman design.
 * Run:  node scripts/make-farman-corners.cjs
 * Change GOLD to recolour them. Output: public/templates/farman/corner-1..4.svg
 */
const fs = require("fs");
const path = require("path");
const GOLD = "#b8923f";
const art = `<path d="M3 64V16Q3 3 16 3H64"/><path d="M11 64V20Q11 11 20 11H64" stroke-opacity=".5"/><path d="M3 3l10 10"/><circle cx="21" cy="21" r="2.8" fill="${GOLD}" stroke="none"/><path d="M21 30q0 9 9 9M30 21q9 0 9 9" stroke-opacity=".8"/><path d="M40 3v6M3 40h6" stroke-opacity=".8"/>`;
// 1 = top-left, 2 = top-right, 3 = bottom-right, 4 = bottom-left
const flips = ["", "translate(64 0) scale(-1 1)", "translate(64 64) scale(-1 -1)", "translate(0 64) scale(1 -1)"];
const dir = path.join(__dirname, "..", "public", "templates", "farman");
fs.mkdirSync(dir, { recursive: true });
flips.forEach((t, i) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"><g${t ? ` transform="${t}"` : ""}>${art}</g></svg>\n`;
  fs.writeFileSync(path.join(dir, `corner-${i + 1}.svg`), svg);
});
console.log("corners written to", dir);
