import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { fontVariables } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.brandName} — Digital Wedding Invitations`,
    template: `%s | ${SITE.brandName}`,
  },
  description:
    "Beautiful animated wedding invitation websites with personal guest links, RSVP and venue maps — shared on WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: "#7a1f35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
