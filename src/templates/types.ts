// The ONE data shape every invitation template receives.
// Everything here is plain JSON (dates are "YYYY-MM-DD" strings, times are
// "HH:mm"), so it can be passed from the server to the browser safely.

export type EventKind = "DHOLKI" | "MAYUN" | "MEHNDI" | "NIKKAH" | "BARAAT" | "RUKHSATI" | "WALIMA" | "CUSTOM";
export type RsvpAnswer = "YES" | "NO" | "MAYBE";

export type InviteEvent = {
  id: string;
  type: EventKind;
  title: string;
  /** "2026-12-12" */
  date: string;
  /** "19:30" in the invitation's timezone, or null if not decided yet */
  startTime: string | null;
  endTime: string | null;
  venueName: string | null;
  address: string | null;
  mapUrl: string | null;
  dressCode: string | null;
  notes: string | null;
};

export type InviteFamilyMember = {
  id: string;
  name: string;
  phone: string | null;
  showPhone: boolean;
};

export type InviteFamilySide = {
  parentsLine: string | null;
  members: InviteFamilyMember[];
};

export type InviteRsvp = { response: RsvpAnswer; headcount: number; message: string | null };

export type InvitationViewData = {
  slug: string;
  templateKey: string;
  groomName: string;
  brideName: string;
  /** "2026-12-13" */
  weddingDate: string;
  /** IANA name, e.g. "Asia/Karachi" */
  timezone: string;
  hashtag: string | null;
  welcomeMessage: string | null;
  verseText: string | null;
  couplePhotoUrl: string | null;
  groomFamily: InviteFamilySide;
  brideFamily: InviteFamilySide;
  /** Already filtered to the events THIS guest is invited to, sorted by date. */
  events: InviteEvent[];
  photos: { id: string; url: string }[];
  music: { enabled: boolean; src: string | null };
  features: { rsvp: boolean; gallery: boolean; showBadge: boolean };
  brand: { name: string; url: string };
  /** null on the generic link → "Dear Guest," */
  guest: { code: string; displayName: string } | null;
  /** The guest's earlier answers, keyed by event id. */
  rsvps: Record<string, InviteRsvp>;
  /** "preview" = demo page (RSVP is simulated, nothing is saved). */
  mode: "live" | "preview";
};

export type RsvpSubmission = {
  answers: { eventId: string; response: RsvpAnswer; headcount: number; message: string }[];
};

export type RsvpResult = { ok: true } | { ok: false; error: string };

/** What a template's root component receives. */
export type TemplateProps = {
  data: InvitationViewData;
  /** Saves the guest's RSVP (server action in live mode, simulated in preview). */
  onRsvp: (submission: RsvpSubmission) => Promise<RsvpResult>;
};
