import "server-only";
import type { Invitation } from "@prisma/client";
import { ActionError } from "@/lib/action-state";
import { canAddMore, getPlan } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { saveSettings } from "@/lib/settings";
import {
  AUDIO_FORMATS, AUDIO_MAX_BYTES, IMAGE_FORMATS, IMAGE_MAX_BYTES, LOCAL_UPLOADS_ENABLED, cloudinaryConfig, createSignedUpload,
  inspectCloudinaryAsset, isOurCloudinaryUrl, publicIdFromUrl, removeStoredFile, deleteCloudinaryAsset, type ResourceType, type SignedUpload,
} from "@/lib/storage";

export type UploadKind = "photo" | "couple" | "music" | "logo";
export type UploadMeta = { size: number; type: string };
export type PrepareResult = SignedUpload | { mode: "local"; endpoint: string };

type Rules = { resourceType: ResourceType; formats: string[]; maxBytes: number; folder: string; label: string };

function rules(kind: UploadKind, invitationId: string): Rules {
  switch (kind) {
    case "music":
      return { resourceType: "video", formats: AUDIO_FORMATS, maxBytes: AUDIO_MAX_BYTES, folder: `weddings/${invitationId}/music`, label: "MP3 file" };
    case "logo":
      return { resourceType: "image", formats: IMAGE_FORMATS, maxBytes: IMAGE_MAX_BYTES, folder: "site/logo", label: "image" };
    case "couple":
      return { resourceType: "image", formats: IMAGE_FORMATS, maxBytes: IMAGE_MAX_BYTES, folder: `weddings/${invitationId}/couple`, label: "photo" };
    default:
      return { resourceType: "image", formats: IMAGE_FORMATS, maxBytes: IMAGE_MAX_BYTES, folder: `weddings/${invitationId}/photos`, label: "photo" };
  }
}

/** Plan checks that apply BEFORE a file is accepted. */
async function checkAllowed(inv: Invitation | null, kind: UploadKind) {
  if (kind === "logo" || !inv) return;
  const plan = getPlan(inv.plan);
  if (kind === "photo") {
    if (plan.maxPhotos === 0) throw new ActionError("The photo gallery is not included in your plan. Message us on WhatsApp to upgrade.");
    const count = await prisma.photo.count({ where: { invitationId: inv.id } });
    if (!canAddMore(plan.maxPhotos, count)) throw new ActionError(`Your plan includes ${plan.maxPhotos} gallery photos and you have used them all.`);
  }
  if (kind === "music" && !plan.customMusicUpload) {
    throw new ActionError("Uploading your own music is a Premium feature. Message us on WhatsApp to upgrade.");
  }
}

export async function prepareUpload(inv: Invitation | null, kind: UploadKind, meta: UploadMeta): Promise<PrepareResult> {
  const r = rules(kind, inv?.id ?? "site");
  if (!Number.isFinite(meta.size) || meta.size <= 0) throw new ActionError("That file is empty.");
  if (meta.size > r.maxBytes) throw new ActionError(`That file is too big. The maximum is ${Math.round(r.maxBytes / 1024 / 1024)} MB.`);
  if (kind === "music" ? !/audio\/(mpeg|mp3)/.test(meta.type) : !/^image\/(jpeg|png|webp)$/.test(meta.type)) {
    throw new ActionError(kind === "music" ? "Please choose an MP3 file." : "Please choose a JPG, PNG or WebP picture.");
  }
  await checkAllowed(inv, kind);

  if (cloudinaryConfig()) return createSignedUpload({ folder: r.folder, resourceType: r.resourceType, allowedFormats: r.formats });
  if (LOCAL_UPLOADS_ENABLED) return { mode: "local", endpoint: "/api/upload-local" };
  throw new ActionError("File uploads are not set up yet. Please contact us on WhatsApp.");
}

/** After a browser-to-Cloudinary upload: confirm what really arrived, then save it. */
export async function finalizeCloudinaryUpload(inv: Invitation | null, kind: UploadKind, file: { url: string; publicId: string }) {
  const r = rules(kind, inv?.id ?? "site");
  if (!isOurCloudinaryUrl(file.url, r.folder) || !file.publicId.startsWith(r.folder)) throw new ActionError("That upload could not be verified.");

  const info = await inspectCloudinaryAsset(file.publicId, r.resourceType);
  const bad = !info || info.bytes > r.maxBytes || !r.formats.includes(info.format === "jpeg" ? "jpg" : info.format) && !r.formats.includes(info.format);
  if (bad || !info) {
    await deleteCloudinaryAsset(file.publicId, r.resourceType);
    throw new ActionError(`That file is not a valid ${r.label}, or it is too big.`);
  }
  await checkAllowed(inv, kind).catch(async (e) => {
    await deleteCloudinaryAsset(file.publicId, r.resourceType);
    throw e;
  });
  return saveUpload(inv, kind, { url: info.url, publicId: file.publicId });
}

/** Writes the uploaded file's address into the database (and removes the file it replaces). */
export async function saveUpload(inv: Invitation | null, kind: UploadKind, file: { url: string; publicId?: string | null }): Promise<{ url: string }> {
  if (kind === "logo") {
    await saveSettings({ logoUrl: file.url });
    return { url: file.url };
  }
  if (!inv) throw new ActionError("Invitation not found.");

  if (kind === "photo") {
    await checkAllowed(inv, "photo");
    const last = await prisma.photo.findFirst({ where: { invitationId: inv.id }, orderBy: { order: "desc" }, select: { order: true } });
    await prisma.photo.create({ data: { invitationId: inv.id, url: file.url, publicId: file.publicId ?? null, order: (last?.order ?? -1) + 1 } });
  } else if (kind === "couple") {
    await prisma.invitation.update({ where: { id: inv.id }, data: { couplePhotoUrl: file.url } });
    await removeStoredFile(inv.couplePhotoUrl);
  } else if (kind === "music") {
    await prisma.invitation.update({ where: { id: inv.id }, data: { customMusicUrl: file.url } });
    await removeStoredFile(inv.customMusicUrl);
  }
  return { url: file.url };
}

export async function deletePhoto(inv: Invitation, photoId: string) {
  const photo = await prisma.photo.findFirst({ where: { id: photoId, invitationId: inv.id } });
  if (!photo) throw new ActionError("That photo was not found.");
  await prisma.photo.delete({ where: { id: photo.id } });
  await removeStoredFile(photo.url, photo.publicId);
}

export async function movePhoto(inv: Invitation, photoId: string, direction: "left" | "right") {
  const photos = await prisma.photo.findMany({ where: { invitationId: inv.id }, orderBy: { order: "asc" } });
  const i = photos.findIndex((p) => p.id === photoId);
  const j = direction === "left" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= photos.length) return;
  await prisma.$transaction([
    prisma.photo.update({ where: { id: photos[i].id }, data: { order: photos[j].order } }),
    prisma.photo.update({ where: { id: photos[j].id }, data: { order: photos[i].order } }),
  ]);
}

export async function removeCouplePhoto(inv: Invitation) {
  await prisma.invitation.update({ where: { id: inv.id }, data: { couplePhotoUrl: null } });
  await removeStoredFile(inv.couplePhotoUrl);
}

export async function removeCustomMusic(inv: Invitation) {
  await prisma.invitation.update({ where: { id: inv.id }, data: { customMusicUrl: null } });
  await removeStoredFile(inv.customMusicUrl);
}

export { publicIdFromUrl };
