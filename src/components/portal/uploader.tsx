"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Music } from "lucide-react";
import { toast } from "sonner";
import { finalizeUploadAction, prepareUploadAction } from "@/app/portal/actions";

type Kind = "photo" | "couple" | "music" | "logo";

/** Shrinks a photo in the browser (max 1600px, WebP). Uploads are much faster on mobile data and hidden data such as location is removed. */
async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string, q: number) => new Promise<Blob | null>((r) => canvas.toBlob(r, type, q));
  return (await toBlob("image/webp", 0.82)) ?? (await toBlob("image/jpeg", 0.85)) ?? file;
}

export function FileUploader({
  invitationId, kind, label, hint, multiple = false, className = "btn-secondary",
}: {
  invitationId: string;
  kind: Kind;
  label: string;
  hint?: string;
  multiple?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const isMusic = kind === "music";

  async function uploadOne(file: File) {
    const blob: Blob = isMusic ? file : await shrinkImage(file);
    const meta = { size: blob.size, type: isMusic ? "audio/mpeg" : blob.type };
    const prep = await prepareUploadAction(invitationId, kind, meta);
    if (!prep?.ok || !prep.data) throw new Error(prep && !prep.ok ? prep.error : "Upload failed");

    if (prep.data.mode === "cloudinary") {
      const form = new FormData();
      for (const [k, v] of Object.entries(prep.data.fields)) form.append(k, v);
      form.append("file", blob);
      const res = await fetch(prep.data.uploadUrl, { method: "POST", body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed");
      const done = await finalizeUploadAction(invitationId, kind, { url: json.secure_url, publicId: json.public_id });
      if (!done?.ok) throw new Error(done ? (done as { error: string }).error : "Upload failed");
    } else {
      const form = new FormData();
      form.append("invitationId", invitationId);
      form.append("kind", kind);
      form.append("file", blob, file.name);
      const res = await fetch(prep.data.endpoint, { method: "POST", body: form });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed");
    }
  }

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    let ok = 0;
    for (const [i, file] of Array.from(files).entries()) {
      setBusy(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : "Uploading…");
      try {
        await uploadOne(file);
        ok++;
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "Upload failed"}`);
        break; // stop at the first problem (e.g. plan limit reached)
      }
    }
    setBusy(null);
    if (input.current) input.current.value = "";
    if (ok > 0) {
      toast.success(ok === 1 ? "Uploaded" : `${ok} files uploaded`);
      router.refresh();
    }
  }

  return (
    <div>
      <button type="button" className={className} disabled={!!busy} onClick={() => input.current?.click()}>
        {busy ? <Loader2 className="size-5 animate-spin" /> : isMusic ? <Music className="size-5" /> : <ImagePlus className="size-5" />}
        {busy ?? label}
      </button>
      <input
        ref={input}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept={isMusic ? "audio/mpeg,.mp3" : "image/jpeg,image/png,image/webp"}
        multiple={multiple}
        onChange={(e) => onPick(e.target.files)}
      />
      {hint && <p className="mt-1.5 text-xs text-ink/60">{hint}</p>}
    </div>
  );
}
