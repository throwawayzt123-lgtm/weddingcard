import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";

// After login everyone lands here and is sent to the right area by role.
export default async function DashboardRedirect() {
  const user = await requireUser();
  redirect(user.role === "ADMIN" ? "/admin" : "/portal");
}
