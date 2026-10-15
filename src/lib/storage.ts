import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// ---------------------------------------------------------------
// File storage.
//  • Production: Cloudinary. The browser uploads straight to Cloudinary using
//    a signature from our server (this avoids Vercel's 4.5 MB request limit),
//    then we ask Cloudinary's API to confirm what was really uploaded.
//  • Development without Cloudinary keys: files are saved in /public/uploads.
// ---------------------------------------------------------------

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const AUDIO_MAX_BYTES = 10 * 1024 * 1024;
export const IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];
export const AUDIO_FORMATS = ["mp3"];

export type ResourceType = "image" | "video"; // Cloudinary files audio under "video"

type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };

export function cloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

/** Cloudinary signature: SHA-1 of "key=value&key=value…" (keys sorted) + the API secret. */
export function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export type SignedUpload = {
  mode: "cloudinary";
  uploadUrl: string;
  fields: Record<string, string>; // send these along with the file
};

export function createSignedUpload(opts: { folder: string; resourceType: ResourceType; allowedFormats: string[] }): SignedUpload {
  const cfg = cloudinaryConfig();
  if (!cfg) throw new Error("Cloudinary is not configured");
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { allowed_formats: opts.allowedFormats.join(","), folder: opts.folder, timestamp };
  return {
    mode: "cloudinary",
    uploadUrl: `https://api.cloudinary.com/v1_1/${cfg.cloudName}/${opts.resourceType}/upload`,
    fields: {
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
      api_key: cfg.apiKey,
      signature: signParams(params, cfg.apiSecret),
    },
  };
}

/** True if the URL is a file in OUR Cloudinary account (so users cannot register someone else's URL). */
export function isOurCloudinaryUrl(url: string, folderPrefix: string): boolean {
  const cfg = cloudinaryConfig();
  if (!cfg) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com" && u.pathname.startsWith(`/${cfg.cloudName}/`) && u.pathname.includes(`/${folderPrefix}/`);
  } catch {
    return false;
  }
}

/** Public id (folder/name, no extension) from a Cloudinary URL. */
export function publicIdFromUrl(url: string): string | null {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
  return m ? decodeURIComponent(m[1]) : null;
}

/** Asks Cloudinary what the file really is — we never trust what the browser says it uploaded. */
export async function inspectCloudinaryAsset(publicId: string, resourceType: ResourceType): Promise<{ bytes: number; format: string; url: string } | null> {
  const cfg = cloudinaryConfig();
  if (!cfg) return null;
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/resources/${resourceType}/upload/${publicId.split("/").map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: "Basic " + Buffer.from(`${cfg.apiKey}:${cfg.apiSecret}`).toString("base64") },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { bytes?: number; format?: string; secure_url?: string };
  if (typeof data.bytes !== "number" || !data.format || !data.secure_url) return null;
  return { bytes: data.bytes, format: data.format.toLowerCase(), url: data.secure_url };
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: ResourceType): Promise<void> {
  const cfg = cloudinaryConfig();
  if (!cfg) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const body = new URLSearchParams({ public_id: publicId, timestamp: String(timestamp), api_key: cfg.apiKey, signature: signParams(params, cfg.apiSecret) });
  await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/destroy`, { method: "POST", body }).catch(() => undefined);
}

// ----- local development fallback ------------------------------------------

export const LOCAL_UPLOADS_ENABLED = process.env.NODE_ENV !== "production";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveLocalFile(folder: string, ext: string, data: Buffer): Promise<string> {
  if (!/^[a-z0-9]+$/i.test(folder) || !/^[a-z0-9]+$/.test(ext)) throw new Error("Bad file location");
  const dir = path.join(UPLOAD_DIR, folder);
  await mkdir(dir, { recursive: true });
  const name = `${randomBytes(8).toString("hex")}.${ext}`;
  await writeFile(path.join(dir, name), data);
  return `/uploads/${folder}/${name}`;
}

/** Removes a stored file, wherever it lives. Never throws: a missing file is fine. */
export async function removeStoredFile(url: string | null | undefined, publicId?: string | null): Promise<void> {
  if (!url) return;
  try {
    if (url.startsWith("/uploads/")) {
      const rel = url.replace(/^\/uploads\//, "");
      const full = path.join(UPLOAD_DIR, rel);
      if (full.startsWith(UPLOAD_DIR)) await unlink(full);
      return;
    }
    if (url.includes("res.cloudinary.com")) {
      const id = publicId ?? publicIdFromUrl(url);
      if (id) await deleteCloudinaryAsset(id, /\.(mp3|wav|m4a)$/i.test(url) ? "video" : "image");
    }
  } catch {
    // ignore
  }
}

// ----- magic-byte checks (what the file REALLY is) ---------------------------

export function sniffImage(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export function sniffMp3(buf: Buffer): boolean {
  if (buf.length < 4) return false;
  if (buf.subarray(0, 3).toString("ascii") === "ID3") return true; // tagged MP3
  return buf[0] === 0xff && (buf[1] & 0xe0) === 0xe0; // raw MPEG frame sync
}
