import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { ActionError } from "@/lib/action-state";
import { requireAdminForAction } from "@/lib/dal";
import { guardInvitation } from "@/lib/portal";
import { saveUpload, type UploadKind } from "@/lib/uploads";
import { AUDIO_MAX_BYTES, IMAGE_MAX_BYTES, LOCAL_UPLOADS_ENABLED, cloudinaryConfig, saveLocalFile, sniffImage, sniffMp3 } from "@/lib/storage";

// DEVELOPMENT ONLY: saves uploads into /public/uploads when Cloudinary keys are
// not set yet. In production (or once Cloudinary is configured) this returns 404.

const KINDS: UploadKind[] = ["photo", "couple", "music", "logo"];

function fail(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  if (!LOCAL_UPLOADS_ENABLED || cloudinaryConfig()) return fail("Not available", 404);

  try {
    const form = await request.formData();
    const kind = String(form.get("kind") ?? "") as UploadKind;
    const file = form.get("file");
    if (!KINDS.includes(kind) || !(file instanceof File)) return fail("Bad request");

    // Who is allowed? Same rules as every other portal action.
    let inv = null;
    if (kind === "logo") await requireAdminForAction();
    else inv = (await guardInvitation(form.get("invitationId"))).inv;

    const data = Buffer.from(await file.arrayBuffer());
    let stored: { folder: string; ext: string; bytes: Buffer };
    const folder = inv?.id ?? "site";

    if (kind === "music") {
      if (data.length > AUDIO_MAX_BYTES) return fail("That file is too big. The maximum is 10 MB.");
      if (!sniffMp3(data)) return fail("Please choose a real MP3 file.");
      stored = { folder, ext: "mp3", bytes: data };
    } else {
      if (data.length > IMAGE_MAX_BYTES) return fail("That picture is too big. The maximum is 5 MB.");
      if (!sniffImage(data)) return fail("Please choose a JPG, PNG or WebP picture.");
      // Re-encoding removes hidden data such as the phone's GPS location.
      const bytes = await sharp(data).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      stored = { folder, ext: "webp", bytes };
    }

    // Plan limits are checked before saving (photos count, Premium-only music…).
    const { prepareUpload } = await import("@/lib/uploads");
    await prepareUpload(inv, kind, { size: data.length, type: kind === "music" ? "audio/mpeg" : "image/webp" });

    const url = await saveLocalFile(stored.folder, stored.ext, stored.bytes);
    await saveUpload(inv, kind, { url });
    revalidatePath("/portal", "layout");
    revalidatePath("/admin", "layout");
    return Response.json({ ok: true, url });
  } catch (error) {
    if (error instanceof ActionError) return fail(error.message, 403);
    console.error("Local upload failed:", error);
    return fail("Upload failed. Please try again.", 500);
  }
}
