/**
 * Draws the small ornaments used INSIDE the Royal designs (their page body, after the opening):
 *   gulab-mahal/rose-corner.webp   blush roses for card corners
 *   laal-gulab/rose-corner.webp    red roses for card corners
 *   mahtab/rose-corner.webp        blue and white roses for panel corners
 *   mahtab/moon-disc.webp          the full moon on its own
 *   chaman/wreath.webp             an oval eucalyptus and white rose wreath (empty centre, for the cameo)
 *   chaman/sprig.webp              a eucalyptus sprig with white blossoms
 *   mehfil/parasol.webp            one mirror work parasol
 *   mehfil/swag.webp               a marigold swag
 * Corner pieces are drawn for the top-left corner; CSS flips them for the other corners.
 * Run:  node scripts/make-royal-ornaments.cjs
 */
const path = require("path");
const k = require("./art/kit.cjs");

const { r2, between, rand } = k;
const DIR = (key) => path.join(__dirname, "..", "public", "templates", key);

k.seed(71);

function corner(opts, emboss) {
  const body = k.cluster(70, 70, 230, { count: 7, size: [34, 74], leaves: 14, buds: 3, ...opts }) + k.cluster(250, 40, 110, { count: 3, size: [22, 40], leaves: 6, buds: 1, ...opts }) + k.cluster(40, 250, 110, { count: 3, size: [22, 40], leaves: 6, buds: 1, ...opts });
  return k.svg(body, { w: 420, h: 420, ...emboss });
}

function moonDisc() {
  const extraDefs = `<radialGradient id="face" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#fffdf3"/><stop offset="0.7" stop-color="#f6ecc8"/><stop offset="1" stop-color="#e3d2a0"/></radialGradient>`;
  let body = `<circle cx="200" cy="200" r="190" fill="#f7e9b8" opacity="0.18" filter="url(#soft)"/><circle cx="200" cy="200" r="120" fill="url(#face)"/>`;
  [[-34, -22, 24], [38, 20, 18], [-8, 44, 13], [44, -42, 11], [-52, 32, 9]].forEach(([x, y, r]) => (body += `<circle cx="${200 + x}" cy="${200 + y}" r="${r}" fill="#c9b680" opacity="0.18"/>`));
  return k.svg(body, { w: 400, h: 400, extraDefs });
}

function wreath() {
  // an oval ring of eucalyptus leaves with white roses at the top and bottom
  const cx = 350;
  const cy = 450;
  const rx = 280;
  const ry = 380;
  let body = "";
  for (let i = 0; i < 170; i++) {
    const a = (i / 170) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx;
    const y = cy + Math.sin(a) * ry;
    body += k.leaf(x + between(-18, 18), y + between(-18, 18), (a * 180) / Math.PI + 90 + between(-50, 50), between(38, 54), rand() > 0.3 ? "eucalyptus" : "sage");
  }
  const flowers = { roses: ["white", "cream", "white"], blossoms: ["white", "blush"], leafTone: "eucalyptus", leaves: 8, buds: 2 };
  body += k.cluster(cx - 150, cy + ry - 60, 120, { ...flowers, count: 4, size: [30, 56] });
  body += k.cluster(cx + 170, cy - ry + 80, 100, { ...flowers, count: 3, size: [26, 48] });
  return k.svg(body, { w: 700, h: 900, emboss: "#4e5a48", embossOpacity: 0.28 });
}

function sprig() {
  const body =
    k.sprig([20, 110], [180, 40], [380, 170], [580, 90], { leaves: 16, flowers: 6, size: 1.2, leafTone: "eucalyptus", stem: "#7d9479" }) +
    k.rose(300, 104, 26, 20, "white") + k.bud(330, 80, 14, 40, "cream");
  return k.svg(body, { w: 600, h: 200, emboss: "#4e5a48", embossOpacity: 0.28 });
}

function parasol() {
  const x = 200;
  const y = 260;
  const r = 180;
  const top = y - r * 0.62;
  const mirror = (mx, my) => `<circle cx="${r2(mx)}" cy="${r2(my)}" r="7" fill="#e9eef2" stroke="#d9a62e" stroke-width="1.8"/><circle cx="${r2(mx - 2)}" cy="${r2(my - 2)}" r="2.4" fill="#fff"/>`;
  let body = `<path d="M${x} 0V${r2(top)}" stroke="#7a5a20" stroke-width="4"/><clipPath id="d"><path d="M${x - r} ${y}C${x - r} ${r2(y - r * 0.5)} ${r2(x - r * 0.55)} ${r2(top)} ${x} ${r2(top)}C${r2(x + r * 0.55)} ${r2(top)} ${x + r} ${r2(y - r * 0.5)} ${x + r} ${y}Z"/></clipPath>`;
  body += `<g filter="url(#emboss)"><g clip-path="url(#d)"><rect x="${x - r}" y="${r2(top)}" width="${2 * r}" height="${r}" fill="#c2185b"/>`;
  for (let i = 0; i < 12; i += 2) {
    const x0 = x - r + (i * 2 * r) / 12;
    const x1 = x - r + ((i + 1) * 2 * r) / 12;
    body += `<path d="M${x} ${r2(top)}L${r2(x0 - (x - x0) * 0.15)} ${y + 4}H${r2(x1 - (x - x1) * 0.15)}Z" fill="#f06292"/>`;
  }
  body += `</g>`;
  for (let i = 0; i < 14; i++) {
    const hx = x - r + ((i + 0.5) * 2 * r) / 14;
    body += `<circle cx="${r2(hx)}" cy="${y}" r="${r2(r / 14)}" fill="#c2185b" stroke="#d9a62e" stroke-width="2"/><path d="M${r2(hx)} ${r2(y + r / 14)}v40" stroke="#d9a62e" stroke-width="2"/><circle cx="${r2(hx)}" cy="${r2(y + r / 14 + 44)}" r="6" fill="${i % 2 ? "#ff7a1a" : "#f7c21a"}"/>`;
  }
  body += `<path d="M${x - r} ${y}H${x + r}" stroke="#d9a62e" stroke-width="6"/>`;
  for (let i = 1; i < 7; i++) body += mirror(x - r + (i * 2 * r) / 7, y - r * 0.18);
  body += `</g><circle cx="${x}" cy="${r2(top)}" r="11" fill="#d9a62e"/>`;
  return k.svg(body, { w: 400, h: 360, emboss: "#5a2a00", embossOpacity: 0.35 });
}

function swag() {
  let body = "";
  for (let t = 0; t <= 1.0001; t += 1 / 46) {
    const x = 20 + t * 1040;
    const y = 30 + Math.sin(t * Math.PI) * 150;
    body += k.marigold(x, y, 17, Math.round(t * 46) % 3 === 2 ? "yellow" : "orange");
  }
  for (let t = 0.08; t < 0.95; t += 0.14) body += k.leaf(20 + t * 1040, 52 + Math.sin(t * Math.PI) * 150, 90, 44, "green") + k.rose(20 + t * 1040, 56 + Math.sin(t * Math.PI) * 150, 20, 0, "fuchsia");
  return k.svg(body, { w: 1080, h: 240, emboss: "#5a2a00", embossOpacity: 0.35 });
}

(async () => {
  await k.writeAll(DIR("gulab-mahal"), [["rose-corner", corner({ roses: ["pink", "cream", "pink"], blossoms: ["white", "blush"], leafTone: "sage" }), {}]]);
  await k.writeAll(DIR("laal-gulab"), [["rose-corner", corner({ roses: ["red", "wine", "cream"], blossoms: ["white", "blush"], leafTone: "dark" }, { emboss: "#2a0208", embossOpacity: 0.4 }), {}]]);
  await k.writeAll(DIR("mahtab"), [
    ["rose-corner", corner({ roses: ["white", "blue", "navy"], blossoms: ["blue", "white"], leafTone: "blue" }, { emboss: "#02061a", embossOpacity: 0.45 }), {}],
    ["moon-disc", moonDisc(), { quality: 88 }],
  ]);
  await k.writeAll(DIR("chaman"), [["wreath", wreath(), {}], ["sprig", sprig(), {}]]);
  await k.writeAll(DIR("mehfil"), [["parasol", parasol(), {}], ["swag", swag(), {}]]);
})();
