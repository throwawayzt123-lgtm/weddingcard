/**
 * Draws the artwork of the "Mehfil" design (a colourful mehndi night) into public/templates/mehfil:
 *   base.webp      the card: a mirror work arch for the words, the couple in green and yellow, a dholak,
 *                  marigolds and diyas
 *   parasols.webp  the row of hanging mirror work parasols (drops in from the top)
 *   garlands.webp  marigold strings down the sides and a swag across the top (swings in)
 *   wreath.webp    the marigold wreath on the cover
 * Run:  node scripts/make-mehfil.cjs
 */
const path = require("path");
const k = require("./art/kit.cjs");

const { W, H, CX, r2, between, rand } = k;
const OUT = path.join(__dirname, "..", "public", "templates", "mehfil");

const FUCHSIA = "#c2185b";
const ORANGE = "#f57c00";
const GOLD = "#d9a62e";

k.seed(47);

const mirror = (x, y, r = 5) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="#e9eef2" stroke="${GOLD}" stroke-width="1.6"/><circle cx="${r2(x - r * 0.3)}" cy="${r2(y - r * 0.3)}" r="${r2(r * 0.35)}" fill="#fff"/>`;

function base() {
  const arch = { hw: 390, spring: 700, apex: 360, bottom: 1440, lobes: 7, depth: 0.6 };
  const extraDefs = `
  <radialGradient id="warm" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#fff3c8"/><stop offset="1" stop-color="#ffcf5c"/></radialGradient>
  <pattern id="mandala" width="180" height="180" patternUnits="userSpaceOnUse">
    <circle cx="90" cy="90" r="60" fill="none" stroke="${ORANGE}" stroke-width="1.4"/><circle cx="90" cy="90" r="40" fill="none" stroke="${FUCHSIA}" stroke-width="1"/>
    ${Array.from({ length: 12 }, (_, i) => `<ellipse cx="90" cy="42" rx="7" ry="16" transform="rotate(${i * 30} 90 90)" fill="none" stroke="${ORANGE}" stroke-width="1"/>`).join("")}
  </pattern>
  <linearGradient id="dhol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0392b"/><stop offset="0.5" stop-color="#e2553f"/><stop offset="1" stop-color="#8e2318"/></linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d27a"/><stop offset="1" stop-color="#b98522"/></linearGradient>`;
  let body = `<rect width="${W}" height="${H}" fill="url(#warm)"/><rect width="${W}" height="${H}" fill="url(#mandala)" opacity="0.12"/>`;
  // the arch panel with a mirror work border
  const archPath = k.cuspedArch(arch);
  const outer = k.cuspedArch({ ...arch, hw: arch.hw + 30, apex: arch.apex - 34, spring: arch.spring - 10, bottom: arch.bottom + 30 });
  body += `<path d="${outer}" fill="${FUCHSIA}"/>`;
  body += `<path d="${outer}" fill="none" stroke="${GOLD}" stroke-width="4"/>`;
  body += `<path d="${archPath}" fill="#fffaf0" stroke="${ORANGE}" stroke-width="6"/>`;
  body += `<path d="${k.cuspedArch({ ...arch, hw: arch.hw - 16, apex: arch.apex + 18, spring: arch.spring + 6, bottom: arch.bottom - 16 })}" fill="none" stroke="${GOLD}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round"/>`;
  for (let y = arch.spring; y < arch.bottom + 20; y += 44) body += mirror(CX - arch.hw - 15, y) + mirror(CX + arch.hw + 15, y);
  for (let x = CX - arch.hw; x <= CX + arch.hw; x += 44) body += mirror(x, arch.bottom + 15);
  body += `<rect x="${CX - arch.hw - 30}" y="${arch.bottom}" width="${arch.hw * 2 + 60}" height="30" fill="none"/>`;
  // small paisleys inside the top of the arch
  [[-120, 520], [120, 520]].forEach(([dx, y], i) => (body += `<path transform="translate(${CX + dx} ${y}) scale(${i ? -1.4 : 1.4} 1.4)" d="M0 0C-12 -2 -16 -16 -8 -24C0 -31 14 -26 12 -12C10 -4 6 6 14 14C4 12 -2 8 0 0Z" fill="none" stroke="${FUCHSIA}" stroke-width="2.4"/>`));

  // ground: a woven dari with marigold heaps and diyas
  body += `<path d="M0 1700H${W}V${H}H0Z" fill="#e6a23a"/>`;
  for (let y = 1720; y < H; y += 36) body += `<path d="M0 ${y}H${W}" stroke="${y % 72 ? FUCHSIA : "#2e7d32"}" stroke-width="10" opacity="0.55"/>`;
  // the dholak
  body += `<g transform="translate(800 1770)">
    <ellipse cx="0" cy="96" rx="190" ry="20" fill="#000" opacity="0.18" filter="url(#glow)"/>
    <rect x="-150" y="-70" width="300" height="140" rx="40" fill="url(#dhol)"/>
    ${Array.from({ length: 9 }, (_, i) => `<path d="M${-130 + i * 32} -66L${-114 + i * 32} 66" stroke="#f3e2b5" stroke-width="4"/><path d="M${-114 + i * 32} -66L${-130 + i * 32} 66" stroke="#f3e2b5" stroke-width="2" opacity="0.7"/>`).join("")}
    <ellipse cx="-150" cy="0" rx="30" ry="70" fill="#f6e7c4" stroke="#7a3b16" stroke-width="5"/><ellipse cx="150" cy="0" rx="30" ry="70" fill="#f1dfb5" stroke="#7a3b16" stroke-width="5"/>
    <path d="M-120 -70H120M-120 70H120" stroke="${GOLD}" stroke-width="6"/>
  </g>`;
  // the brass urli with floating flowers
  body += `<g transform="translate(560 1860)"><ellipse cx="0" cy="0" rx="120" ry="30" fill="#7a4a10"/><path d="M-120 0Q0 90 120 0Z" fill="url(#brass)"/><ellipse cx="0" cy="0" rx="112" ry="24" fill="#f4b04b" opacity="0.6"/></g>`;
  [[-60, 0], [0, -6], [60, 2]].forEach(([dx, dy], i) => (body += i === 1 ? k.diya(560 + dx, 1860 + dy, 1.2) : k.marigold(560 + dx, 1856 + dy, 18, i ? "yellow" : "orange")));
  // the couple, in green and yellow
  body += k.couple(270, 1880, 0.98, {
    lehenga: "#23955a", lehengaDeep: "#0f5a30", dupatta: "#f7c21a", trim: "#ff7a1a",
    sherwani: "#f2c63e", sherwaniDeep: "#c9961a", trousers: "#fff6e0",
  });
  // marigold heaps, rose petals and diyas along the front
  for (let i = 0; i < 18; i++) body += k.marigold(between(20, 1060), between(1880, 1910), r2(between(14, 20)), rand() > 0.5 ? "orange" : "yellow");
  [[60, 1860], [500, 1905], [700, 1900], [1020, 1860], [960, 1910]].forEach(([x, y]) => (body += k.diya(x, y, 1.3)));
  for (let i = 0; i < 40; i++) body += `<ellipse cx="${r2(between(20, 1060))}" cy="${r2(between(1720, 1900))}" rx="${r2(between(6, 10))}" ry="${r2(between(3.5, 6))}" transform="rotate(${r2(between(0, 180))})" fill="${rand() > 0.5 ? "#e0338a" : "#ff8a1c"}" opacity="0.9"/>`;
  return k.svg(body, { extraDefs, emboss: "#6a3a00", embossOpacity: 0.3 });
}

function parasol(x, y, r, main, light) {
  const panels = 10;
  const id = `dome${x}`;
  const top = y - r * 0.62;
  let out = `<path d="M${x} 0V${r2(top)}" stroke="#7a5a20" stroke-width="3"/>`;
  out += `<clipPath id="${id}"><path d="M${x - r} ${y}C${x - r} ${r2(y - r * 0.5)} ${r2(x - r * 0.55)} ${r2(top)} ${x} ${r2(top)}C${r2(x + r * 0.55)} ${r2(top)} ${x + r} ${r2(y - r * 0.5)} ${x + r} ${y}Z"/></clipPath>`;
  out += `<g filter="url(#emboss)"><g clip-path="url(#${id})"><rect x="${x - r}" y="${r2(top)}" width="${2 * r}" height="${r}" fill="${main}"/>`;
  // stripes run from the top of the dome down to the hem
  for (let i = 0; i < panels; i += 2) {
    const x0 = x - r + (i * 2 * r) / panels;
    const x1 = x - r + ((i + 1) * 2 * r) / panels;
    out += `<path d="M${x} ${r2(top)}L${r2(x0 - (x - x0) * 0.15)} ${y + 4}H${r2(x1 - (x - x1) * 0.15)}Z" fill="${light}"/>`;
  }
  out += `<path d="M${x - r} ${y}C${x - r} ${r2(y - r * 0.5)} ${r2(x - r * 0.55)} ${r2(top)} ${x} ${r2(top)}" fill="none" stroke="#fff" stroke-width="6" opacity="0.25"/></g>`;
  // scalloped hem, mirrors and a beaded fringe
  for (let i = 0; i < 12; i++) {
    const hx = x - r + ((i + 0.5) * 2 * r) / 12;
    out += `<circle cx="${r2(hx)}" cy="${y}" r="${r2(r / 12)}" fill="${main}" stroke="${GOLD}" stroke-width="2"/>`;
    out += `<path d="M${r2(hx)} ${r2(y + r / 12)}v${r2(r * 0.22)}" stroke="${GOLD}" stroke-width="2"/><circle cx="${r2(hx)}" cy="${r2(y + r / 12 + r * 0.24)}" r="5" fill="${i % 2 ? "#ff7a1a" : "#f7c21a"}"/>`;
  }
  out += `<path d="M${x - r} ${y}H${x + r}" stroke="${GOLD}" stroke-width="5"/>`;
  for (let i = 1; i < 6; i++) out += mirror(x - r + (i * 2 * r) / 6, y - r * 0.18, 6);
  out += `</g><circle cx="${x}" cy="${r2(y - r * 0.64)}" r="9" fill="${GOLD}"/>`;
  return out;
}

function parasols() {
  let body = "";
  // a swag of marigolds between the parasol cords sits behind them
  body += parasol(130, 250, 120, "#2e9e44", "#7ccf5a");
  body += parasol(950, 250, 120, "#7b1fa2", "#c06ad8");
  body += parasol(335, 330, 105, ORANGE, "#ffb347");
  body += parasol(745, 330, 105, "#00897b", "#4dc4b4");
  body += parasol(540, 230, 135, FUCHSIA, "#f06292");
  return k.svg(body, { emboss: "#5a2a00", embossOpacity: 0.35 });
}

function garlands() {
  let body = "";
  [24, 64].forEach((x, i) => (body += k.flowerString(x, -10, 1560 - i * 120, { kind: "marigold", sway: 4 })));
  [W - 24, W - 64].forEach((x, i) => (body += k.flowerString(x, -10, 1560 - i * 120, { kind: "marigold", sway: -4 })));
  // the swag across the top
  for (let t = 0; t <= 1.0001; t += 1 / 40) {
    const x = 90 + t * (W - 180);
    const y = 40 + Math.sin(t * Math.PI) * 120;
    body += k.marigold(x, y, 16, Math.round(t * 40) % 3 === 2 ? "yellow" : "orange");
  }
  for (let t = 0.1; t < 0.95; t += 0.2) body += k.leaf(90 + t * (W - 180), 60 + Math.sin(t * Math.PI) * 120, 90, 46, "green") + k.rose(90 + t * (W - 180), 60 + Math.sin(t * Math.PI) * 120, 20, 0, "fuchsia");
  return k.svg(body, { emboss: "#5a2a00", embossOpacity: 0.35 });
}

function wreath() {
  const c = [CX, 900];
  const R = 300;
  let body = "";
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    body += k.leaf(c[0] + Math.cos(a) * (R + 40), c[1] + Math.sin(a) * (R + 40), (a * 180) / Math.PI + between(-40, 40), 56, "green");
  }
  for (let ring = 0; ring < 2; ring++) {
    const n = 34 - ring * 4;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.09;
      body += k.marigold(c[0] + Math.cos(a) * (R - ring * 48), c[1] + Math.sin(a) * (R - ring * 48), 30 - ring * 4, (i + ring) % 3 === 0 ? "yellow" : "orange");
    }
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    body += k.rose(c[0] + Math.cos(a) * (R - 24), c[1] + Math.sin(a) * (R - 24), 26, between(0, 360), "fuchsia");
  }
  return k.svg(body, { emboss: "#5a2a00", embossOpacity: 0.4 });
}

k.writeAll(OUT, [
  ["base", base(), { quality: 84 }],
  ["parasols", parasols(), {}],
  ["garlands", garlands(), {}],
  ["wreath", wreath(), {}],
]);
