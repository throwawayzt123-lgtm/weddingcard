"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

// Background music. Browsers block autoplay, so playback is started by
// start(), which the opening screen calls from the guest's "Tap to Open" tap.

type MusicContextValue = {
  /** False when music is switched off, or the file is missing / failed to load. */
  available: boolean;
  playing: boolean;
  start: () => void;
  toggle: () => void;
};

const MusicContext = createContext<MusicContextValue>({
  available: false,
  playing: false,
  start: () => {},
  toggle: () => {},
});

export const useMusic = () => useContext(MusicContext);

export function MusicProvider({ src, enabled, children }: { src: string | null; enabled: boolean; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const wasPlayingBeforeHide = useRef(false);

  const available = enabled && !!src && !failed;

  const start = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    audio.volume = 0.6;
    audio.play().catch(() => {
      // Blocked or unsupported: stay silent, the music button still works.
    });
  }, [available]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [available]);

  // Pause when the guest switches to another app/tab, resume when they come back.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        wasPlayingBeforeHide.current = !audio.paused;
        audio.pause();
      } else if (wasPlayingBeforeHide.current) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const value = useMemo(() => ({ available, playing, start, toggle }), [available, playing, start, toggle]);

  return (
    <MusicContext.Provider value={value}>
      {available && (
        <audio
          ref={audioRef}
          src={src ?? undefined}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </MusicContext.Provider>
  );
}

/** Round button, bottom-left. Shows a little equaliser while music plays. */
export function MusicButton() {
  const { available, playing, toggle } = useMusic();
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="inv-music-btn"
      aria-label={playing ? "Mute music" : "Play music"}
      aria-pressed={playing}
    >
      {playing ? (
        <span className="inv-eq" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : (
        <VolumeX className="size-5" aria-hidden />
      )}
    </button>
  );
}
