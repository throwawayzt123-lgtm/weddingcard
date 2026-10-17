import { SITE, WATERMARK_MESSAGE, whatsappLink } from "@/lib/site";
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
      startTime: "19:00", endTime: "23:30", venueName: "Rose Garden Lawn",
      address: "Main Boulevard, Gulberg III, Lahore", mapUrl: search("Rose Garden Lawn", "Gulberg III, Lahore"),
      dressCode: "Yellow, green and bright festive colours", notes: "Dholak, songs and dancing. Come ready to perform!",
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
      dressCode: "Formal, in reds, maroons and gold", notes: "Baraat arrival at 8:00 pm sharp.",
    },
    {
      ...base, id: "demo-walima", type: "WALIMA", title: "Walima", date: ymdFromToday(63),
      startTime: "20:00", endTime: "23:00", venueName: "Noor Pavilion",
      address: "MM Alam Road, Gulberg II, Lahore", mapUrl: search("Noor Pavilion", "MM Alam Road, Lahore"),
      dressCode: "Formal, in soft pastel tones",
    },
  ];
}

export function buildDemoData(templateKey: string, options: { guest?: boolean } = {}): InvitationViewData {
  const meta = getTemplate(templateKey);
  const track = getTrack(meta?.defaultTrack);
  const events = demoEvents();

  return {
    slug: "ahmad-weds-sara",
    templateKey,
    groomName: "Ahmad",
    brideName: "Sara",
    weddingDate: events[2].date,
    timezone: "Asia/Karachi",
    hashtag: "#AhmadWedsSara",
    welcomeMessage:
      "Your presence is the blessing we are asking for. Over these few days two families become one, and it would not be complete without the people who have loved us all our lives. Come eat with us, dance with us, pray with us and stay late. We have saved you a place.",
    verseText: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    couplePhotoUrl: null,
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
    // flowers and wedding decor, never a couple: the wedding has not happened yet
    photos: ["garden-aisle", "rose-red-teal", "table-banquet", "jasmine-leaves", "mehndi-decor", "candlesticks", "venue-white", "hall-palace"].map((n) => ({ id: `demo-${n}`, url: `/templates/photos/${n}.webp` })),
    music: { enabled: true, src: track?.file ?? null },
    features: { rsvp: true, gallery: true, showBadge: true },
    brand: { name: SITE.brandName, url: SITE.url, whatsappUrl: whatsappLink(WATERMARK_MESSAGE) },
    guest: options.guest === false ? null : { code: "demo", displayName: "Mr & Mrs Ali" },
    rsvps: {},
    mode: "preview",
  };
}
