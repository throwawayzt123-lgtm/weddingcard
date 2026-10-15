"use client";

import { useEffect, useState } from "react";
import { eventStartMs, formatDate } from "@/lib/dates";
import type { InvitationViewData } from "@/templates/types";

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Counts down to the first event that has not started yet; afterwards shows "Happily married since…". */
export function Countdown({ data }: { data: InvitationViewData }) {
  // `now` stays null until the browser mounts, so the server and browser HTML match.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const starts = data.events.map((e) => ({ event: e, ms: eventStartMs(e, data.timezone) }));
  const upcoming = now === null ? undefined : starts.find((s) => s.ms > now);
  const finished = now !== null && !upcoming;

  if (finished) {
    return (
      <div className="text-center">
        <p className="inv-eyebrow">Alhamdulillah</p>
        <p className="inv-script mt-3 text-4xl sm:text-5xl">Happily married since</p>
        <p className="inv-title mt-3">{formatDate(data.weddingDate)}</p>
      </div>
    );
  }

  const parts = split(upcoming && now !== null ? upcoming.ms - now : 0);
  const cells: [string, number | null][] = [
    ["Days", now === null ? null : parts.days],
    ["Hours", now === null ? null : parts.hours],
    ["Minutes", now === null ? null : parts.minutes],
    ["Seconds", now === null ? null : parts.seconds],
  ];

  return (
    <div className="text-center">
      <p className="inv-eyebrow">Counting down to</p>
      <p className="inv-title mt-2">{upcoming ? upcoming.event.title : data.events[0]?.title ?? "the celebration"}</p>
      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4" role="timer" aria-label="Countdown">
        {cells.map(([label, value]) => (
          <div key={label} className="inv-count-cell">
            <span className="inv-count-num" suppressHydrationWarning>
              {value === null ? "––" : String(value).padStart(2, "0")}
            </span>
            <span className="inv-count-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
