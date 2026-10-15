"use client";

import { useRef } from "react";

/**
 * A pop-up that asks "are you sure?" using the browser's built-in <dialog>.
 * `children` is the content (often a <form>); `trigger` renders the button that opens it.
 */
export function Dialog({
  title,
  description,
  trigger,
  children,
}: {
  title: string;
  description?: string;
  trigger: (open: () => void) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  return (
    <>
      {trigger(open)}
      <dialog
        ref={ref}
        className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-ink/10 bg-white p-0 text-ink shadow-2xl backdrop:bg-black/50"
        onClick={(e) => {
          // click on the dark backdrop closes it
          if (e.target === ref.current) close();
        }}
      >
        <div className="p-6">
          <h2 className="font-serif text-2xl text-maroon">{title}</h2>
          {description && <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>}
          <div className="mt-5">{children(close)}</div>
        </div>
      </dialog>
    </>
  );
}
