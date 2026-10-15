import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Only the marketing pages may appear in Google. Invitations, previews, the
// portal and the admin panel must never be indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: ["/", "/designs"], disallow: ["/admin", "/portal", "/i/", "/preview/", "/api/", "/login", "/dashboard"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
