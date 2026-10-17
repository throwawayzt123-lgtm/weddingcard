import { WATERMARK_NAME } from "@/lib/site";

/** A small, quiet credit on every invitation. It opens WhatsApp so interested guests can order their own. */
export function Watermark({ href }: { href: string }) {
  return (
    <a className="inv-watermark" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Made by ${WATERMARK_NAME}. Message us on WhatsApp`}>
      Made by {WATERMARK_NAME}
    </a>
  );
}
