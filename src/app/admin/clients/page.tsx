import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordDialog } from "@/components/admin/reset-password";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  await requireAdmin();
  const clients = await prisma.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: { invitations: { select: { id: true, slug: true, groomName: true, brideName: true }, orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl">Clients</h1>
        <p className="mt-1 text-sm text-ink/60">
          {clients.length} {clients.length === 1 ? "customer" : "customers"}. Customers are created automatically when you make an invitation.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="card p-10 text-center text-ink/60">No customers yet.</div>
      ) : (
        <ul className="space-y-3">
          {clients.map((c) => {
            const first = c.invitations[0];
            return (
              <li key={c.id} className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl text-maroon">{c.name}</p>
                    <p className="text-sm text-ink/65">
                      <span className="font-mono">{c.username}</span>
                      {c.phone && (
                        <>
                          {" · "}
                          <a className="underline" href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer">
                            +{c.phone}
                          </a>
                        </>
                      )}
                      {c.email && <> · {c.email}</>}
                    </p>
                  </div>
                  {first && (
                    <ResetPasswordDialog
                      small
                      owner={{ id: c.id, name: c.name, phone: c.phone }}
                      couple={`${first.groomName} & ${first.brideName}`}
                      inviteUrl={`${SITE.url}/i/${first.slug}`}
                      loginUrl={`${SITE.url}/login`}
                    />
                  )}
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {c.invitations.length === 0 && <li className="text-sm text-ink/50">No invitations</li>}
                  {c.invitations.map((i) => (
                    <li key={i.id}>
                      <Link href={`/admin/invitations/${i.id}`} className="inline-block rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-maroon hover:bg-gold-light/40">
                        {i.groomName} &amp; {i.brideName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
