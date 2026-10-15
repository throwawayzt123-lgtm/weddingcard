import { LogOut } from "lucide-react";
import { signOut } from "@/auth";

export function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button
        type="submit"
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink ${className}`}
      >
        <LogOut className="size-4" />
        Log out
      </button>
    </form>
  );
}
