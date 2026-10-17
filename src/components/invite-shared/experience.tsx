"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import dynamic from "next/dynamic";
import type { InvitationViewData, TemplateProps } from "@/templates/types";
import { MusicButton, MusicProvider, useMusic } from "./music";
import { Watermark } from "./watermark";
import "@/templates/invite.css";

export type OpeningPhase = "closed" | "opening";
/** What the page body (everything after the opening screen) receives. */
export type ContentProps = TemplateProps & { reduceMotion: boolean; introDelay: number; opened: boolean };
export type OpeningProps = { data: InvitationViewData; phase: OpeningPhase; onTap: () => void };

/** What a design supplies; everything else (sections, logic) is shared. */
export type TemplateParts = {
  /** Full-screen "Tap to Open" screen (door, envelope, curtains…). */
  Opening: ComponentType<OpeningProps>;
  /** Fixed decorative layer behind the whole page. */
  Backdrop: ComponentType;
  /** How long the opening animation runs before the page is revealed (ms). */
  openingMs: number;
  /** A design with its own page layout supplies its own page body (lazy-loaded). Default: the shared scrolling page. */
  loadContent?: () => Promise<{ default: ComponentType<ContentProps> }>;
};

// SPEED ON SLOW PHONES
// The first screen is just the opening animation. The page body (animations library,
// gallery, RSVP…) is a separate download that starts quietly once the first screen has
// loaded, and is put on screen the moment the guest taps.
const loadContent = () => import("./content");
const InvitationContent = dynamic(loadContent, { ssr: false });

function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduce;
}

function Inner({ data, onRsvp, parts }: TemplateProps & { parts: TemplateParts }) {
  const { Opening, Backdrop, openingMs } = parts;
  const Content = useMemo(() => (parts.loadContent ? dynamic(parts.loadContent, { ssr: false }) : InvitationContent), [parts.loadContent]);
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [ready, setReady] = useState(false); // page body mounted (on tap)
  const [assets, setAssets] = useState(false); // background pictures + page-body code may download
  const { start } = useMusic();
  const reduceMotion = usePrefersReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const go = () => {
      t = setTimeout(() => {
        setAssets(true);
        (parts.loadContent ?? loadContent)(); // warm the download so the tap feels instant
      }, 500);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => { clearTimeout(t); window.removeEventListener("load", go); };
  }, []);

  const onTap = useCallback(() => {
    if (phase !== "closed") return;
    start(); // must run inside the tap, or browsers block the audio
    setReady(true);
    setPhase("opening");
    timer.current = setTimeout(() => setPhase("open"), reduceMotion ? 350 : openingMs);
  }, [phase, start, reduceMotion, openingMs]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // Keep the page still while the opening screen is showing.
  useEffect(() => {
    if (phase === "open") return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => { html.style.overflow = prev; };
  }, [phase]);

  return (
    <div className="invitation" data-template={data.templateKey} data-phase={phase} data-ready={assets}>
      <Backdrop />
      <Watermark href={data.brand.whatsappUrl} />
      {phase !== "open" && <Opening data={data} phase={phase} onTap={onTap} />}
      {ready && (
        <Content
          data={data}
          onRsvp={onRsvp}
          reduceMotion={reduceMotion}
          // the hero is revealed just before the opening screen finishes, so the guest sees it happen
          introDelay={Math.max(0, openingMs / 1000 - 0.9)}
          opened={phase === "open"}
        />
      )}
      {phase !== "closed" && <MusicButton />}
    </div>
  );
}

export function InvitationExperience(props: TemplateProps & { parts: TemplateParts }) {
  return (
    <MusicProvider src={props.data.music.src} enabled={props.data.music.enabled}>
      <Inner {...props} />
    </MusicProvider>
  );
}
