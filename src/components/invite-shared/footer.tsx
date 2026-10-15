import { Heart } from "lucide-react";
import type { InvitationViewData } from "@/templates/types";
import { Divider } from "./ornaments";

export function InviteFooter({ data }: { data: InvitationViewData }) {
  return (
    <footer className="inv-footer">
      <Divider />
      <p className="inv-script mt-5 text-4xl sm:text-5xl">Thank you</p>
      <p className="mx-auto mt-3 max-w-xs text-base opacity-80">
        for being part of our story. We cannot wait to celebrate with you.
      </p>
      {data.hashtag && <p className="inv-eyebrow mt-6">{data.hashtag}</p>}
      <p className="mt-2 font-semibold tracking-wide">
        {data.groomName} &amp; {data.brideName}
      </p>

      {data.features.showBadge && (
        <a href={data.brand.url} target="_blank" rel="noopener noreferrer" className="inv-badge">
          Made with <Heart className="inline size-3.5 fill-current" aria-label="love" /> by {data.brand.name}
        </a>
      )}
    </footer>
  );
}
