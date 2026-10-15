import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is switched OFF on purpose. With it on, every page that
  // reads the database or the login session needs extra <Suspense> wrappers
  // and "use cache" rules. The classic model is simpler and fully supported.
  cacheComponents: false,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    // Photos uploaded by customers are stored on Cloudinary (Phase 5).
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // Basic security headers on every page.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
