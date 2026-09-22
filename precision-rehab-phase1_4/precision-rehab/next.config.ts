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
  /**
   * Image delivery.
   *
   * `formats` is the single highest-leverage line in this file. Next.js
   * defaults to WebP only; adding AVIF ahead of it means every <Image> is
   * served AVIF to any browser that accepts it, which is roughly 30% smaller
   * again for the same visual quality. The order matters — the first entry the
   * browser accepts is the one it gets. WebP stays as the fallback for the
   * handful of clients that do not take AVIF.
   *
   * `deviceSizes` is trimmed from the default nine breakpoints to six. The
   * widest image this site renders is the full-bleed hero; nothing needs a
   * 3840px variant, and every size left in the list is a separate optimised
   * file Vercel may generate and bill for.
   *
   * `minimumCacheTTL` is 31 days rather than the 60-second default. Deliberately
   * NOT a year: the optimiser keys its cache on the source path, and these
   * paths are not content-hashed, so a photograph swapped at the same filename
   * stays stale for however long this says. A month is long enough that repeat
   * visitors never refetch and short enough that a replaced photo appears
   * without anyone having to remember this line. If a photo must change
   * immediately, change its filename.
   */
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 rejects any `quality` not listed here. 65 is for the
    // full-bleed SectionPhoto layers, which sit under a 75% navy tint;
    // 75 stays for everything else, which is looked at directly.
    qualities: [65, 75],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400,
  },

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
