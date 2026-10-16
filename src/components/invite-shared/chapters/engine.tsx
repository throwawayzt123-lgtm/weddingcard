"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { CalendarPlus, ChevronDown, ChevronUp, Heart, Navigation } from "lucide-react";
import { googleCalendarUrl, mapsUrl } from "@/lib/calendar";
import { dateBadge, formatLongDate, formatTimeRange } from "@/lib/dates";
import type { InvitationViewData, InviteEvent, RsvpResult, RsvpSubmission } from "@/templates/types";
import { Countdown } from "../countdown";
import { downloadIcs } from "../events";
import type { ContentProps } from "../experience";
import { Family } from "../family";
import { RsvpForm } from "../rsvp";
import type { ChapterConfig, Layout, Photo, Surface } from "./config";
import { COVER_PHOTO } from "./photos";
import { countWord, EVENT_COPY, isLight, monthYear } from "./copy";
import "./chapters.css";

// The page body of the "full-screen chapters" experience, shared by every design.
// The invitation is a set of CHAPTERS (blessings, one per celebration, families, moments, RSVP).
// Each chapter has its own picture, colour scheme and layout, taken from the design's ChapterConfig.
// Scrolling, swiping, the arrow keys or the chapter menu moves to the next chapter and the picture changes
// with it. A chapter that is taller than the screen scrolls inside itself first.

type Scene = {
  id: string;
  label: string;
  layout: Layout;
  surface: Surface;
  photo: Photo | undefined;
  caption?: string;
  /** Shown over the picture on wide screens (the countdown on the first chapter). */
  overlay?: ReactNode;
  body: ReactNode;
};
type OnRsvp = (submission: RsvpSubmission) => Promise<RsvpResult>;

const DEFAULT_VERSE = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const ARABIC = /[؀-ۿ]/;

const rv = (order: number): CSSProperties => ({ "--order": order }) as CSSProperties;

// ---------------------------------------------------------------- chapter bodies

function BlessingsBody({ data, onExplore }: { data: InvitationViewData; onExplore: (() => void) | null }) {
  const verse = data.verseText?.trim();
  const arabicVerse = verse ? (ARABIC.test(verse) ? verse : null) : DEFAULT_VERSE;
  const translation = verse ? (arabicVerse ? null : verse) : "In the name of Allah, the Most Gracious, the Most Merciful";
  const count = data.events.length;
  const line =
    data.welcomeMessage?.trim() ||
    (count > 0 ? `${countWord(count)} celebration${count === 1 ? "" : "s"}. Two families. One beautiful beginning.` : "Two families. One beautiful beginning.");

  return (
    <div className="ch-center">
      <p className="ch-eyebrow ch-reveal" style={rv(0)}>With the blessings of Allah</p>
      {arabicVerse && (
        <p className="ch-arabic ch-reveal" lang="ar" dir="rtl" style={rv(1)}>
          {arabicVerse}
        </p>
      )}
      {translation && <p className="ch-translation ch-reveal" style={rv(2)}>{translation}</p>}
      <div className="ch-rule ch-reveal" style={rv(2)} aria-hidden />
      <p className="ch-family-line ch-reveal" style={rv(3)}>
        {data.guest && (
          <>
            Dear {data.guest.displayName},
            <br />
          </>
        )}
        Together with our families,
        <br />
        we joyfully invite you to celebrate
      </p>
      <h1 className="ch-names ch-reveal" style={rv(4)} aria-label={`${data.groomName} and ${data.brideName}`}>
        <span>{data.groomName}</span>
        <i aria-hidden>&amp;</i>
        <span>{data.brideName}</span>
      </h1>
      <p className="ch-invitation-line ch-reveal" style={rv(5)}>{line}</p>
      {onExplore && (
        <button type="button" className="ch-text-button ch-reveal" style={rv(6)} onClick={onExplore}>
          Explore the celebrations
        </button>
      )}
      {count > 0 && (
        <div className="ch-countdown ch-mobile-only ch-reveal" style={rv(7)}>
          <Countdown data={data} />
        </div>
      )}
    </div>
  );
}

function EventBody({ event, data }: { event: InviteEvent; data: InvitationViewData }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
  const badge = dateBadge(event.date);
  const time = formatTimeRange(event.startTime, event.endTime);
  const directions = mapsUrl(event);
  const ctx = { coupleTitle: `${data.groomName} & ${data.brideName}`, timezone: data.timezone };

  return (
    <div className="ch-event">
      <div className="ch-head">
        <p className="ch-eyebrow ch-kicker ch-reveal" style={rv(0)}>{copy.kicker}</p>
        <h2 className={`ch-title ch-reveal ${event.title.length > 9 ? "is-long" : ""}`} style={rv(1)}>
          {event.title}
        </h2>
        <p className="ch-subtitle ch-reveal" style={rv(2)}>{copy.subtitle}</p>
      </div>

      <div className="ch-facts">
        <div className="ch-date-block ch-reveal" style={rv(3)}>
          <span className="ch-date-number">{badge.day}</span>
          <div className="ch-date-detail">
            <p>{formatLongDate(event.date)}</p>
            <p className="ch-time">{time ?? "Time to be announced"}</p>
          </div>
        </div>

        <h3 className="ch-venue ch-reveal" style={rv(4)}>{event.venueName ?? "Venue to be announced"}</h3>
        {event.address && <p className="ch-address ch-reveal" style={rv(4)}>{event.address}</p>}
        {event.dressCode && (
          <p className="ch-note ch-reveal" style={rv(5)}>
            <em>Dress code:</em> {event.dressCode}
          </p>
        )}
        {event.notes && <p className="ch-note ch-reveal" style={rv(5)}>{event.notes}</p>}

        <div className="ch-actions ch-reveal" style={rv(6)}>
          <button type="button" className="ch-primary ch-primary-small" aria-expanded={calendarOpen} onClick={() => setCalendarOpen((v) => !v)}>
            <CalendarPlus aria-hidden />
            Add to calendar
          </button>
          {directions && (
            <a className="ch-text-button" href={directions} target="_blank" rel="noopener noreferrer">
              <Navigation aria-hidden />
              Get directions
            </a>
          )}
        </div>
        {calendarOpen && (
          <div className="ch-calendar-options">
            <button type="button" className="ch-text-button" onClick={() => { downloadIcs(event, data); setCalendarOpen(false); }}>
              Apple / Outlook (.ics file)
            </button>
            <a className="ch-text-button" href={googleCalendarUrl(event, ctx)} target="_blank" rel="noopener noreferrer" onClick={() => setCalendarOpen(false)}>
              Google Calendar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function FamiliesBody({ data }: { data: InvitationViewData }) {
  return (
    <div className="ch-center">
      <p className="ch-eyebrow ch-reveal" style={rv(0)}>With the blessings of</p>
      <h2 className="ch-section-title ch-reveal" style={rv(1)}>Our families</h2>
      <div className="ch-rule ch-reveal" style={rv(2)} aria-hidden />
      <div className="ch-families ch-reveal" style={rv(3)}>
        <Family groom={data.groomFamily} bride={data.brideFamily} />
      </div>
    </div>
  );
}

function MomentsBody({ photos, active, onPick }: { photos: Photo[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="ch-center">
      <p className="ch-eyebrow ch-reveal" style={rv(0)}>A few moments</p>
      <h2 className="ch-section-title ch-reveal" style={rv(1)}>Moments</h2>
      <p className="ch-translation ch-reveal" style={rv(2)}>Choose a picture to see it bigger.</p>
      <div className="ch-thumbs ch-reveal" style={rv(3)}>
        {photos.map((p, i) => (
          <button key={p.src} type="button" className="ch-thumb" aria-label={`Show photo ${i + 1}`} aria-current={i === active} onClick={() => onPick(i)}>
            <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RsvpBody({ data, onRsvp }: { data: InvitationViewData; onRsvp: OnRsvp }) {
  return (
    <div>
      <div className="ch-center">
        <p className="ch-eyebrow ch-reveal" style={rv(0)}>Kindly reply</p>
        <h2 className="ch-section-title ch-reveal" style={rv(1)}>RSVP</h2>
        <p className="ch-translation ch-reveal" style={rv(2)}>Let us know which celebrations you will join, so we can prepare a place for you.</p>
      </div>
      <div className="ch-rsvp ch-reveal" style={rv(3)}>
        <RsvpForm data={data} onRsvp={onRsvp} />
      </div>
    </div>
  );
}

function Thanks({ data }: { data: InvitationViewData }) {
  return (
    <div className="ch-thanks ch-reveal" style={rv(8)}>
      <div className="ch-rule" aria-hidden />
      <p className="ch-thanks-title">Thank you</p>
      <p className="ch-translation">for being part of our story. We cannot wait to celebrate with you.</p>
      {data.hashtag && <p className="ch-eyebrow ch-thanks-tag">{data.hashtag}</p>}
      <p className="ch-thanks-names">
        {data.groomName} &amp; {data.brideName}
      </p>
      {data.features.showBadge && (
        <a href={data.brand.url} target="_blank" rel="noopener noreferrer" className="ch-badge">
          Made with <Heart aria-label="love" /> by {data.brand.name}
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- chapter list

type Api = { go: (index: number) => void; moment: number; setMoment: (i: number) => void; onRsvp: OnRsvp };

function buildScenes(data: InvitationViewData, config: ChapterConfig, api: Api): Scene[] {
  const scenes: Scene[] = [];
  const pool = config.photos;
  const used = new Set<number>();
  let previousPhoto = -1;
  let previousSurface = -1;

  // The next picture of the design: the wanted one if it is still unused, otherwise the next unused one.
  // Pictures only repeat once the whole set has been shown, and never twice in a row.
  const take = (preferred?: number): { photo: Photo; index: number } => {
    if (used.size >= pool.length) used.clear();
    let index = preferred !== undefined ? preferred % pool.length : 0;
    for (let step = 0; (used.has(index) || index === previousPhoto) && step < pool.length; step++) index = (index + 1) % pool.length;
    used.add(index);
    previousPhoto = index;
    return { photo: pool[index], index };
  };
  const surfaceFor = (position: number, photo?: Photo): Surface => {
    const count = config.surfaces.length;
    let i = (photo?.surface ?? position) % count;
    if (i === previousSurface && count > 1) i = (i + 1) % count;
    previousSurface = i;
    return config.surfaces[i];
  };
  const layoutFor = (position: number): Layout => config.layouts[position % config.layouts.length];
  const add = (scene: Omit<Scene, "layout" | "surface"> & { surfaceFrom?: Photo }) => {
    const position = scenes.length;
    const { surfaceFrom, ...rest } = scene;
    let layout = layoutFor(position);
    if (layout === "poster" && !rest.id.startsWith("event-")) layout = "split";
    scenes.push({ ...rest, layout, surface: surfaceFor(position, surfaceFrom) });
  };

  // 1. Blessings: always the same generic wedding picture (never a couple photo), the same in every design
  const coupleAlt = `${data.groomName} and ${data.brideName}`;
  add({
    id: "blessings",
    label: "Blessings",
    photo: COVER_PHOTO,
    caption: "Written in the stars.\nCelebrated with you.",
    overlay: data.events.length > 0 ? <Countdown data={data} /> : undefined,
    body: <BlessingsBody data={data} onExplore={data.events.length > 0 ? () => api.go(1) : null} />,
  });

  // 2. One chapter per celebration, each with its own picture, colours and layout
  data.events.forEach((event) => {
    const copy = EVENT_COPY[event.type] ?? EVENT_COPY.CUSTOM;
    const { photo } = take(config.eventPhotos?.[event.type]);
    add({ id: `event-${event.id}`, label: event.title, photo, surfaceFrom: photo, caption: copy.caption, body: <EventBody event={event} data={data} /> });
  });

  // 3. Families
  const hasFamily = (s: InvitationViewData["groomFamily"]) => !!s.parentsLine || s.members.length > 0;
  if (hasFamily(data.groomFamily) || hasFamily(data.brideFamily)) {
    const { photo } = take();
    add({ id: "families", label: "Families", photo, surfaceFrom: photo, body: <FamiliesBody data={data} /> });
  }

  // 4. The couple's own gallery
  if (data.features.gallery && data.photos.length > 0) {
    const photos: Photo[] = data.photos.slice(0, 24).map((p, i) => ({ src: p.url, alt: `Photo ${i + 1} of ${coupleAlt}` }));
    previousPhoto = -1;
    add({ id: "moments", label: "Moments", photo: photos[Math.min(api.moment, photos.length - 1)], body: <MomentsBody photos={photos} active={api.moment} onPick={api.setMoment} /> });
  }

  // 5. RSVP
  if (data.features.rsvp && !!data.guest && data.events.length > 0) {
    const { photo } = take();
    add({ id: "rsvp", label: "RSVP", photo, surfaceFrom: photo, body: <RsvpBody data={data} onRsvp={api.onRsvp} /> });
  }

  // The thank-you note sits at the end of the last chapter
  const last = scenes[scenes.length - 1];
  last.body = (
    <>
      {last.body}
      <Thanks data={data} />
    </>
  );
  return scenes;
}

// ---------------------------------------------------------------- scrolling behaviour

/** Is there still something to scroll inside the chapter in this direction? Then let the browser do it. */
function canScroll(target: EventTarget | null, delta: number): boolean {
  if (!(target instanceof Element)) return false;
  const boxes = [target.closest(".ch-inner"), target.closest(".ch-scene")].filter((el): el is Element => !!el);
  return boxes.some((el) => el.scrollHeight > el.clientHeight + 3 && (delta > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 4 : el.scrollTop > 4));
}

// Where the header and the chapter menu sit on each layout: over the picture or over the colour.
const PLACE: Record<Layout, { lc: string; rc: string; ln: string; rn: string }> = {
  split: { lc: "surface", rc: "photo", ln: "surface", rn: "photo" },
  flip: { lc: "photo", rc: "surface", ln: "photo", rn: "surface" },
  overlay: { lc: "photo", rc: "photo", ln: "photo", rn: "photo" },
  arch: { lc: "surface", rc: "surface", ln: "surface", rn: "surface" },
  poster: { lc: "photo", rc: "photo", ln: "surface", rn: "surface" },
};

export default function Chapters({ data, onRsvp, reduceMotion, opened, config }: ContentProps & { config: ChapterConfig }) {
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([0, 1]);
  const [scrolled, setScrolled] = useState(false);
  const [moment, setMoment] = useState(0);
  const [live, setLive] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef(0);
  const countRef = useRef(1);
  const busyRef = useRef(false);
  const openedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (target: number, force = false) => {
      const next = Math.max(0, Math.min(countRef.current - 1, target));
      if ((busyRef.current && !force) || next === currentRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      busyRef.current = true;
      setLeaving(currentRef.current);
      currentRef.current = next;
      setCurrent(next);
      setSeen((s) => [...new Set([...s, next - 1, next, next + 1])].filter((n) => n >= 0));
      setScrolled(false);
      const el = sceneRefs.current[next];
      if (el) {
        el.scrollTop = 0;
        el.querySelector(".ch-inner")?.scrollTo(0, 0);
      }
      timerRef.current = setTimeout(() => {
        setLeaving(null);
        busyRef.current = false;
      }, reduceMotion ? 0 : 850);
    },
    [reduceMotion],
  );

  const scenes = buildScenes(data, config, { go, moment, setMoment, onRsvp });

  useEffect(() => {
    countRef.current = scenes.length;
    openedRef.current = opened;
  });

  // The first chapter fades in on the next frame, so its text animates in
  useEffect(() => {
    const id = requestAnimationFrame(() => setLive(true));
    return () => {
      cancelAnimationFrame(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Mouse wheel, swipe and keyboard
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let wheelSum = 0;
    let wheelAt = 0;
    let nativeGesture = false;
    let touch: { x: number; y: number; time: number; target: EventTarget | null; down: boolean; up: boolean } | null = null;

    const onWheel = (e: WheelEvent) => {
      if (!openedRef.current || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = Date.now();
      if (now - wheelAt > 250) {
        wheelSum = 0;
        nativeGesture = false;
      }
      wheelAt = now;
      if (canScroll(e.target, e.deltaY)) {
        nativeGesture = true;
        wheelSum = 0;
        return;
      }
      e.preventDefault();
      if (busyRef.current || nativeGesture) return;
      if (Math.sign(wheelSum) !== Math.sign(e.deltaY)) wheelSum = 0;
      wheelSum += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      if (Math.abs(wheelSum) > 70) {
        go(currentRef.current + (wheelSum > 0 ? 1 : -1));
        wheelSum = 0;
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const p = e.touches[0];
      touch = { x: p.clientX, y: p.clientY, time: Date.now(), target: e.target, down: canScroll(e.target, 1), up: canScroll(e.target, -1) };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touch || !openedRef.current || e.changedTouches.length !== 1) return;
      const p = e.changedTouches[0];
      const dy = touch.y - p.clientY;
      const dx = touch.x - p.clientX;
      const start = touch;
      touch = null;
      const onControl = start.target instanceof Element && !!start.target.closest("button,a,input,textarea,select");
      if (Math.abs(dy) > 75 && Math.abs(dy) > Math.abs(dx) * 1.35 && Date.now() - start.time < 800 && !(dy > 0 ? start.down : start.up) && !onControl) {
        go(currentRef.current + (dy > 0 ? 1 : -1));
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (!openedRef.current || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t instanceof Element && t.closest("input,textarea,select,[contenteditable=true]")) return;
      const next = ["ArrowDown", "ArrowRight", "PageDown"];
      const prev = ["ArrowUp", "ArrowLeft", "PageUp"];
      if (next.includes(e.key) || prev.includes(e.key)) {
        const step = next.includes(e.key) ? 1 : -1;
        if (canScroll(t, step)) return;
        e.preventDefault();
        go(currentRef.current + step);
      } else if (e.key === "Home") {
        e.preventDefault();
        go(0);
      } else if (e.key === "End") {
        e.preventDefault();
        go(countRef.current - 1);
      }
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("keydown", onKey);
    };
  }, [go]);

  // Keep the active chapter name in view in the menu
  useEffect(() => {
    const track = trackRef.current;
    const link = track?.children[current] as HTMLElement | undefined;
    if (track && link) track.scrollTo({ left: link.offsetLeft - track.clientWidth / 2 + link.clientWidth / 2, behavior: reduceMotion ? "auto" : "smooth" });
  }, [current, reduceMotion]);

  const active = scenes[Math.min(current, scenes.length - 1)];
  const place = PLACE[active.layout];
  const rootStyle = { "--active-bg": active.surface.bg, "--active-ink": active.surface.ink, ...config.vars } as CSSProperties;
  const initials = `${data.groomName.trim().charAt(0)}${data.brideName.trim().charAt(0)}`.toUpperCase();
  const last = current >= scenes.length - 1;

  return (
    <div
      className="ch-root"
      ref={rootRef}
      data-open={opened}
      data-layout={active.layout}
      data-scrolled={scrolled}
      data-lc={place.lc}
      data-rc={place.rc}
      data-ln={place.ln}
      data-rn={place.rn}
      style={rootStyle}
    >
      <header className="ch-chrome">
        <button type="button" className="ch-monogram" onClick={() => go(0)} aria-label="Back to the first chapter">
          <span>{initials.charAt(0)}</span>
          <i>&amp;</i>
          <span>{initials.charAt(1)}</span>
        </button>
        <span className="ch-header-date">{monthYear(data.weddingDate)}</span>
      </header>

      {scenes.map((scene, i) => {
        const isActive = live && i === current;
        const showPhoto = seen.includes(i) || i === current;
        const { photo, surface } = scene;
        const sceneStyle = {
          "--scene-bg": surface.bg,
          "--scene-ink": surface.ink,
          "--scene-accent": surface.accent,
          "--scene-on-accent": surface.bg,
          "--scene-light": isLight(surface.bg) ? 1 : 0,
        } as CSSProperties;
        return (
          <section
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className={`ch-scene ch-layout-${scene.layout} ${isActive ? "is-active" : ""} ${leaving === i ? "is-leaving" : ""} ${scene.overlay ? "has-overlay" : ""}`}
            style={sceneStyle}
            aria-label={scene.label}
            aria-hidden={!isActive}
            inert={!isActive}
            onScroll={(e) => {
              if (i === currentRef.current) setScrolled(e.currentTarget.scrollTop > 70);
            }}
          >
            <div className="ch-photo">
              {showPhoto && photo && (
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={scene.layout === "overlay" || scene.layout === "poster" ? "100vw" : "(max-width: 760px) 100vw, 50vw"}
                  priority={i === 0}
                  className="ch-photo-img"
                  style={{ objectPosition: photo.position }}
                />
              )}
            </div>
            <div className="ch-inner">
              <div className="ch-content">{scene.body}</div>
            </div>
            {scene.overlay && <div className="ch-countdown ch-overlay">{scene.overlay}</div>}
            {scene.caption && <p className="ch-caption">{scene.caption}</p>}
          </section>
        );
      })}

      <nav className="ch-nav" aria-label="Invitation chapters" inert={!opened}>
        <div className="ch-progress" aria-hidden>
          <span style={{ width: `${((current + 1) / scenes.length) * 100}%` }} />
        </div>
        <div className="ch-nav-left">
          <span className="ch-count">
            {String(current + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
          </span>
          <div className="ch-track" ref={trackRef}>
            {scenes.map((scene, i) => (
              <button key={scene.id} type="button" className="ch-link" aria-current={i === current ? "step" : undefined} onClick={() => go(i)}>
                {scene.label}
              </button>
            ))}
          </div>
        </div>
        <div className="ch-nav-right">
          <span className="ch-note-small">{last ? `With love, ${data.groomName} & ${data.brideName}` : "Scroll to explore"}</span>
          <div className="ch-pager">
            <button type="button" className="ch-round" aria-label="Previous chapter" disabled={current <= 0} onClick={() => go(current - 1)}>
              <ChevronUp aria-hidden />
            </button>
            <button type="button" className="ch-round" aria-label="Next chapter" disabled={last} onClick={() => go(current + 1)}>
              <ChevronDown aria-hidden />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
