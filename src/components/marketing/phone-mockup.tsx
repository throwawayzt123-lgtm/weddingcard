import Image from "next/image";
import type { TemplateMeta } from "@/templates/registry";

/** A phone showing a design. The screen slowly alternates between the opening screen and the finished invitation. */
export function PhoneMockup({ template, priority = false, sizes = "260px" }: { template: TemplateMeta; priority?: boolean; sizes?: string }) {
  const second = template.thumbnail.replace("thumb.webp", "thumb-2.webp");
  return (
    <div className="phone">
      <div className="phone-screen">
        <Image src={template.thumbnail} alt={`${template.name} invitation design`} fill sizes={sizes} className="object-cover" priority={priority} />
        <Image src={second} alt="" fill sizes={sizes} className="phone-swap object-cover" />
      </div>
    </div>
  );
}
