/**
 * Draws the artwork of the "Mahtab" design (a moonlit palace in navy, gold, blue and white) into public/templates/mahtab:
 *   sky.webp    the starry night sky (the cover)
 *   moon.webp   the full moon on its own layer, so it can rise
 *   front.webp  everything in front of the sky: the gold arch, the palace and its pool, blue and white roses,
 *               lanterns, and the couple on a marble balcony. The sky shows through the arch.
 * Run:  node scripts/make-mahtab.cjs
 */
const path = require("path");
const k = require("./art/kit.cjs");

const { W, H, CX, r2, between, rand } = k;
const OUT = path.join(__dirname, "..", "public", "templates", "mahtab");

const GOLD = "#d4b46a";
const GOLD_LIGHT = "#f1dc9e";
const GOLD_DARK = "#9c7c34";
const MOON = { x: CX, y: 470, r: 108 };

k.seed(23);

function sky() {
  const extraDefs = `
  <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070f29"/><stop offset="0.55" stop-color="#14224d"/><stop offset="1" stop-color="#2f4378"/></linearGradient>
  <radialGradient id="haze" cx="0.5" cy="0.25" r="0.5"><stop offset="0" stop-color="#3a5694" stop-opacity="0.55"/><stop offset="1" stop-color="#3a5694" stop-opacity="0"/></radialGradient>`;
  let body = `<rect width="${W}" height="${H}" fill="url(#night)"/><rect width="${W}" height="${H}" fill="url(#haze)"/>`;
  for (let i = 0; i < 8; i++) body += `<ellipse cx="${r2(between(0, W))}" cy="${r2(between(200, 1400))}" rx="${r2(between(160, 320))}" ry="${r2(between(20, 50))}" fill="#6f86bd" opacity="0.12" filter="url(#soft)"/>`;
  for (let i = 0; i < 260; i++) body += `<circle cx="${r2(between(0, W))}" cy="${r2(between(0, 1500))}" r="${r2(between(0.7, 2.1))}" fill="#fff" opacity="${r2(between(0.35, 0.95))}"/>`;
  for (let i = 0; i < 22; i++) {
    const x = r2(between(30, 1050));
    const y = r2(between(40, 1300));
    const s = r2(between(5, 11));
    body += `<circle cx="${x}" cy="${y}" r="${s}" fill="#fff6d8" opacity="0.6" filter="url(#glow)"/><path d="M${x} ${y - s * 1.8}L${x + s * 0.3} ${y}L${x} ${y + s * 1.8}L${x - s * 0.3} ${y}Z M${x - s * 1.8} ${y}L${x} ${y - s * 0.3}L${x + s * 1.8} ${y}L${x} ${y + s * 0.3}Z" fill="#fffbea"/>`;
  }
  return k.svg(body, { extraDefs });
}

function moon() {
  const { x, y, r } = MOON;
  const extraDefs = `<radialGradient id="moonFace" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#fffdf3"/><stop offset="0.7" stop-color="#f6ecc8"/><stop offset="1" stop-color="#e3d2a0"/></radialGradient>`;
  let body = `<circle cx="${x}" cy="${y}" r="${r * 2.4}" fill="#f7e9b8" opacity="0.16" filter="url(#soft)"/><circle cx="${x}" cy="${y}" r="${r * 1.45}" fill="#fff3c9" opacity="0.35" filter="url(#soft)"/>`;
  body += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#moonFace)"/>`;
  [[-30, -20, 22], [34, 18, 16], [-8, 40, 12], [40, -38, 10], [-48, 30, 8]].forEach(([dx, dy, cr]) => (body += `<circle cx="${x + dx}" cy="${y + dy}" r="${cr}" fill="#c9b680" opacity="0.18"/>`));
  return k.svg(body, { extraDefs });
}

/** The far palace: a great dome with minarets and pavilions, every window lit. */
function palace(base) {
  const dome = (cx, b, w, h) =>
    `<path d="M${cx - w} ${b}C${cx - w} ${b - h * 0.55} ${cx - w * 0.55} ${b - h * 0.8} ${cx} ${b - h}C${cx + w * 0.55} ${b - h * 0.8} ${cx + w} ${b - h * 0.55} ${cx + w} ${b}Z"/><path d="M${cx} ${b - h}v-18" stroke-width="4"/>`;
  let out = `<g fill="#1b2650" stroke="#1b2650">`;
  out += `<rect x="380" y="${base - 120}" width="320" height="120"/><rect x="450" y="${base - 170}" width="180" height="56"/>`;
  out += dome(CX, base - 168, 86, 150);
  out += dome(430, base - 118, 30, 60) + dome(650, base - 118, 30, 60);
  [330, 750].forEach((mx) => (out += `<rect x="${mx - 9}" y="${base - 230}" width="18" height="230"/>` + dome(mx, base - 230, 16, 36)));
  out += `<rect x="190" y="${base - 70}" width="140" height="70"/>` + dome(260, base - 70, 44, 70);
  out += `<rect x="750" y="${base - 70}" width="140" height="70"/>` + dome(820, base - 70, 44, 70);
  out += `</g>`;
  // moonlight on the dome edges
  out += `<path d="M${CX - 86} ${base - 168}C${CX - 86} ${base - 250} ${CX - 47} ${base - 288} ${CX} ${base - 318}" stroke="#8ea3d6" stroke-width="3" fill="none" opacity="0.6"/>`;
  const windows = [];
  for (let i = 0; i < 7; i++) windows.push([395 + i * 46, base - 60]);
  for (let i = 0; i < 4; i++) windows.push([470 + i * 46, base - 150]);
  [[230, base - 30], [290, base - 30], [790, base - 30], [850, base - 30]].forEach((p) => windows.push(p));
  windows.forEach(([wx, wy]) => (out += `<circle cx="${wx + 9}" cy="${wy}" r="16" fill="#ffcf7a" opacity="0.45" filter="url(#glow)"/><path d="M${wx} ${wy + 20}v-26q9 -14 18 0v26Z" fill="#ffdc96"/>`));
  return out;
}

function front() {
  const arch = { hw: 400, spring: 640, apex: 200, bottom: 1610, lobes: 7, depth: 0.58 };
  const archPath = k.cuspedArch(arch);
  const extraDefs = `
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1838"/><stop offset="1" stop-color="#18264f"/></linearGradient>
  <pattern id="trellis" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M45 0L90 45L45 90L0 45Z" fill="none" stroke="${GOLD}" stroke-width="1.2"/><circle cx="45" cy="45" r="3" fill="${GOLD}"/></pattern>
  <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22336a"/><stop offset="1" stop-color="#0f1a3d"/></linearGradient>
  <linearGradient id="marble" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ecf4"/><stop offset="1" stop-color="#b9c1d8"/></linearGradient>
  <clipPath id="win"><path d="${archPath}"/></clipPath>`;
  const base = 1430;
  let body = "";
  // inside the arch: palace, trees and pool (the sky above stays see-through)
  body += `<g clip-path="url(#win)">`;
  body += `<g fill="#111b3e">${Array.from({ length: 30 }, (_, i) => `<circle cx="${130 + i * 28}" cy="${base - between(10, 40)}" r="${r2(between(20, 38))}"/>`).join("")}</g>`;
  body += palace(base);
  body += `<rect y="${base}" width="${W}" height="200" fill="url(#pool)"/>`;
  body += `<g transform="translate(0 ${2 * base}) scale(1 -1)" opacity="0.3">${palace(base)}</g>`;
  body += `<rect x="${CX - 40}" y="${base}" width="80" height="180" fill="#f6ecc8" opacity="0.18" filter="url(#glow)"/>`;
  for (let i = 0; i < 26; i++) body += `<rect x="${r2(between(160, 900))}" y="${r2(between(base + 10, base + 170))}" width="${r2(between(30, 120))}" height="2" fill="#cfdcff" opacity="${r2(between(0.2, 0.6))}"/>`;
  body += `</g>`;
  // the navy wall around the arch, with a gold trellis
  body += `<path d="M0 0H${W}V${H}H0Z ${archPath}" fill="url(#wall)" fill-rule="evenodd"/>`;
  body += `<path d="M0 0H${W}V${H}H0Z ${archPath}" fill="url(#trellis)" fill-rule="evenodd" opacity="0.16"/>`;
  body += `<path d="${archPath}" fill="none" stroke="${GOLD}" stroke-width="6"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw + 22, apex: arch.apex - 26, spring: arch.spring - 8 })}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="7" stroke-dasharray="0 14" stroke-linecap="round"/>`;
  body += `<path d="${k.pointedArch({ hw: arch.hw + 46, apex: arch.apex - 60, spring: arch.spring - 20 })}" fill="none" stroke="${GOLD}" stroke-width="2"/>`;
  body += `<path d="M${CX} 70l20 40l-20 50l-20 -50Z" fill="${GOLD_LIGHT}" stroke="${GOLD_DARK}" stroke-width="2"/>`;
  body += `<rect x="30" y="30" width="${W - 60}" height="${H - 60}" fill="none" stroke="${GOLD}" stroke-width="2.4"/>`;
  // lanterns either side
  body += k.lantern(90, 560, 1.2, 0, GOLD_DARK) + k.lantern(990, 560, 1.2, 0, GOLD_DARK);
  body += k.lantern(170, 300, 0.9, 0, GOLD_DARK) + k.lantern(910, 300, 0.9, 0, GOLD_DARK);
  // blue and white roses: top corners and both sides of the arch
  const flowers = { roses: ["white", "blue", "white", "navy"], blossoms: ["blue", "white", "blue"], leafTone: "blue", leaves: 14, buds: 2 };
  body += k.cluster(40, 40, 260, { ...flowers, count: 8, size: [40, 80] });
  body += k.cluster(1040, 40, 260, { ...flowers, count: 8, size: [40, 80] });
  body += k.cluster(70, 1060, 230, { ...flowers, count: 7, size: [36, 70] });
  body += k.cluster(1010, 1100, 230, { ...flowers, count: 7, size: [36, 70] });
  for (let i = 0; i < 5; i++) body += k.cascade(between(30, 160), 1150, between(200, 320), { tones: ["blue", "white", "blue"], width: 22, stem: "#5d6f93" });
  for (let i = 0; i < 5; i++) body += k.cascade(between(920, 1050), 1190, between(200, 320), { tones: ["blue", "white", "blue"], width: 22, stem: "#5d6f93" });
  // the couple, then the marble balcony in front of them
  body += k.couple(560, 1880, 1.12, {
    lehenga: "#b9c3e0", lehengaDeep: "#7f8cb8", dupatta: "#8d9fd0", trim: "#e6cf8c",
    sherwani: "#2a3a6c", sherwaniDeep: "#131c3d", trousers: "#e9e6dd",
  });
  body += `<rect y="1600" width="${W}" height="24" fill="${GOLD}"/><rect y="1624" width="${W}" height="296" fill="url(#marble)"/>`;
  for (let x = 40; x < W; x += 62) body += `<path d="M${x} 1650h30v14q-10 22 0 44q10 22 0 44v20h-30v-20q-10 -22 0 -44q10 -22 0 -44Z" fill="#d6dbea" stroke="#a7b0c9" stroke-width="2"/>`;
  body += `<rect y="1770" width="${W}" height="20" fill="${GOLD}"/><rect y="1790" width="${W}" height="130" fill="#c3cadf"/>`;
  body += k.cluster(60, 1640, 220, { ...flowers, count: 6, size: [36, 70] });
  body += k.cluster(1020, 1650, 220, { ...flowers, count: 6, size: [36, 70] });
  [[230, 1770], [860, 1770]].forEach(([x, y]) => (body += k.floorLantern(x, y, 1, GOLD_DARK)));
  return k.svg(body, { extraDefs, emboss: "#02061a", embossOpacity: 0.45 });
}

k.writeAll(OUT, [
  ["sky", sky(), { quality: 80 }],
  ["moon", moon(), { quality: 88 }],
  ["front", front(), { quality: 84 }],
]);
