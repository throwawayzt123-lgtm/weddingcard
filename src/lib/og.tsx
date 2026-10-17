import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { formatLongDate } from "@/lib/dates";
import { loadInvitation } from "@/lib/invitation-view";

// WhatsApp / Facebook link-preview image (1200 × 630) for each invitation.
// Shows the couple's names in their design's colours. For a personal link it
// also says "You're invited, Mr & Mrs Ali".

export const OG_SIZE = { width: 1200, height: 630 };

const THEMES: Record<string, { bg: string; text: string; accent: string; frame: string }> = {
  "shahi-darwaza": { bg: "linear-gradient(135deg,#4a1020,#1a070d)", text: "#f6ecd9", accent: "#ebd08a", frame: "#c9a24b" },
  gulzar: { bg: "linear-gradient(135deg,#fdeceb,#f3cfd2)", text: "#6b2f3c", accent: "#a24d5c", frame: "#c98f7e" },
  "mehndi-rang": { bg: "linear-gradient(135deg,#d81b78,#f26a1b)", text: "#ffffff", accent: "#ffe08a", frame: "#ffd23f" },
  noor: { bg: "linear-gradient(135deg,#0b3d2e,#05241b)", text: "#f2ead6", accent: "#dcc58d", frame: "#b89b5e" },
};
const FALLBACK = THEMES["shahi-darwaza"];

// Read once when the module loads. Great Vibes = the script font used on the invitations;
// Cormorant = the serif used for small text. Both are trimmed to Latin letters to stay small.
const scriptFont = readFile(path.join(process.cwd(), "src/assets/fonts/GreatVibes.ttf"));
const serifFont = readFile(path.join(process.cwd(), "src/assets/fonts/Cormorant.ttf"));

export async function inviteImage(slug: string, guestCode: string | null): Promise<ImageResponse> {
  const result = await loadInvitation(slug, guestCode);
  const [script, serif] = await Promise.all([scriptFont, serifFont]);

  let theme = FALLBACK;
  let names = "Wedding Invitation";
  let line1 = "You are warmly invited";
  let line2 = "";
  let brand = "";

  if (result.kind === "ok") {
    const d = result.data;
    theme = THEMES[d.templateKey] ?? FALLBACK;
    names = `${d.groomName} & ${d.brideName}`;
    line1 = formatLongDate(d.weddingDate);
    line2 = d.guest ? `You're invited, ${d.guest.displayName}` : "Wedding Invitation";
    brand = result.data.brand.name;
  } else if (result.kind === "expired") {
    names = `${result.groomName} & ${result.brideName}`;
    line1 = "This celebration has concluded";
    brand = result.brand;
  } else if (result.kind === "suspended") {
    brand = result.brand;
  }

  const fontSize = names.length > 22 ? 104 : names.length > 16 ? 124 : 144;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: theme.bg, padding: 28 }}>
        <div
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `3px solid ${theme.frame}`, borderRadius: 14, position: "relative", color: theme.text, fontFamily: "Cormorant",
          }}
        >
          <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: `1px solid ${theme.frame}`, borderRadius: 8, display: "flex", opacity: 0.55 }} />
          <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: 9, color: theme.accent, display: "flex" }}>TOGETHER WITH THEIR FAMILIES</div>
          <div style={{ fontFamily: "GreatVibes", fontSize, lineHeight: 1.15, color: theme.accent, marginTop: 14, display: "flex", textAlign: "center" }}>{names}</div>
          <div style={{ width: 220, height: 2, background: theme.frame, marginTop: 20, marginBottom: 22, display: "flex" }} />
          <div style={{ fontSize: 46, fontWeight: 500, display: "flex" }}>{line1}</div>
          {line2 && <div style={{ fontSize: 38, fontWeight: 500, marginTop: 14, color: theme.accent, display: "flex" }}>{line2}</div>}
          {brand && <div style={{ position: "absolute", bottom: 34, fontSize: 26, letterSpacing: 4, opacity: 0.75, display: "flex" }}>{brand}</div>}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "GreatVibes", data: script, style: "normal", weight: 400 },
      { name: "Cormorant", data: serif, style: "normal", weight: 500 }] },
  );
}
