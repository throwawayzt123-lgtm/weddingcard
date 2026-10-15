import { Phone } from "lucide-react";
import type { InviteFamilySide } from "@/templates/types";

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function Side({ title, side }: { title: string; side: InviteFamilySide }) {
  return (
    <div className="inv-family-side">
      <h3 className="inv-eyebrow">{title}</h3>
      {side.parentsLine && <p className="inv-parents">{side.parentsLine}</p>}
      <ul className="mt-3 space-y-2.5">
        {side.members.map((m) => (
          <li key={m.id} className="inv-member">
            <span>{m.name}</span>
            {m.showPhone && m.phone && (
              <a href={telHref(m.phone)} className="inv-phone-pill">
                <Phone className="size-3" aria-hidden />
                {m.phone}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "With the blessings of" — groom's side and bride's side. One column on phones, two on larger screens. */
export function Family({ groom, bride }: { groom: InviteFamilySide; bride: InviteFamilySide }) {
  const hasContent = (s: InviteFamilySide) => !!s.parentsLine || s.members.length > 0;
  const both = hasContent(groom) && hasContent(bride);

  return (
    <div className={`grid gap-8 text-center ${both ? "sm:grid-cols-2 sm:gap-6" : ""}`}>
      {hasContent(groom) && <Side title="Groom's Side" side={groom} />}
      {both && <div className="inv-family-rule sm:hidden" aria-hidden />}
      {hasContent(bride) && <Side title="Bride's Side" side={bride} />}
    </div>
  );
}
