import Link from "next/link";
import { Divider } from "@/components/invite-shared/ornaments";
import { SITE } from "@/lib/site";

export const metadata = { title: "Invitation not found", robots: { index: false, follow: false } };

export default function InvitationNotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[radial-gradient(120%_80%_at_50%_0%,#fbf3e2,#ecdcb9_70%,#d8c196)] px-6 text-center text-[#4a1c24]">
      <div className="max-w-md">
        <h1 className="font-script text-5xl text-[#7a1f35]">Invitation not found</h1>
        <div className="text-[#b98a2c]">
          <Divider />
        </div>
        <p className="mt-6 font-serif text-xl leading-relaxed">
          We couldn&apos;t find this invitation. Please check the link you received, or ask the family to send it again.
        </p>
        <Link href="/" className="mt-8 inline-block font-serif text-sm font-semibold underline underline-offset-4">
          {SITE.brandName}
        </Link>
      </div>
    </main>
  );
}
