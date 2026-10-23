/**
 * Builds assets for the 5 new Royal designs:
 *  1. shahi-pardah    (Imperial Chiffon Curtains & Grand Lantern Stage)
 *  2. shahi-farman    (Royal Imperial Scroll in Velvet Casket)
 *  3. qasr-e-noor     (Crystal Ballroom Palace & Baroque Gold Gates)
 *  4. anand-karaj     (Royal Gurdwara Sanctum & Pastel Silk Canopy)
 *  5. shahi-banafsha  (Imperial Amethyst Velvet & Scalloped Gold Die-Cut)
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const W = 1080;
const H = 1920;
const CX = W / 2;

const BRAIN_DIR = "C:/Users/aa/.gemini/antigravity-ide/brain/a7c81767-08a2-4264-8a8f-02ed51c0fa53";
const TEMPLATES_ROOT = path.join(__dirname, "..", "public", "templates");

const SOURCES = {
  "shahi-pardah": path.join(BRAIN_DIR, "shahi_pardah_scene_1792794982999.jpg"),
  "shahi-farman": path.join(BRAIN_DIR, "shahi_farman_scene_1792795042286.jpg"),
  "qasr-e-noor": path.join(BRAIN_DIR, "qasr_noor_scene_1792795101671.jpg"),
  "anand-karaj": path.join(BRAIN_DIR, "anand_karaj_scene_1792795165099.jpg"),
  "shahi-banafsha": path.join(BRAIN_DIR, "shahi_banafsha_scene_1792795235554.jpg"),
};

async function buildAll() {
  for (const [key, srcFile] of Object.entries(SOURCES)) {
    const dir = path.join(TEMPLATES_ROOT, key);
    fs.mkdirSync(dir, { recursive: true });

    // 1. Process main card scene
    console.log(`Processing card for ${key}...`);
    await sharp(srcFile)
      .resize(W, H, { fit: "cover", position: "center" })
      .webp({ quality: 84 })
      .toFile(path.join(dir, "card.webp"));
  }

  // ------------------------------------------------ 1. SHAHI PARDAH (Curtains & Backdrop)
  console.log("Generating layers for shahi-pardah...");
  const spDir = path.join(TEMPLATES_ROOT, "shahi-pardah");
  
  // Crimson velvet backdrop
  const spVelvetSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="vg" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#4a0d1a"/>
        <stop offset="60%" stop-color="#2a050e"/>
        <stop offset="100%" stop-color="#120105"/>
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.2  0 0 0 0 0.3  0 0 0 0.08 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#vg)"/>
    <rect width="${W}" height="${H}" fill="#000" filter="url(#grain)"/>
    <!-- Gold border -->
    <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none" stroke="#d4af37" stroke-width="2.5" opacity="0.75"/>
    <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#fce4a6" stroke-width="1" opacity="0.6"/>
  </svg>`;
  await sharp(Buffer.from(spVelvetSvg)).webp().toFile(path.join(spDir, "velvet.webp"));

  // Left Curtain (Ivory chiffon with draped folds and gold fringe)
  const spCurtainLeft = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CX} ${H}">
    <defs>
      <linearGradient id="cfolds" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fdfbf5"/>
        <stop offset="25%" stop-color="#e2d6bf"/>
        <stop offset="50%" stop-color="#fcf9ee"/>
        <stop offset="75%" stop-color="#c9bba2"/>
        <stop offset="100%" stop-color="#f5ede0"/>
      </linearGradient>
    </defs>
    <path d="M0 0 L${CX} 0 Q${CX * 0.45} 800 ${CX * 0.25} 1200 Q${CX * 0.15} 1600 0 ${H} Z" fill="url(#cfolds)"/>
    <!-- Gold tieback rope and tassel -->
    <path d="M0 1020 Q${CX * 0.3} 1040 ${CX * 0.3} 1070" stroke="#d4af37" stroke-width="12" fill="none"/>
    <circle cx="${CX * 0.3}" cy="1070" r="14" fill="#d4af37"/>
    <path d="M${CX * 0.3 - 8} 1084 L${CX * 0.3 + 8} 1084 L${CX * 0.3 + 18} 1220 L${CX * 0.3 - 18} 1220 Z" fill="#b8860b"/>
  </svg>`;
  await sharp(Buffer.from(spCurtainLeft)).webp().toFile(path.join(spDir, "curtain-left.webp"));

  // Right Curtain
  const spCurtainRight = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CX} ${H}">
    <defs>
      <linearGradient id="cfolds2" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#fdfbf5"/>
        <stop offset="25%" stop-color="#e2d6bf"/>
        <stop offset="50%" stop-color="#fcf9ee"/>
        <stop offset="75%" stop-color="#c9bba2"/>
        <stop offset="100%" stop-color="#f5ede0"/>
      </linearGradient>
    </defs>
    <path d="M${CX} 0 L0 0 Q${CX * 0.55} 800 ${CX * 0.75} 1200 Q${CX * 0.85} 1600 ${CX} ${H} Z" fill="url(#cfolds2)"/>
    <path d="M${CX} 1020 Q${CX * 0.7} 1040 ${CX * 0.7} 1070" stroke="#d4af37" stroke-width="12" fill="none"/>
    <circle cx="${CX * 0.7}" cy="1070" r="14" fill="#d4af37"/>
    <path d="M${CX * 0.7 - 8} 1084 L${CX * 0.7 + 8} 1084 L${CX * 0.7 + 18} 1220 L${CX * 0.7 - 18} 1220 Z" fill="#b8860b"/>
  </svg>`;
  await sharp(Buffer.from(spCurtainRight)).webp().toFile(path.join(spDir, "curtain-right.webp"));

  // Tassel Seal
  const spSealSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <defs>
      <radialGradient id="sg" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#faecc8"/>
        <stop offset="50%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#805d15"/>
      </radialGradient>
      <filter id="ds"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.5"/></filter>
    </defs>
    <circle cx="120" cy="120" r="105" fill="url(#sg)" filter="url(#ds)"/>
    <circle cx="120" cy="120" r="92" fill="none" stroke="#faecc8" stroke-width="3" stroke-dasharray="6,4"/>
    <path d="M85 145 L120 75 L155 145 Z" fill="#805d15" opacity="0.8"/>
    <!-- Imperial Crown -->
    <path d="M88 135 L96 95 L112 115 L120 85 L128 115 L144 95 L152 135 Z" fill="#faecc8"/>
    <circle cx="96" cy="92" r="4" fill="#faecc8"/>
    <circle cx="120" cy="82" r="4.5" fill="#faecc8"/>
    <circle cx="144" cy="92" r="4" fill="#faecc8"/>
    <rect x="88" y="137" width="64" height="7" rx="3" fill="#faecc8"/>
  </svg>`;
  await sharp(Buffer.from(spSealSvg)).webp().toFile(path.join(spDir, "seal.webp"));

  // ------------------------------------------------ 2. SHAHI FARMAN (Casket, Lid, Seal)
  console.log("Generating layers for shahi-farman...");
  const sfDir = path.join(TEMPLATES_ROOT, "shahi-farman");
  
  const sfCasketSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="bgv" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#380911"/>
        <stop offset="70%" stop-color="#1e0409"/>
        <stop offset="100%" stop-color="#0a0103"/>
      </radialGradient>
      <linearGradient id="goldrim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fae7b5"/>
        <stop offset="50%" stop-color="#c99c37"/>
        <stop offset="100%" stop-color="#735212"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bgv)"/>
    <!-- Casket body -->
    <rect x="140" y="320" width="${W - 280}" height="1280" rx="28" fill="#25060b" stroke="url(#goldrim)" stroke-width="8"/>
    <rect x="160" y="340" width="${W - 320}" height="1240" rx="20" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="8,6" opacity="0.6"/>
  </svg>`;
  await sharp(Buffer.from(sfCasketSvg)).webp().toFile(path.join(sfDir, "casket.webp"));

  // Casket Lid
  const sfLidSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 800">
    <defs>
      <linearGradient id="lidv" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4a0c16"/>
        <stop offset="85%" stop-color="#2a050d"/>
        <stop offset="100%" stop-color="#140205"/>
      </linearGradient>
      <linearGradient id="goldbar" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c99c37"/>
        <stop offset="50%" stop-color="#fae7b5"/>
        <stop offset="100%" stop-color="#c99c37"/>
      </linearGradient>
    </defs>
    <rect x="130" y="40" width="${W - 260}" height="700" rx="30" fill="url(#lidv)" stroke="url(#goldbar)" stroke-width="10"/>
    <rect x="160" y="70" width="${W - 320}" height="640" rx="22" fill="none" stroke="#f6dfa3" stroke-width="2.5" opacity="0.7"/>
    <!-- Gold Medallion Inlay on Lid -->
    <circle cx="${CX}" cy="390" r="90" fill="none" stroke="url(#goldbar)" stroke-width="6"/>
    <circle cx="${CX}" cy="390" r="76" fill="none" stroke="#f6dfa3" stroke-width="1.5" stroke-dasharray="4,4"/>
  </svg>`;
  await sharp(Buffer.from(sfLidSvg)).webp().toFile(path.join(sfDir, "lid.webp"));
  await sharp(Buffer.from(spSealSvg)).webp().toFile(path.join(sfDir, "seal.webp"));

  // ------------------------------------------------ 3. QASR-E-NOOR (Gates, Crest, Sky)
  console.log("Generating layers for qasr-e-noor...");
  const qnDir = path.join(TEMPLATES_ROOT, "qasr-e-noor");
  
  // Left Palace Gate
  const qnGateLeft = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CX} ${H}">
    <defs>
      <linearGradient id="goldgate" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fdf1c9"/>
        <stop offset="45%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#805d15"/>
      </linearGradient>
      <filter id="gshadow"><feDropShadow dx="8" dy="4" stdDeviation="8" flood-opacity="0.6"/></filter>
    </defs>
    <!-- Gate Arch and Bars -->
    <path d="M20 180 L${CX} 180 L${CX} ${H - 80} L20 ${H - 80} Z" fill="rgba(10,14,28,0.72)" stroke="url(#goldgate)" stroke-width="12" filter="url(#gshadow)"/>
    <!-- Filigree Bars -->
    ${Array.from({ length: 6 }).map((_, i) => `<line x1="${60 + i * 75}" y1="200" x2="${60 + i * 75}" y2="${H - 100}" stroke="url(#goldgate)" stroke-width="4.5"/>`).join("")}
    <!-- Scrollwork flourishes -->
    <circle cx="${CX - 80}" cy="960" r="60" fill="none" stroke="url(#goldgate)" stroke-width="6"/>
    <path d="M80 600 Q${CX * 0.5} 700 ${CX - 40} 600" fill="none" stroke="url(#goldgate)" stroke-width="5"/>
    <path d="M80 1300 Q${CX * 0.5} 1200 ${CX - 40} 1300" fill="none" stroke="url(#goldgate)" stroke-width="5"/>
  </svg>`;
  await sharp(Buffer.from(qnGateLeft)).webp().toFile(path.join(qnDir, "gate-left.webp"));

  // Right Palace Gate
  const qnGateRight = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CX} ${H}">
    <defs>
      <linearGradient id="goldgate2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#fdf1c9"/>
        <stop offset="45%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#805d15"/>
      </linearGradient>
      <filter id="gshadow2"><feDropShadow dx="-8" dy="4" stdDeviation="8" flood-opacity="0.6"/></filter>
    </defs>
    <path d="M0 180 L${CX - 20} 180 L${CX - 20} ${H - 80} L0 ${H - 80} Z" fill="rgba(10,14,28,0.72)" stroke="url(#goldgate2)" stroke-width="12" filter="url(#gshadow2)"/>
    ${Array.from({ length: 6 }).map((_, i) => `<line x1="${50 + i * 75}" y1="200" x2="${50 + i * 75}" y2="${H - 100}" stroke="url(#goldgate2)" stroke-width="4.5"/>`).join("")}
    <circle cx="80" cy="960" r="60" fill="none" stroke="url(#goldgate2)" stroke-width="6"/>
    <path d="M40 600 Q${CX * 0.5} 700 ${CX - 80} 600" fill="none" stroke="url(#goldgate2)" stroke-width="5"/>
    <path d="M40 1300 Q${CX * 0.5} 1200 ${CX - 80} 1300" fill="none" stroke="url(#goldgate2)" stroke-width="5"/>
  </svg>`;
  await sharp(Buffer.from(qnGateRight)).webp().toFile(path.join(qnDir, "gate-right.webp"));

  // Crystal Monogram Crest
  const qnCrest = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280">
    <defs>
      <radialGradient id="cg" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="35%" stop-color="#fdf1c9"/>
        <stop offset="75%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#735212"/>
      </radialGradient>
      <filter id="cgl"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="140" cy="140" r="120" fill="url(#cg)" filter="url(#cgl)"/>
    <circle cx="140" cy="140" r="105" fill="#0d1428" stroke="#fdf1c9" stroke-width="3"/>
    <!-- Crystal Starburst -->
    <path d="M140 50 L146 120 L216 126 L154 148 L180 214 L138 160 L92 212 L120 148 L60 128 L132 120 Z" fill="#fdf1c9"/>
    <circle cx="140" cy="140" r="18" fill="#ffffff"/>
  </svg>`;
  await sharp(Buffer.from(qnCrest)).webp().toFile(path.join(qnDir, "crest.webp"));

  // ------------------------------------------------ 4. ANAND KARAJ (Pastel Chadar Canopy, Khanda Crest)
  console.log("Generating layers for anand-karaj...");
  const akDir = path.join(TEMPLATES_ROOT, "anand-karaj");

  // Soft Pink and Pearl Silk Chadar Canopy
  const akChadarSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="prg" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="#fef6f8"/>
        <stop offset="60%" stop-color="#fcdde4"/>
        <stop offset="100%" stop-color="#f5bac9"/>
      </radialGradient>
      <linearGradient id="goldlace" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c99c37"/>
        <stop offset="50%" stop-color="#faecc8"/>
        <stop offset="100%" stop-color="#c99c37"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#prg)"/>
    <!-- Embroidered Gold Border & Floral Garlands -->
    <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="24" fill="none" stroke="url(#goldlace)" stroke-width="4"/>
    <rect x="56" y="56" width="${W - 112}" height="${H - 112}" rx="18" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="6,5" opacity="0.7"/>
    <!-- Scalloped Top Valance -->
    <path d="M40 40 L${W - 40} 40 L${W - 40} 220 ${Array.from({ length: 10 }).map((_, i) => `Q${W - 40 - (i + 0.5) * 100} 270 ${W - 40 - (i + 1) * 100} 220`).join(" ")} Z" fill="#f8cfd9" stroke="url(#goldlace)" stroke-width="3"/>
    <!-- Pearl Drops -->
    ${Array.from({ length: 9 }).map((_, i) => `<circle cx="${140 + i * 100}" cy="274" r="7" fill="#ffffff" stroke="#d4af37" stroke-width="1.5"/>`).join("")}
  </svg>`;
  await sharp(Buffer.from(akChadarSvg)).webp().toFile(path.join(akDir, "chadar.webp"));

  // Khanda Golden Seal
  const akKhandaSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <defs>
      <radialGradient id="kg" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fff4db"/>
        <stop offset="45%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#805d15"/>
      </radialGradient>
      <filter id="kds"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-opacity="0.4"/></filter>
    </defs>
    <circle cx="120" cy="120" r="105" fill="url(#kg)" filter="url(#kds)"/>
    <circle cx="120" cy="120" r="92" fill="none" stroke="#fff4db" stroke-width="3"/>
    <!-- Khanda emblem (double-edged sword, chakra circle, two kirpans) -->
    <!-- Chakra circle -->
    <circle cx="120" cy="115" r="38" fill="none" stroke="#664910" stroke-width="8"/>
    <!-- Center Sword -->
    <path d="M117 48 L123 48 L124 150 L120 162 L116 150 Z" fill="#664910"/>
    <rect x="108" y="156" width="24" height="6" rx="2" fill="#664910"/>
    <!-- Left Kirpan -->
    <path d="M80 164 Q70 120 102 85 Q78 126 94 154 Z" fill="#664910"/>
    <!-- Right Kirpan -->
    <path d="M160 164 Q170 120 138 85 Q162 126 146 154 Z" fill="#664910"/>
  </svg>`;
  await sharp(Buffer.from(akKhandaSvg)).webp().toFile(path.join(akDir, "seal.webp"));

  // ------------------------------------------------ 5. SHAHI BANAFSHA (Purple Velvet, Scalloped Flap, Crown Jewel Seal)
  console.log("Generating layers for shahi-banafsha...");
  const sbDir = path.join(TEMPLATES_ROOT, "shahi-banafsha");

  // Velvet Background
  const sbVelvetSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="pvg" cx="50%" cy="42%" r="65%">
        <stop offset="0%" stop-color="#3b1647"/>
        <stop offset="65%" stop-color="#210a29"/>
        <stop offset="100%" stop-color="#0e0312"/>
      </radialGradient>
      <filter id="pgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.2  0 0 0 0 0.8  0 0 0 0.08 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#pvg)"/>
    <rect width="${W}" height="${H}" fill="#000" filter="url(#pgrain)"/>
    <rect x="36" y="36" width="${W - 72}" height="${H - 72}" rx="20" fill="none" stroke="#d4af37" stroke-width="2.5" opacity="0.8"/>
  </svg>`;
  await sharp(Buffer.from(sbVelvetSvg)).webp().toFile(path.join(sbDir, "velvet.webp"));

  // Amethyst Envelope Pocket Front
  const sbEnvFront = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="epurple" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#461b54"/>
        <stop offset="100%" stop-color="#240c2b"/>
      </linearGradient>
      <linearGradient id="goldline" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#c99c37"/>
        <stop offset="50%" stop-color="#faecc8"/>
        <stop offset="100%" stop-color="#c99c37"/>
      </linearGradient>
    </defs>
    <!-- Envelope Pocket -->
    <path d="M140 1060 L${CX} 1240 L${W - 140} 1060 L${W - 140} 1580 L140 1580 Z" fill="url(#epurple)" stroke="url(#goldline)" stroke-width="6"/>
  </svg>`;
  await sharp(Buffer.from(sbEnvFront)).webp().toFile(path.join(sbDir, "env-front.webp"));

  // Envelope Flap
  const sbFlap = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 700">
    <defs>
      <linearGradient id="flappurple" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2a0d33"/>
        <stop offset="100%" stop-color="#4e1f5e"/>
      </linearGradient>
    </defs>
    <path d="M140 40 L${W - 140} 40 L${CX} 580 Z" fill="url(#flappurple)" stroke="#d4af37" stroke-width="6"/>
  </svg>`;
  await sharp(Buffer.from(sbFlap)).webp().toFile(path.join(sbDir, "flap.webp"));

  // Amethyst Crown Medallion Seal
  const sbSeal = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
    <defs>
      <radialGradient id="amethystGlow" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#e0b0ff"/>
        <stop offset="40%" stop-color="#8a2be2"/>
        <stop offset="100%" stop-color="#380854"/>
      </radialGradient>
      <linearGradient id="gmedallion" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#faecc8"/>
        <stop offset="50%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#805d15"/>
      </linearGradient>
      <filter id="sealShadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity="0.55"/></filter>
    </defs>
    <circle cx="130" cy="130" r="115" fill="url(#gmedallion)" filter="url(#sealShadow)"/>
    <circle cx="130" cy="130" r="100" fill="#2d0f39" stroke="#faecc8" stroke-width="3"/>
    <!-- Inlaid Amethyst Jewel Center -->
    <polygon points="130,55 185,130 130,205 75,130" fill="url(#amethystGlow)" stroke="#faecc8" stroke-width="3"/>
    <!-- Imperial Crown in Center -->
    <path d="M106 140 L112 115 L122 127 L130 108 L138 127 L148 115 L154 140 Z" fill="#faecc8"/>
    <rect x="106" y="142" width="48" height="5" rx="2" fill="#faecc8"/>
  </svg>`;
  await sharp(Buffer.from(sbSeal)).webp().toFile(path.join(sbDir, "seal.webp"));

  console.log("All 5 Royal designs assets created successfully!");
}

buildAll().catch(console.error);
