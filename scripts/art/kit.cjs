/**
 * Shared drawing kit for the illustrated designs (Laal Gulab, Mahtab, Chaman, Mehfil).
 * Everything is plain SVG text, turned into WebP by sharp. Every picture of a design uses the
 * same 1080 × 1920 canvas, so the layers line up exactly on screen.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const W = 1080;
const H = 1920;
const CX = W / 2;

const r2 = (n) => Math.round(n * 10) / 10;

// A small seeded random generator, so every run draws the same picture
let state = 7;
const seed = (n) => (state = n);
const rand = () => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const between = (a, b) => a + rand() * (b - a);
const pick = (list) => list[Math.floor(rand() * list.length)];

// ---------------------------------------------------------------- shapes

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
  ];
};

/**
 * A Mughal (cusped) arch: straight sides from `bottom` up to `spring`, then a pointed arch to the apex,
 * edged with scallops whose points face into the opening. A closed path around the opening.
 */
function cuspedArch({ cx = CX, hw, spring, apex, bottom = H + 20, lobes = 6, depth = 0.6 }) {
  const left = [[cx - hw, spring], [cx - hw, spring - (spring - apex) * 0.62], [cx - hw * 0.28, apex + (spring - apex) * 0.2], [cx, apex]];
  const pts = [];
  for (let i = 0; i <= lobes; i++) pts.push(cubic(...left, i / lobes));
  const right = pts.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y]);
  const all = [...pts, ...right];
  let d = `M${r2(cx - hw)} ${bottom}L${r2(cx - hw)} ${spring}`;
  for (let i = 1; i < all.length; i++) {
    const [x0, y0] = all[i - 1];
    const [x1, y1] = all[i];
    const chord = Math.hypot(x1 - x0, y1 - y0);
    d += `A${r2(chord * depth)} ${r2(chord * depth)} 0 0 0 ${r2(x1)} ${r2(y1)}`;
  }
  return `${d}L${r2(cx + hw)} ${bottom}Z`;
}

/** A plain pointed arch, closed along the bottom. */
function pointedArch({ cx = CX, hw, spring, apex, bottom = H + 20 }) {
  const k = r2(spring - (spring - apex) * 0.62);
  const j = r2(apex + (spring - apex) * 0.2);
  return `M${cx - hw} ${bottom}L${cx - hw} ${spring}C${cx - hw} ${k} ${r2(cx - hw * 0.28)} ${j} ${cx} ${apex}C${r2(cx + hw * 0.28)} ${j} ${cx + hw} ${k} ${cx + hw} ${spring}L${cx + hw} ${bottom}Z`;
}

/** A round topped (Roman) arch, closed along the bottom. */
function roundArch({ cx = CX, hw, spring, bottom = H + 20 }) {
  return `M${cx - hw} ${bottom}L${cx - hw} ${spring}A${hw} ${hw} 0 0 1 ${cx + hw} ${spring}L${cx + hw} ${bottom}Z`;
}

// ---------------------------------------------------------------- colours

/** Rose colours: [light petal, deep petal, petal edge, heart]. */
const ROSE = {
  pink: ["#f9d7d0", "#e3a2a0", "#c27b7d", "#b8676d"],
  cream: ["#fff6ec", "#ead2bd", "#d2b49c", "#c9a587"],
  gold: ["#f1d9a6", "#c9a052", "#9c7a35", "#8a6a2c"],
  red: ["#d8404f", "#8e1424", "#6a0d1a", "#560a15"],
  wine: ["#b8304a", "#6e0f22", "#4f0918", "#3c0611"],
  white: ["#ffffff", "#ece4d8", "#cfc3b2", "#d9c9a8"],
  blue: ["#dbe6f3", "#8fa9cf", "#5d7aa6", "#4e6a96"],
  navy: ["#9fb6da", "#3e5a8c", "#2b4270", "#22375f"],
  peach: ["#ffe2cc", "#f2a98a", "#d4826a", "#c86f58"],
  fuchsia: ["#ff9cc8", "#d0236f", "#a51a58", "#8c124a"],
};
const BLOSSOM = {
  white: ["#fffaf4", "#d9c2b2", "#e3b778"],
  blush: ["#f6d3cf", "#d29c98", "#e3b778"],
  pink: ["#efc4bd", "#d29c98", "#e3b778"],
  blue: ["#cddcf0", "#8ea6c8", "#f3e3b0"],
  yellow: ["#ffe27a", "#d9a628", "#f08a00"],
  orange: ["#ffb347", "#e07b00", "#c45a00"],
  magenta: ["#f37fb4", "#b81f66", "#ffd34d"],
  red: ["#e2556a", "#9b1a2c", "#f5d38a"],
};
const LEAF = {
  sage: ["#b9bfa3", "#d9dcc6", "#8b927a"],
  rose: ["#c99583", "#e5c0ae", "#a87766"],
  dark: ["#2f4a2c", "#5c7a4a", "#26391f"],
  green: ["#4f8a3c", "#8fbf5a", "#3c6a2c"],
  eucalyptus: ["#9fb3a6", "#c9d6cc", "#7d958a"],
  blue: ["#6d86a8", "#a7b9d1", "#506a8e"],
  gold: ["#b8913a", "#e6cb85", "#8a6a2c"],
};

// ---------------------------------------------------------------- flowers

const PETAL = "M0 0C-15 -6 -19 -30 0 -33C19 -30 15 -6 0 0Z";

/** A layered rose, seen from above. */
function rose(x, y, r, rot = 0, tone = "pink") {
  const [, , edge, heart] = ROSE[tone];
  const s = r / 34;
  const ring = (n, scale, off) =>
    Array.from({ length: n }, (_, i) => `<path d="${PETAL}" transform="rotate(${r2((360 / n) * i + off)}) scale(${scale})"/>`).join("");
  return (
    `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(s * 100) / 100})" filter="url(#emboss)">` +
    `<g fill="url(#rose-${tone})" stroke="${edge}" stroke-width="1.1">${ring(7, 1.05, 0)}${ring(6, 0.78, 25)}${ring(5, 0.55, 8)}</g>` +
    `<circle r="9" fill="${heart}" opacity="0.85"/>` +
    `<path d="M-6 1A6 6 0 1 1 6 2A4.5 4.5 0 1 1 -3 -2" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>` +
    `</g>`
  );
}

/** A rose bud (side view). */
function bud(x, y, r, rot, tone = "pink") {
  const [light, deep, edge] = ROSE[tone];
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) scale(${r2(r / 20)})" filter="url(#emboss)"><path d="M0 0C-12 -6 -12 -26 0 -34C12 -26 12 -6 0 0Z" fill="${deep}" stroke="${edge}"/><path d="M0 -4C-7 -10 -6 -24 0 -30C5 -22 6 -10 0 -4Z" fill="${light}" opacity="0.6"/><path d="M0 0L-10 6M0 0L10 6" stroke="#6f7f55" stroke-width="3"/></g>`;
}

/** A small five petalled blossom (jasmine, cherry, hydrangea floret). */
function blossom(x, y, r, tone = "white") {
  const [fill, edge, heart] = BLOSSOM[tone];
  const petals = [0, 72, 144, 216, 288]
    .map((a) => `<ellipse cy="${r2(-r * 0.55)}" rx="${r2(r * 0.42)}" ry="${r2(r * 0.55)}" transform="rotate(${a})"/>`)
    .join("");
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(between(0, 72))})"><g fill="${fill}" stroke="${edge}" stroke-width="0.8">${petals}</g><circle r="${r2(r * 0.2)}" fill="${heart}"/></g>`;
}

/** A round marigold (genda): many small ruffled petals in rings. */
function marigold(x, y, r, tone = "orange") {
  const [outer, inner, edge] = tone === "orange" ? ["#ff9a1f", "#ffb84d", "#d86f00"] : ["#ffd23f", "#ffe680", "#d9a400"];
  let out = `<g transform="translate(${r2(x)} ${r2(y)})" filter="url(#emboss)"><circle r="${r2(r)}" fill="${outer}" stroke="${edge}" stroke-width="1"/>`;
  [[1, 14], [0.72, 11], [0.45, 8]].forEach(([k, n], ring) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.4;
      out += `<circle cx="${r2(Math.cos(a) * r * k * 0.8)}" cy="${r2(Math.sin(a) * r * k * 0.8)}" r="${r2(r * 0.26)}" fill="${ring === 1 ? inner : outer}" stroke="${edge}" stroke-width="0.7"/>`;
    }
  });
  return `${out}<circle r="${r2(r * 0.22)}" fill="${inner}"/></g>`;
}

function leaf(x, y, angle, len, tone = "sage") {
  const vein = LEAF[tone][2];
  const s = len / 40;
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)}) scale(${r2(s * 100) / 100})" filter="url(#emboss)"><path d="M0 0C10 -11 28 -11 40 0C28 11 10 11 0 0Z" fill="url(#leaf-${tone})" stroke="${vein}" stroke-width="0.9"/><path d="M3 0H34" stroke="${vein}" stroke-width="0.8" opacity="0.7"/></g>`;
}

/** A curved stem with leaves and blossoms along it. */
function sprig(p0, p1, p2, p3, { leaves = 7, flowers = 4, size = 1, tone = "white", leafTone = "sage", stem = "#9a8f74" } = {}) {
  let out = `<path d="M${p0.join(" ")}C${p1.join(" ")} ${p2.join(" ")} ${p3.join(" ")}" fill="none" stroke="${stem}" stroke-width="${r2(2.2 * size)}" stroke-linecap="round"/>`;
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    const [x, y] = cubic(p0, p1, p2, p3, t);
    const [x2, y2] = cubic(p0, p1, p2, p3, Math.min(1, t + 0.02));
    const a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    out += leaf(x, y, a + (i % 2 ? -50 : 50), between(26, 38) * size, leafTone);
  }
  for (let i = 0; i < flowers; i++) {
    const [x, y] = cubic(p0, p1, p2, p3, 0.35 + (0.65 * i) / Math.max(1, flowers - 1));
    out += blossom(x + between(-8, 8), y + between(-8, 8), between(9, 13) * size, tone);
  }
  return out;
}

/** A hanging cascade of tiny flowers (wisteria / jasmine strings). */
function cascade(x, y, len, { width = 26, tones = ["white", "white", "white", "blush"], sway = 0, stem = "#a49a80" } = {}) {
  let out = `<path d="M${r2(x)} ${r2(y)}q${r2(sway * 0.5)} ${r2(len * 0.5)} ${r2(sway)} ${r2(len)}" stroke="${stem}" stroke-width="1.4" fill="none"/>`;
  const count = Math.round(len / 9);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const spread = width * (1 - t * 0.75);
    const r = between(5, 8.5) * (1 - t * 0.45);
    out += blossom(x + sway * t * t + between(-spread, spread) * 0.5, y + len * t + between(-4, 4), r, pick(tones));
  }
  return out;
}

/** A straight string of flowers, e.g. a marigold ladi or a jasmine (motia) string of a sehra. */
function flowerString(x, y, len, { kind = "marigold", sway = 0, gap } = {}) {
  const step = gap ?? (kind === "marigold" ? 26 : 15);
  let out = `<path d="M${r2(x)} ${r2(y)}q${r2(sway / 2)} ${r2(len / 2)} ${r2(sway)} ${r2(len)}" stroke="${kind === "marigold" ? "#7a5a20" : "#b7ab92"}" stroke-width="1.6" fill="none"/>`;
  for (let d = 0; d <= len; d += step) {
    const t = d / len;
    const px = x + sway * t * t;
    const py = y + d;
    if (kind === "marigold") out += marigold(px, py, between(11, 14), (d / step) % 3 === 2 ? "yellow" : "orange");
    else if (kind === "jasmine") out += `<ellipse cx="${r2(px)}" cy="${r2(py)}" rx="5.5" ry="7.5" fill="#fffdf6" stroke="#d6cbb5" stroke-width="0.8"/>`;
    else out += blossom(px, py, between(8, 10), kind);
  }
  return out;
}

/**
 * A loose bouquet around a point: roses of the given tones, leaves and small blossoms.
 * `spread` is the radius it fills.
 */
function cluster(cx, cy, spread, { roses = ["pink", "cream"], count = 5, size = [32, 58], blossoms = ["white"], leafTone = "sage", leaves = 10, buds = 2 } = {}) {
  let out = "";
  for (let i = 0; i < leaves; i++) {
    const a = between(0, Math.PI * 2);
    const d = between(spread * 0.45, spread * 1.05);
    out += leaf(cx + Math.cos(a) * d * 0.8, cy + Math.sin(a) * d * 0.8, (a * 180) / Math.PI + between(-30, 30), between(40, 62), leafTone);
  }
  for (let i = 0; i < buds; i++) {
    const a = between(0, Math.PI * 2);
    out += bud(cx + Math.cos(a) * spread, cy + Math.sin(a) * spread, between(14, 20), (a * 180) / Math.PI + 90, roses[0]);
  }
  const placed = [];
  for (let i = 0; i < count; i++) {
    const r = i === 0 ? size[1] : between(size[0], size[1] * 0.85);
    const a = i === 0 ? 0 : between(0, Math.PI * 2);
    const d = i === 0 ? 0 : between(spread * 0.3, spread * 0.75);
    placed.push([cx + Math.cos(a) * d, cy + Math.sin(a) * d, r]);
  }
  placed.sort((p, q) => p[2] - q[2]).forEach(([x, y, r], i) => (out += rose(x, y, r, between(0, 360), roses[i % roses.length])));
  for (let i = 0; i < Math.round(spread / 9); i++) {
    const a = between(0, Math.PI * 2);
    const d = between(spread * 0.2, spread);
    out += blossom(cx + Math.cos(a) * d, cy + Math.sin(a) * d, between(7, 12), pick(blossoms));
  }
  return out;
}

// ---------------------------------------------------------------- lights

/** A Moroccan style hanging lantern with a warm glow. */
function lantern(x, y, s = 1, chainFrom = 0, metal = "#9c7244") {
  return (
    `<path d="M${x} ${chainFrom}V${y}" stroke="${metal}" stroke-width="${r2(1.6 * s)}"/>` +
    `<circle cx="${x}" cy="${r2(y + 40 * s)}" r="${r2(46 * s)}" fill="#ffcf86" opacity="0.55" filter="url(#glow)"/>` +
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<path d="M0 0L-7 10H7Z" fill="${metal}"/>` +
    `<path d="M-14 12H14L18 26C22 44 20 56 12 66H-12C-20 56 -22 44 -18 26Z" fill="#ffe1a6" stroke="${metal}" stroke-width="2.4"/>` +
    `<path d="M-14 26H14M-17 44H17M0 12V66M-9 12L-12 66M9 12L12 66" stroke="${metal}" stroke-width="1.4" opacity="0.8"/>` +
    `<path d="M-12 66H12L6 74H-6Z" fill="${metal}"/><circle cy="78" r="3" fill="${metal}"/>` +
    `</g>`
  );
}

/** A standing floor lantern with a candle. */
function floorLantern(x, y, s = 1, metal = "#a37a4c") {
  return `<circle cx="${x}" cy="${r2(y - 40 * s)}" r="${r2(70 * s)}" fill="#ffcf86" opacity="0.6" filter="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0H30L26 -80H-26Z" fill="#fde1a8" stroke="${metal}" stroke-width="3"/><path d="M-26 -80Q0 -120 26 -80" fill="${metal}" stroke="${metal}" stroke-width="3"/><path d="M0 -122v-10" stroke="${metal}" stroke-width="3"/><path d="M-15 0V-80M15 0V-80M-28 -40H28" stroke="${metal}" stroke-width="1.6"/><rect x="-7" y="-46" width="14" height="30" fill="#fff6e4"/><path d="M0 -60q-6 8 0 13q6 -5 0 -13Z" fill="#ffc861"/></g>`;
}

function candle(x, y, h = 30, w = 14) {
  return `<circle cx="${x}" cy="${y - h}" r="${r2(w * 1.6)}" fill="#ffd38a" opacity="0.7" filter="url(#glow)"/><rect x="${r2(x - w / 2)}" y="${y - h}" width="${w}" height="${h}" fill="#fbf1df"/><path d="M${x} ${y - h - 13}q-5 7 0 11q5 -4 0 -11Z" fill="#ffc861"/>`;
}

/** A small diya (oil lamp) with its flame. */
function diya(x, y, s = 1) {
  return `<circle cx="${x}" cy="${r2(y - 10 * s)}" r="${r2(20 * s)}" fill="#ffc861" opacity="0.7" filter="url(#glow)"/><g transform="translate(${x} ${y}) scale(${s})"><path d="M-16 -6Q0 10 16 -6Z" fill="#c26a2c" stroke="#8a4518" stroke-width="1.5"/><path d="M0 -20q-5 7 0 12q5 -5 0 -12Z" fill="#ffb326"/></g>`;
}

function chandelier(x, top, y, gold = "#b8925a") {
  let out = `<path d="M${x} ${top}V${y}" stroke="${gold}" stroke-width="2.4"/>`;
  out += `<ellipse cx="${x}" cy="${y + 90}" rx="190" ry="120" fill="#ffd79a" opacity="0.4" filter="url(#soft)"/>`;
  [{ dy: 40, rx: 50, n: 6 }, { dy: 95, rx: 105, n: 10 }, { dy: 150, rx: 140, n: 12 }].forEach(({ dy, rx, n }) => {
    const cy = y + dy;
    out += `<path d="M${x - rx} ${cy}Q${x} ${cy + rx * 0.38} ${x + rx} ${cy}" fill="none" stroke="${gold}" stroke-width="3"/>`;
    for (let i = 0; i <= n; i++) {
      const cxp = x - rx + (2 * rx * i) / n;
      out += `<circle cx="${r2(cxp)}" cy="${cy - 16}" r="9" fill="#fff0c8" opacity="0.8" filter="url(#glow)"/><rect x="${r2(cxp - 2.5)}" y="${cy - 16}" width="5" height="14" fill="#fbf3e2"/><path d="M${r2(cxp)} ${cy - 26}q-3.5 5 0 9q3.5 -4 0 -9Z" fill="#ffd27a"/><path d="M${r2(cxp)} ${cy}v${r2(between(14, 30))}" stroke="#f3e6cc" stroke-width="1.2"/>`;
    }
  });
  return out + `<path d="M${x} ${y + 150}l-10 40h20Z" fill="${gold}"/><circle cx="${x}" cy="${y + 16}" r="10" fill="${gold}"/>`;
}

// ---------------------------------------------------------------- people

/**
 * A bride and groom standing side by side, seen from behind (bride on the left).
 * (x, y) is the point between their feet. Colours: { lehenga, lehengaDeep, dupatta, trim, sherwani, sherwaniDeep, trousers, turban }.
 */
function couple(x, y, s, c) {
  const id = `c${Math.floor(rand() * 1e6)}`;
  const butis = Array.from({ length: 34 }, () => {
    const by = between(-260, -10);
    const half = 40 + (by + 290) * 0.42;
    return `<circle cx="${r2(-40 + between(-half, half * 0.9))}" cy="${r2(by)}" r="${r2(between(2, 3.6))}" fill="${c.trim}" opacity="0.85"/>`;
  }).join("");
  const dupattaDots = Array.from({ length: 26 }, () => `<circle cx="${r2(between(-100, 14))}" cy="${r2(between(-420, -90))}" r="2" fill="${c.trim}" opacity="0.8"/>`).join("");
  const coatDots = Array.from({ length: 30 }, () => `<circle cx="${r2(between(26, 116))}" cy="${r2(between(-410, -160))}" r="1.7" fill="${c.trim}" opacity="0.55"/>`).join("");
  return `
  <g transform="translate(${x} ${y}) scale(${s})">
    <defs>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.lehengaDeep}"/><stop offset="0.5" stop-color="${c.lehenga}"/><stop offset="1" stop-color="${c.lehengaDeep}"/></linearGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.sherwaniDeep}"/><stop offset="0.5" stop-color="${c.sherwani}"/><stop offset="1" stop-color="${c.sherwaniDeep}"/></linearGradient>
    </defs>
    <ellipse cx="-10" cy="30" rx="210" ry="26" fill="#000" opacity="0.16" filter="url(#glow)"/>
    <!-- groom -->
    <path d="M44 -170H64L62 -4H42Z M80 -170H100L102 -4H82Z" fill="${c.trousers}"/>
    <ellipse cx="50" cy="-2" rx="15" ry="7" fill="#3a2a20"/><ellipse cx="94" cy="-2" rx="15" ry="7" fill="#3a2a20"/>
    <path d="M30 -418Q72 -440 114 -418Q130 -408 128 -380L124 -150Q72 -140 18 -150L14 -380Q12 -408 30 -418Z" fill="url(#${id}g)"/>
    ${coatDots}
    <path d="M18 -160Q72 -150 124 -160" stroke="${c.trim}" stroke-width="7" fill="none"/>
    <path d="M71 -420V-150" stroke="${c.sherwaniDeep}" stroke-width="2" opacity="0.6"/>
    <path d="M16 -400Q2 -330 8 -250" stroke="${c.sherwaniDeep}" stroke-width="20" stroke-linecap="round" fill="none"/>
    <path d="M128 -400Q142 -330 136 -250" stroke="${c.sherwaniDeep}" stroke-width="20" stroke-linecap="round" fill="none"/>
    <circle cx="8" cy="-244" r="9" fill="#c08f74"/><circle cx="136" cy="-244" r="9" fill="#c08f74"/>
    <rect x="62" y="-452" width="20" height="30" rx="6" fill="#c08f74"/>
    <path d="M56 -428Q72 -420 88 -428L90 -414Q72 -406 54 -414Z" fill="${c.trim}"/>
    ${c.turban
      ? `<ellipse cx="72" cy="-482" rx="31" ry="28" fill="${c.turban}"/><path d="M44 -490Q72 -470 100 -492M46 -478Q72 -458 98 -480M50 -500Q72 -486 96 -504" stroke="${c.trim}" stroke-width="2.4" fill="none"/><path d="M98 -500q22 -26 14 -48q-14 14 -18 40Z" fill="${c.turban}" stroke="${c.trim}" stroke-width="2"/>`
      : `<ellipse cx="72" cy="-478" rx="27" ry="31" fill="#2e1f1a"/>`}
    <!-- bride -->
    <path d="M-76 -292Q-40 -302 -4 -292C12 -200 62 -80 96 0Q30 46 -60 52Q-150 46 -176 0C-140 -80 -92 -200 -76 -292Z" fill="url(#${id}l)"/>
    ${butis}
    <path d="M-176 0Q-150 46 -60 52Q30 46 96 0" stroke="${c.trim}" stroke-width="12" fill="none"/>
    <path d="M-168 -16Q-60 30 86 -16" stroke="${c.trim}" stroke-width="3" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>
    <path d="M-80 -400Q-42 -414 -4 -400L4 -292H-84Z" fill="#c69277"/>
    <ellipse cx="-42" cy="-440" rx="23" ry="26" fill="#2e1f1a"/>
    <path d="M-120 -80L-104 -370C-102 -390 -90 -402 -66 -408C-70 -414 -74 -424 -74 -438C-74 -456 -66 -476 -44 -476C-22 -476 -12 -456 -12 -438C-12 -424 -16 -414 -20 -408C6 -402 16 -390 18 -370L26 -90Q-40 -50 -120 -80Z" fill="${c.dupatta}" opacity="0.86"/>
    ${dupattaDots}
    <path d="M-120 -80L-104 -370C-102 -390 -90 -402 -66 -408C-70 -414 -74 -424 -74 -438C-74 -456 -66 -476 -44 -476C-22 -476 -12 -456 -12 -438C-12 -424 -16 -414 -20 -408C6 -402 16 -390 18 -370L26 -90" stroke="${c.trim}" stroke-width="6" fill="none" stroke-linejoin="round"/>
    <path d="M-70 -430Q-44 -414 -16 -430" stroke="${c.trim}" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M-118 -80Q-40 -50 26 -90" stroke="${c.trim}" stroke-width="10" fill="none"/>
  </g>`;
}

// ---------------------------------------------------------------- output

function defs({ emboss = "#6e3f35", embossOpacity = 0.32 } = {}) {
  const roseGrads = Object.entries(ROSE)
    .map(([k, [light, deep]]) => `<linearGradient id="rose-${k}" x1="0" y1="-1" x2="0" y2="0.2"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${deep}"/></linearGradient>`)
    .join("");
  const leafGrads = Object.entries(LEAF)
    .map(([k, [a, b]]) => `<linearGradient id="leaf-${k}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`)
    .join("");
  return `${roseGrads}${leafGrads}
  <filter id="emboss" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="2.4"/><feOffset dx="1.5" dy="3" result="b"/>
    <feFlood flood-color="${emboss}" flood-opacity="${embossOpacity}"/><feComposite in2="b" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="lift" x="-10%" y="-10%" width="120%" height="125%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="14" result="b"/>
    <feFlood flood-color="#000" flood-opacity="0.35"/><feComposite in2="b" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0.1 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>`;
}

/** A whole SVG document on the shared canvas (or a custom size). */
function svg(body, { extraDefs = "", w = W, h = H, ...defOpts } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs(defOpts)}${extraDefs}</defs>${body}</svg>`;
}

/** Writes each [name, svgText, webpOptions] as <outDir>/<name>.webp (and .svg with --svg). */
async function writeAll(outDir, jobs) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, source, opts] of jobs) {
    if (process.argv.includes("--svg")) fs.writeFileSync(path.join(outDir, `${name}.svg`), source);
    await sharp(Buffer.from(source)).webp({ quality: 82, alphaQuality: 90, ...opts }).toFile(path.join(outDir, `${name}.webp`));
    console.log(`${path.basename(outDir)}/${name}.webp written`);
  }
}

module.exports = {
  W, H, CX, r2, seed, rand, between, pick, cubic,
  cuspedArch, pointedArch, roundArch,
  ROSE, BLOSSOM, LEAF,
  rose, bud, blossom, marigold, leaf, sprig, cascade, flowerString, cluster,
  lantern, floorLantern, candle, diya, chandelier, couple,
  svg, writeAll,
};
