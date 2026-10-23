/**
 * Draws the artwork of the "Chaman" design (a white rose garden in sage and ivory) into public/templates/chaman:
 *   scene.webp        the card: white roses and eucalyptus, a gold arch for the words, and below it a floral arch,
 *                     a marble pavilion and the couple walking down the garden aisle
 *   sehra-left.webp   the left half of the sehra (strings of jasmine with red roses) that covers the cover
 *   sehra-right.webp  the right half
 *   sehra-top.webp    the band of roses and gold the strings hang from
 * Run:  node scripts/make-chaman.cjs
 */
const path = require("path");
const k = require("./art/kit.cjs");

const { W, H, CX, r2, between, rand } = k;
const OUT = path.join(__dirname, "..", "public", "templates", "chaman");

const GOLD = "#b89b5e";
const GOLD_LIGHT = "#e3cf9c";
const SAGE = "#7d9479";

k.seed(31);

const WHITE = { roses: ["white", "cream", "white"], blossoms: ["white", "white", "blush"], leafTone: "eucalyptus", leaves: 16, buds: 2 };

function pavilion(cx, base, s) {
  return `<g transform="translate(${cx} ${base}) scale(${s})">
    <ellipse cx="0" cy="6" rx="150" ry="14" fill="#9fb09a" opacity="0.4" filter="url(#glow)"/>
    <rect x="-130" y="-24" width="260" height="24" fill="#f4f1ea" stroke="#cfc8b8" stroke-width="2"/>
    ${[-100, -34, 34, 100].map((x) => `<rect x="${x - 9}" y="-190" width="18" height="166" fill="#fbfaf6" stroke="#d6cfbf" stroke-width="1.5"/>`).join("")}
    ${[-67, 0, 67].map((x) => `<path d="M${x - 33} -100V-150Q${x} -196 ${x + 33} -150V-100" fill="none" stroke="#d6cfbf" stroke-width="2"/>`).join("")}
    <rect x="-140" y="-214" width="280" height="26" fill="#f6f3ec" stroke="#cfc8b8" stroke-width="2"/>
    <path d="M-110 -214C-110 -290 -50 -330 0 -360C50 -330 110 -290 110 -214Z" fill="#fbfaf6" stroke="#cfc8b8" stroke-width="2"/>
    <path d="M0 -360v-30" stroke="${GOLD}" stroke-width="5"/><circle cx="0" cy="-394" r="7" fill="${GOLD}"/>
    ${[-130, 130].map((x) => `<path d="M${x - 22} -214C${x - 22} -250 ${x} -262 ${x} -276C${x} -262 ${x + 22} -250 ${x + 22} -214Z" fill="#fbfaf6" stroke="#cfc8b8" stroke-width="2"/>`).join("")}
  </g>`;
}

function scene() {
  const arch = { hw: 380, spring: 560, apex: 190 };
  const extraDefs = `
  <radialGradient id="paper" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="#fbfaf4"/><stop offset="1" stop-color="#e9ece0"/></radialGradient>
  <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef1e6"/><stop offset="1" stop-color="#dfe7d6"/></linearGradient>
  <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efece2"/><stop offset="1" stop-color="#f8f6ef"/></linearGradient>`;
  let body = `<rect width="${W}" height="${H}" fill="url(#paper)"/>`;
  // watercolour washes of sage
  for (let i = 0; i < 9; i++) body += `<ellipse cx="${r2(between(0, W))}" cy="${r2(between(0, 1300))}" rx="${r2(between(120, 260))}" ry="${r2(between(80, 160))}" fill="#c9d6c2" opacity="0.25" filter="url(#soft)"/>`;
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)" opacity="0.6"/>`;

  // the garden view at the bottom: hedges along an aisle to a marble pavilion
  const top = 1240;
  body += `<rect y="${top}" width="${W}" height="${H - top}" fill="url(#gardenSky)"/>`;
  body += `<g fill="#b9c8b0">${Array.from({ length: 24 }, (_, i) => `<circle cx="${i * 48}" cy="${1520 - between(0, 40)}" r="${r2(between(40, 70))}"/>`).join("")}</g>`;
  body += `<rect y="1520" width="${W}" height="${H - 1520}" fill="#a9bba0"/>`;
  body += pavilion(CX, 1560, 0.8);
  body += `<path d="M${CX - 40} 1560L${CX - 260} ${H}H${CX + 260}L${CX + 40} 1560Z" fill="url(#aisle)"/>`;
  // hedges with white flowers either side of the aisle
  [[-1], [1]].forEach(([dir]) => {
    body += `<path d="M${CX + dir * 50} 1560L${CX + dir * 300} ${H}H${dir < 0 ? 0 : W}V1520Z" fill="#7f9b78"/>`;
    for (let i = 0; i < 40; i++) {
      const t = between(0, 1);
      const x = CX + dir * (60 + t * 300 + between(0, 300) * (0.2 + t));
      const y = 1560 + t * 360;
      body += k.blossom(x, y, r2(6 + t * 10), rand() > 0.2 ? "white" : "blush");
    }
  });
  for (let i = 0; i < 40; i++) body += `<ellipse cx="${r2(between(CX - 220, CX + 220))}" cy="${r2(between(1640, 1910))}" rx="${r2(between(4, 8))}" ry="${r2(between(2.5, 4))}" transform="rotate(${r2(between(0, 180))})" fill="#fffdf8" stroke="#ded6c6" stroke-width="0.6"/>`;
  // the floral arch over the aisle
  const ar = 250;
  const archTop = 1330;
  for (let a = 180; a <= 360; a += 9) {
    const rad = (a * Math.PI) / 180;
    const x = CX + Math.cos(rad) * ar;
    const y = archTop + ar + Math.sin(rad) * ar;
    body += k.leaf(x, y, a + between(-60, 60), between(36, 50), "eucalyptus");
  }
  for (const side of [-1, 1]) for (let y = archTop + ar; y < 1900; y += 34) body += k.leaf(CX + side * ar + between(-14, 14), y, between(0, 360), between(34, 48), "eucalyptus");
  for (let a = 180; a <= 360; a += 15) {
    const rad = (a * Math.PI) / 180;
    body += k.rose(CX + Math.cos(rad) * ar, archTop + ar + Math.sin(rad) * ar, r2(between(24, 34)), between(0, 360), rand() > 0.3 ? "white" : "cream");
  }
  for (const side of [-1, 1]) for (let y = archTop + ar + 30; y < 1880; y += 60) body += k.rose(CX + side * ar + between(-8, 8), y, r2(between(22, 30)), between(0, 360), rand() > 0.3 ? "white" : "cream");
  // the couple walking down the aisle
  body += k.couple(CX + 10, 1880, 0.82, {
    lehenga: "#f4e2d6", lehengaDeep: "#d8bba8", dupatta: "#f1e4d8", trim: "#c9a964",
    sherwani: "#efe6d4", sherwaniDeep: "#cdbf9f", trousers: "#f6f1e6", turban: "#e9d9b5",
  });
  // big white arrangements where the aisle begins
  body += k.cluster(40, 1780, 260, { ...WHITE, count: 8, size: [40, 80] });
  body += k.cluster(1040, 1800, 250, { ...WHITE, count: 8, size: [40, 78] });

  // the words sit inside a fine gold arch
  const frame = k.pointedArch({ ...arch, bottom: 1250 });
  body += `<path d="${frame}" fill="#fdfcf7" opacity="0.75"/>`;
  body += `<path d="${frame}" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
  body += `<path d="${k.pointedArch({ hw: arch.hw - 16, spring: arch.spring + 6, apex: arch.apex + 20, bottom: 1234 })}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="5" stroke-dasharray="0 12" stroke-linecap="round"/>`;
  body += `<path d="M${CX} 90l16 30l-16 40l-16 -40Z" fill="${GOLD_LIGHT}" stroke="${GOLD}" stroke-width="2"/>`;
  // white roses and eucalyptus over the corners and down the sides
  body += k.cluster(60, 60, 280, { ...WHITE, count: 9, size: [40, 84], leaves: 20 });
  body += k.cluster(1020, 60, 280, { ...WHITE, count: 9, size: [40, 84], leaves: 20 });
  body += k.sprig([120, 340], [60, 600], [120, 860], [70, 1120], { leaves: 12, flowers: 5, leafTone: "eucalyptus", stem: SAGE });
  body += k.sprig([960, 340], [1020, 600], [960, 860], [1010, 1120], { leaves: 12, flowers: 5, leafTone: "eucalyptus", stem: SAGE });
  body += k.cluster(80, 1180, 150, { ...WHITE, count: 5, size: [30, 56] }) + k.cluster(1000, 1180, 150, { ...WHITE, count: 5, size: [30, 56] });
  return k.svg(body, { extraDefs, emboss: "#4e5a48", embossOpacity: 0.28 });
}

// ---------------------------------------------------------------- the sehra

function sehraHalf(side) {
  let body = "";
  const xs = [];
  for (let x = side === "left" ? 12 : CX + 12; x < (side === "left" ? CX : W); x += 26) xs.push(x);
  xs.forEach((x, i) => {
    body += k.flowerString(x, 150 + (i % 2) * 6, 1800, { kind: "jasmine", sway: between(-8, 8), gap: 15 });
    if (i % 3 === 1) for (let y = 380 + between(0, 200); y < 1880; y += between(360, 520)) body += k.rose(x, y, 15, between(0, 90), "red");
  });
  return k.svg(body, { emboss: "#5c5547", embossOpacity: 0.35 });
}

function sehraTop() {
  let body = `<rect y="0" width="${W}" height="170" fill="#7a1222"/>`;
  body += `<rect y="0" width="${W}" height="170" fill="url(#zari)"/>`;
  body += `<rect y="150" width="${W}" height="16" fill="${GOLD_LIGHT}"/><rect y="12" width="${W}" height="10" fill="${GOLD_LIGHT}"/>`;
  for (let x = 30; x < W; x += 74) body += k.rose(x, 86, 30, between(0, 360), x % 3 ? "red" : "wine");
  for (let x = 66; x < W; x += 74) body += `<circle cx="${x}" cy="86" r="10" fill="${GOLD_LIGHT}" stroke="${GOLD}" stroke-width="2"/>`;
  for (let x = 14; x < W; x += 26) body += `<path d="M${x} 166q6 14 0 22q-6 -8 0 -22Z" fill="${GOLD_LIGHT}"/>`;
  const extraDefs = `<pattern id="zari" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 4L36 20L20 36L4 20Z" fill="none" stroke="${GOLD}" stroke-width="1.2" opacity="0.5"/></pattern>`;
  return k.svg(body, { extraDefs, emboss: "#2a0208", embossOpacity: 0.45 });
}

k.writeAll(OUT, [
  ["scene", scene(), { quality: 84 }],
  ["sehra-left", sehraHalf("left"), { quality: 72, alphaQuality: 80 }],
  ["sehra-right", sehraHalf("right"), { quality: 72, alphaQuality: 80 }],
  ["sehra-top", sehraTop(), {}],
]);
