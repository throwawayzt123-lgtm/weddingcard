// Small decorative SVGs shared by all designs. They take their colour from
// the design's CSS variables, so every template recolours them automatically.

/** ——◆—— divider. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`inv-divider ${className}`} aria-hidden>
      <span />
      <svg viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 1l4 11-4 11-4-11z" fill="currentColor" />
        <path d="M1 12l11-4 11 4-11 4z" fill="currentColor" opacity=".55" />
      </svg>
      <span />
    </div>
  );
}

/** Eight-point star, used as the "✻" between the couple's names. */
export function Star8({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 0l2.6 6.4L21 3.4l-3 6.4L24 12l-6 2.2 3 6.4-6.4-3L12 24l-2.6-6.4L3 20.6l3-6.4L0 12l6-2.2-3-6.4 6.4 3z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Scroll-down hint with a bouncing arrow. */
export function ScrollHint({ label = "Scroll down" }: { label?: string }) {
  return (
    <div className="inv-scroll-hint" aria-hidden>
      <span>{label}</span>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
