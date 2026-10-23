/**
 * Draws the artwork of the "Laal Gulab" design (burgundy, gold and red roses) into public/templates/laal-gulab:
 *   velvet.webp    burgundy velvet scattered with red roses (the cover background)
 *   env-back.webp  the inside of the envelope (gold lined)
 *   card.webp      the ivory invitation card: gold arch, red roses, lanterns and the couple
 *   env-front.webp the front pocket of the envelope
 *   flap.webp      the top flap
 *   seal.webp      the wine red wax seal with a gold tassel (its own 400 × 720 canvas)
 * Run:  node scripts/make-laal-gulab.cjs
 */
const path = require("path");
const k = require("./art/kit.cjs");

const { W, H, CX, r2, between, rand } = k;
const OUT = path.join(__dirname, "..", "public", "templates", "laal-gulab");

const GOLD = "#c9a052";
const GOLD_LIGHT = "#ecd49a";
const GOLD_DARK = "#8f6c2a";
const WINE = "#6e0f22";

// The envelope, on the shared canvas
const ENV = { x0: 160, x1: 920, y0: 470, y1: 1540 };
const TIP = { x: CX, y: 1070 }; // where the flap point and the seal sit

k.seed(11);

// ---------------------------------------------------------------- velvet background

function velvet() {
  const extraDefs = `
  <radialGradient id="vel" cx="0.5" cy="0.45" r="0.75"><stop offset="0" stop-color="#8a1a2e"/><stop offset="0.6" stop-color="#5c0c1c"/><stop offset="1" stop-color="#33050f"/></radialGradient>
  <filter id="nap" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.012 0.6" numOctaves="3" seed="9" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.4  0 0 0 0 0.45  0 0 0 0.12 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;
  let body = `<rect width="${W}" height="${H}" fill="url(#vel)"/><rect width="${W}" height="${H}" fill="#000" filter="url(#nap)"/>`;
  // soft folds of the cloth
  for (let i = 0; i < 6; i++) body += `<path d="M${r2(between(-200, 1200))} -50Q${r2(between(0, 1080))} 960 ${r2(between(-200, 1200))} 1980" stroke="#a52a40" stroke-width="${r2(between(40, 90))}" fill="none" opacity="0.12" filter="url(#soft)"/>`;
  body += k.cluster(40, 60, 240, { roses: ["red", "wine"], count: 7, size: [40, 76], blossoms: ["white", "blush"], leafTone: "dark", leaves: 14 });
  body += k.cluster(1050, 120, 220, { roses: ["wine", "red"], count: 6, size: [40, 70], blossoms: ["white"], leafTone: "dark", leaves: 12 });
  body += k.cluster(30, 1860, 260, { roses: ["red", "wine", "cream"], count: 7, size: [40, 78], blossoms: ["white"], leafTone: "dark", leaves: 14 });
  body += k.cluster(1060, 1800, 240, { roses: ["wine", "red"], count: 6, size: [40, 72], blossoms: ["white", "blush"], leafTone: "dark", leaves: 12 });
  for (let i = 0; i < 40; i++) body += `<ellipse cx="${r2(between(40, 1040))}" cy="${r2(between(200, 1800))}" rx="${r2(between(8, 15))}" ry="${r2(between(5, 9))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? "#b3182f" : "#8e1424"}" opacity="0.9" filter="url(#emboss)"/>`;
  [[150, 1700], [980, 1720], [960, 360]].forEach(([x, y]) => (body += k.candle(x, y, 70, 30)));
  return k.svg(body, { extraDefs, emboss: "#1a0207", embossOpacity: 0.5 });
}

// ---------------------------------------------------------------- the card

function damask() {
  return `<pattern id="damask" width="140" height="180" patternUnits="userSpaceOnUse">
    <path d="M70 20C90 40 100 60 70 90C40 60 50 40 70 20Z M70 90C100 110 110 140 70 160C30 140 40 110 70 90Z M0 90C15 100 15 120 0 130M140 90C125 100 125 120 140 130" fill="none" stroke="${GOLD}" stroke-width="2"/>
    <circle cx="70" cy="90" r="5" fill="${GOLD}"/>
  </pattern>`;
}

function card() {
  const arch = { hw: 410, spring: 600, apex: 250, bottom: 1860, lobes: 7, depth: 0.6 };
  const extraDefs = `${damask()}
  <radialGradient id="paperGlow" cx="0.5" cy="0.42" r="0.7"><stop offset="0" stop-color="#fdf8ee"/><stop offset="1" stop-color="#efe2c9"/></radialGradient>`;
  let body = `<rect width="${W}" height="${H}" fill="url(#paperGlow)"/>`;
  body += `<rect width="${W}" height="${H}" fill="url(#damask)" opacity="0.13"/>`;
  body += `<rect width="${W}" height="${H}" fill="#000" filter="url(#grain)"/>`;
  // the inner arch panel, a little paler, with a gold double frame
  body += `<path d="${k.cuspedArch(arch)}" fill="#fdf9f1"/>`;
  body += `<path d="${k.cuspedArch(arch)}" fill="none" stroke="${GOLD}" stroke-width="5"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw + 20, apex: arch.apex - 24, spring: arch.spring - 8, bottom: arch.bottom + 18 })}" fill="none" stroke="${GOLD_LIGHT}" stroke-width="7" stroke-dasharray="0 14" stroke-linecap="round"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw - 18, apex: arch.apex + 22, spring: arch.spring + 8, bottom: arch.bottom - 18 })}" fill="none" stroke="${GOLD}" stroke-width="1.6"/>`;
  // a finial on the arch and a fine outer border
  body += `<path d="M${CX} 150l18 34l-18 44l-18 -44Z" fill="${GOLD_LIGHT}" stroke="${GOLD_DARK}" stroke-width="2"/>`;
  body += `<rect x="34" y="34" width="${W - 68}" height="${H - 68}" fill="none" stroke="${GOLD}" stroke-width="3"/><rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="${GOLD}" stroke-width="1.2"/>`;
  // a fine gold scroll under the apex, where the Bismillah sits
  body += `<path d="M${CX - 150} 330Q${CX - 75} 300 ${CX} 330Q${CX + 75} 300 ${CX + 150} 330" fill="none" stroke="${GOLD}" stroke-width="1.6" opacity="0.7"/>`;
  // gold lanterns
  body += k.lantern(250, 330, 1.25, 0, GOLD_DARK) + k.lantern(830, 330, 1.25, 0, GOLD_DARK);
  body += k.lantern(330, 210, 0.85, 0, GOLD_DARK) + k.lantern(750, 210, 0.85, 0, GOLD_DARK);
  // trailing rose vines down the sides of the arch
  body += k.sprig([110, 300], [80, 600], [140, 900], [100, 1200], { leaves: 12, flowers: 0, leafTone: "dark", stem: "#4a5a34" });
  body += k.sprig([970, 300], [1000, 600], [940, 900], [980, 1180], { leaves: 12, flowers: 0, leafTone: "dark", stem: "#4a5a34" });
  [[100, 520], [128, 760], [104, 1010], [978, 520], [954, 780], [980, 1020]].forEach(([x, y], i) => (body += k.rose(x, y, 28, i * 40, i % 2 ? "wine" : "red") + k.bud(x + 22, y + 40, 15, 160, "red")));
  // big rose clusters in the corners
  body += k.cluster(60, 70, 280, { roses: ["red", "wine", "cream"], count: 8, size: [40, 82], blossoms: ["white", "blush"], leafTone: "dark", leaves: 16, buds: 3 });
  body += k.cluster(1030, 70, 270, { roses: ["wine", "red", "red"], count: 8, size: [40, 80], blossoms: ["white"], leafTone: "dark", leaves: 16, buds: 3 });
  body += k.cluster(70, 1840, 300, { roses: ["red", "cream", "wine"], count: 9, size: [40, 84], blossoms: ["white", "blush"], leafTone: "dark", leaves: 18, buds: 3 });
  // the couple, bottom right, on a scatter of petals
  for (let i = 0; i < 50; i++) body += `<ellipse cx="${r2(between(560, 1060))}" cy="${r2(between(1800, 1900))}" rx="${r2(between(7, 12))}" ry="${r2(between(4, 7))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? "#b3182f" : "#d8404f"}" opacity="0.9"/>`;
  body += k.couple(835, 1860, 0.98, {
    lehenga: "#b0182f", lehengaDeep: "#6e0b1c", dupatta: "#a8142a", trim: "#e0bb6a",
    sherwani: "#3a1a1f", sherwaniDeep: "#1c0b0e", trousers: "#efe6d6", turban: "#e9d6a6",
  });
  body += k.cluster(1060, 1880, 150, { roses: ["red", "wine"], count: 4, size: [34, 60], blossoms: ["white"], leafTone: "dark", leaves: 8 });
  [[360, 1850], [410, 1870], [300, 1880]].forEach(([x, y], i) => (body += k.candle(x, y, 40 + i * 12, 18)));
  return k.svg(body, { extraDefs, emboss: "#4a1a10", embossOpacity: 0.32 });
}

// ---------------------------------------------------------------- the envelope

const flapPath = `M${ENV.x0} ${ENV.y0}H${ENV.x1}L${TIP.x} ${TIP.y}Z`;
const frontPath = `M${ENV.x0} ${ENV.y0}L${TIP.x} ${TIP.y - 50}L${ENV.x1} ${ENV.y0}V${ENV.y1}H${ENV.x0}Z`;

const envDefs = `
  <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf5e9"/><stop offset="1" stop-color="#efe3cc"/></linearGradient>
  <linearGradient id="ivorySide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#eee2ca"/><stop offset="0.5" stop-color="#f8f0e0"/><stop offset="1" stop-color="#eee2ca"/></linearGradient>`;

function filigree(x, y, s, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round"><path d="M0 0C30 0 50 20 50 50M0 0C0 30 20 50 50 50M14 14C40 10 60 30 74 4M14 14C10 40 30 60 4 74"/><circle cx="50" cy="50" r="5" fill="${GOLD}"/><circle cx="74" cy="4" r="3" fill="${GOLD}"/><circle cx="4" cy="74" r="3" fill="${GOLD}"/></g>`;
}

function envBack() {
  let body = `<g filter="url(#lift)"><rect x="${ENV.x0}" y="${ENV.y0}" width="${ENV.x1 - ENV.x0}" height="${ENV.y1 - ENV.y0}" rx="10" fill="${WINE}"/></g>`;
  body += `<rect x="${ENV.x0 + 24}" y="${ENV.y0 + 24}" width="${ENV.x1 - ENV.x0 - 48}" height="${ENV.y1 - ENV.y0 - 48}" fill="url(#damask)" opacity="0.5"/>`;
  return k.svg(body, { extraDefs: `${envDefs}${damask()}` });
}

function envFront() {
  let body = `<path d="${frontPath}" fill="url(#ivory)"/>`;
  body += `<path d="${frontPath}" fill="#000" filter="url(#grain)"/>`;
  body += `<path d="M${ENV.x0} ${ENV.y1}L${TIP.x} ${TIP.y + 40}L${ENV.x1} ${ENV.y1}" fill="url(#ivorySide)" stroke="#d9c7a3" stroke-width="2"/>`;
  body += `<path d="M${ENV.x0 + 30} ${ENV.y1 - 30}L${TIP.x} ${TIP.y + 76}L${ENV.x1 - 30} ${ENV.y1 - 30}" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
  body += `<rect x="${ENV.x0 + 16}" y="${ENV.y0 + 16}" width="${ENV.x1 - ENV.x0 - 32}" height="${ENV.y1 - ENV.y0 - 32}" fill="none" stroke="${GOLD}" stroke-width="2.4" opacity="0.9"/>`;
  body += filigree(ENV.x0 + 30, ENV.y1 - 30, 1, -90) + filigree(ENV.x1 - 30, ENV.y1 - 30, 1, 180);
  body += k.cluster(ENV.x0 + 40, ENV.y1 - 40, 120, { roses: ["red", "wine"], count: 4, size: [26, 50], blossoms: ["white"], leafTone: "dark", leaves: 8, buds: 1 });
  body += k.cluster(ENV.x1 - 40, ENV.y1 - 40, 110, { roses: ["wine", "red"], count: 3, size: [26, 46], blossoms: ["white"], leafTone: "dark", leaves: 8, buds: 1 });
  return k.svg(body, { extraDefs: envDefs });
}

function flap() {
  let body = `<g filter="url(#lift)"><path d="${flapPath}" fill="url(#ivory)"/></g>`;
  body += `<path d="${flapPath}" fill="#000" filter="url(#grain)"/>`;
  body += `<path d="M${ENV.x0 + 40} ${ENV.y0 + 18}H${ENV.x1 - 40}L${TIP.x} ${TIP.y - 44}Z" fill="none" stroke="${GOLD}" stroke-width="3"/>`;
  body += `<path d="M${ENV.x0 + 80} ${ENV.y0 + 36}H${ENV.x1 - 80}L${TIP.x} ${TIP.y - 92}Z" fill="none" stroke="${GOLD_LIGHT}" stroke-width="6" stroke-dasharray="0 13" stroke-linecap="round"/>`;
  body += filigree(ENV.x0 + 30, ENV.y0 + 10, 0.8, 0) + filigree(ENV.x1 - 30, ENV.y0 + 10, 0.8, 90);
  return k.svg(body, { extraDefs: envDefs });
}

function seal() {
  const S = 400;
  const c = 200;
  const N = 18;
  const rim = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2;
    const r = 160 + (i % 2 ? 9 : -4) + between(-4, 4);
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let blob = `M${mid(rim[N - 1], rim[0]).map(r2).join(" ")}`;
  rim.forEach((p, i) => (blob += `Q${p.map(r2).join(" ")} ${mid(p, rim[(i + 1) % N]).map(r2).join(" ")}`));
  const extraDefs = `
    <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#b8304a"/><stop offset="0.55" stop-color="#7a0f24"/><stop offset="1" stop-color="#4a0614"/></radialGradient>
    <linearGradient id="tassel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9c7432"/><stop offset="0.5" stop-color="#f0d38a"/><stop offset="1" stop-color="#9c7432"/></linearGradient>`;
  // the gold cord and tassel hang below the seal
  let threads = "";
  for (let i = 0; i < 26; i++) threads += `<path d="M${r2(c - 34 + i * 2.7)} 520Q${r2(c - 40 + i * 3.1)} 620 ${r2(c - 46 + i * 3.6)} 690" stroke="${i % 3 ? "#d9b462" : "#a07a34"}" stroke-width="2.4" fill="none"/>`;
  const body = `
    <path d="M${c} 300C${c - 30} 380 ${c + 30} 420 ${c} 470" stroke="url(#tassel)" stroke-width="9" fill="none"/>
    ${threads}
    <path d="M${c - 32} 470H${c + 32}L${c + 26} 530H${c - 26}Z" fill="url(#tassel)" stroke="#8a6a2c" stroke-width="2"/>
    <path d="M${c - 30} 490H${c + 30}M${c - 28} 510H${c + 28}" stroke="#8a6a2c" stroke-width="2"/>
    <g filter="url(#lift)"><path d="${blob}Z" fill="url(#wax)"/></g>
    <circle cx="${c}" cy="${c}" r="122" fill="#7e1328" stroke="#4a0614" stroke-width="3"/>
    <circle cx="${c}" cy="${c}" r="110" fill="none" stroke="${GOLD}" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
    ${k.leaf(c - 30, c + 40, 150, 56, "gold")}${k.leaf(c + 30, c + 40, 30, 56, "gold")}
    ${k.rose(c, c - 6, 50, 0, "gold")}${k.rose(c - 58, c + 22, 26, 30, "gold")}${k.rose(c + 58, c + 22, 26, 60, "gold")}
    <ellipse cx="${c - 60}" cy="${c - 70}" rx="40" ry="18" transform="rotate(-35 ${c - 60} ${c - 70})" fill="#fff" opacity="0.14"/>`;
  return k.svg(body, { extraDefs, w: S, h: 720, emboss: "#2a0208", embossOpacity: 0.45 });
}

k.writeAll(OUT, [
  ["velvet", velvet(), { quality: 80 }],
  ["card", card(), { quality: 84 }],
  ["env-back", envBack(), {}],
  ["env-front", envFront(), {}],
  ["flap", flap(), {}],
  ["seal", seal(), { quality: 88, alphaQuality: 95 }],
]);
