import type { InvitationViewData } from "@/templates/types";

/**
 * The invited guest's name on the cover, exactly as the customer wrote it (free text), for example
 * "Mr & Mrs Ali" or "Mr Ali and his family". Nothing is shown on the general link that has no guest.
 */
export function GuestLine({ data }: { data: InvitationViewData }) {
  const name = data.guest?.displayName?.trim();
  if (!name) return null;
  return (
    <p className="inv-guest-line">
      <span>Invitation for</span>
      <strong>{name}</strong>
    </p>
  );
}
