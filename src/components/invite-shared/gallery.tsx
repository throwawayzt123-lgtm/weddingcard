"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { id: string; url: string };

/** Swipeable photo strip + fullscreen lightbox. */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  // Keyboard controls + stop the page scrolling behind the lightbox.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, step]);

  return (
    <>
      <div className="inv-gallery-strip" role="list">
        {photos.map((p, i) => (
          <button key={p.id} type="button" role="listitem" className="inv-gallery-item" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`}>
            <Image src={p.url} alt="" fill sizes="(max-width: 640px) 70vw, 280px" className="object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="inv-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button type="button" className="inv-lightbox-btn right-3 top-3" onClick={() => setOpen(null)} aria-label="Close">
              <X className="size-6" />
            </button>
            {photos.length > 1 && (
              <>
                <button type="button" className="inv-lightbox-btn left-2 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo">
                  <ChevronLeft className="size-7" />
                </button>
                <button type="button" className="inv-lightbox-btn right-2 top-1/2 -translate-y-1/2" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo">
                  <ChevronRight className="size-7" />
                </button>
              </>
            )}
            <motion.div
              key={open}
              className="relative h-[82dvh] w-[92vw] max-w-3xl"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) step(1);
                else if (info.offset.x > 60) step(-1);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[open].url} alt="" fill sizes="92vw" className="object-contain" priority />
            </motion.div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/70">
              {open + 1} / {photos.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
