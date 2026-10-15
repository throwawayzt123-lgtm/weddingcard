import Link from "next/link";
import { Divider } from "./ornaments";

// Simple, elegant full-page messages shown instead of an invitation.
// Standalone (they do not use a design's theme).

function Screen({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(120%_80%_at_50%_0%,#fbf3e2,#ecdcb9_70%,#d8c196)] px-6 py-16 text-center text-[#4a1c24]">
      <div className="max-w-md">
        <p className="font-serif text-xs font-bold tracking-[0.32em] text-[#9a6f1c] uppercase">{eyebrow}</p>
        <h1 className="mt-4 font-script text-5xl leading-tight text-[#7a1f35] sm:text-6xl">{title}</h1>
        <div className="text-[#b98a2c]">
          <Divider />
        </div>
        <div className="mt-6 font-serif text-xl leading-relaxed">{children}</div>
      </div>
    </main>
  );
}

export function ConcludedScreen({ groomName, brideName, brand }: { groomName: string; brideName: string; brand: string }) {
  return (
    <Screen eyebrow={`${groomName} & ${brideName}`} title="This celebration has concluded">
      <p>Thank you for being part of it. Your love and prayers made the days beautiful.</p>
      <p className="mt-8 text-sm text-[#7a4a2a]">
        Planning your own celebration?{" "}
        <Link href="/" className="font-semibold underline underline-offset-4">
          Visit {brand}
        </Link>
      </p>
    </Screen>
  );
}

export function SuspendedScreen({ brand }: { brand: string }) {
  return (
    <Screen eyebrow="Invitation unavailable" title="Temporarily unavailable">
      <p>This invitation is not available right now. Please contact the family or try again later.</p>
      <p className="mt-8 text-sm text-[#7a4a2a]">{brand}</p>
    </Screen>
  );
}
