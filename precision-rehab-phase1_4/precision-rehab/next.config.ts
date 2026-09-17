import type { NextConfig } from "next";

/**
 * Preview deployments must never compete with production in search.
 *
 * Every page already carries a `noindex` from src/lib/seo.ts when VERCEL_ENV
 * is not "production". This header is the second layer, and it covers what a
 * meta tag cannot: sitemap.xml, images, and any non-HTML response. Belt and
 * braces, because the cost of getting this wrong is the preview outranking the
 * real site for its own name.
 *
 * The condition is inverted deliberately — the header is added when the build
 * is NOT production, rather than skipped when it is. A typo in an env var name
 * then yields a noindexed preview, not a noindexed production site.
 */
const isProduction = process.env.VERCEL_ENV === "production";

const nextConfig: NextConfig = {
  async headers() {
    if (isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
