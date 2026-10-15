import { SITE } from "@/lib/site";
import { getTemplate, getTrack } from "./registry";
import type { InvitationViewData, InviteEvent } from "./types";

// Dummy invitation used by /preview/<template> and the gallery thumbnails.

/** "YYYY-MM-DD" for `days` after today (UTC calendar day). */
function ymdFromToday(days: number): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days)).toISOString().slice(0, 10);
}

function search(venue: string, address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`;
}

function demoEvents(): InviteEvent[] {
  const base = {
    startTime: null, endTime: null, venueName: null, address: null, mapUrl: null, dressCode: null, notes: null,
  };
  return [
    {
      ...base, id: "demo-mehndi", type: "MEHNDI", title: "Mehndi", date: ymdFromToday(60),
      startTime: "19:00", endTime: "23:30", venueName: "Gul-e-Lalah Lawn",
      address: "Main Boulevard, Gulberg III, Lahore", mapUrl: search("Gul-e-Lalah Lawn", "Gulberg III, Lahore"),
      dressCode: "Yellow, green & bright festive colours", notes: "Dholak, songs and dancing — come ready to perform!",
    },
    {
      ...base, id: "demo-nikkah", type: "NIKKAH", title: "Nikkah", date: ymdFromToday(61),
      startTime: "17:00", endTime: "19:00", venueName: "Family Residence",
      address: "Street 12, DHA Phase 5, Lahore", mapUrl: search("DHA Phase 5", "Lahore"),
      dressCode: "Ivory, white & pastels",
    },
    {
      ...base, id: "demo-baraat", type: "BARAAT", title: "Baraat", date: ymdFromToday(62),
      startTime: "19:30", endTime: "23:00", venueName: "Shahi Mahal Banquet",
      address: "Canal Bank Road, near Thokar Niaz Baig, Lahore", mapUrl: search("Shahi Mahal Banquet", "Canal Bank Road, Lahore"),
      dressCode: "Formal — reds, maroons & gold", notes: "Baraat arrival at 8:00 pm sharp.",
    },
    {
      ...base, id: "demo-walima", type: "WALIMA", title: "Walima", date: ymdFromToday(63),
      startTime: "20:00", endTime: "23:00", venueName: "Noor Pavilion",
      address: "MM Alam Road, Gulberg II, Lahore", mapUrl: search("Noor Pavilion", "MM Alam Road, Lahore"),
      dressCode: "Formal — soft and pastel tones",
    },
  ];
}

export function buildDemoData(templateKey: string, options: { guest?: boolean } = {}): InvitationViewData {
  const meta = getTemplate(templateKey);
  const track = getTrack(meta?.defaultTrack);
  const events = demoEvents();

  return {
    slug: "ahmad-weds-mawra",
    templateKey,
    groomName: "Ahmad",
    brideName: "Mawra",
    weddingDate: events[2].date,
    timezone: "Asia/Karachi",
    hashtag: "#AhmadWedsMawra",
    welcomeMessage:
      "Your presence is the blessing we are asking for. Over these few days two families become one, and it would not be complete without the people who have loved us all our lives. Come eat with us, dance with us, pray with us and stay late — we have saved you a place.",
    verseText: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    couplePhotoUrl: "/demo/couple.webp",
    groomFamily: {
      parentsLine: "Mr. & Mrs. Khalid Mehmood",
      members: [
        { id: "g1", name: "Hamza Mehmood", phone: "+92 300 1234567", showPhone: true },
        { id: "g2", name: "Usman Mehmood", phone: "+92 321 1234567", showPhone: true },
        { id: "g3", name: "Areeba Mehmood", phone: null, showPhone: false },
      ],
    },
    brideFamily: {
      parentsLine: "Mr. & Mrs. Naveed Iqbal",
      members: [
        { id: "b1", name: "Hina Iqbal", phone: null, showPhone: false },
        { id: "b2", name: "Maryam Iqbal", phone: null, showPhone: false },
      ],
    },
    events,
    photos: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: `demo-${n}`, url: `/demo/gallery-${n}.webp` })),
    music: { enabled: true, src: track?.file ?? null },
    features: { rsvp: true, gallery: true, showBadge: true },
    brand: { name: SITE.brandName, url: SITE.url },
    guest: options.guest === false ? null : { code: "demo", displayName: "Sarah & Family" },
    rsvps: {},
    mode: "preview",
  };
}
