import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { isProductionDeployment } from "@/lib/seo";

/**
 * robots.txt
 *
 * On a preview deployment this stays CRAWLABLE on purpose, and that is not an
 * oversight. Blocking a preview in robots.txt would stop Google fetching the
 * page — which also stops it seeing the `noindex` that every preview page
 * carries. A URL that is blocked from crawling but linked from somewhere can
 * still end up listed, as a bare URL with no description and no way to remove
 * itself. Letting the crawler in to read the noindex is what actually keeps
 * previews out of the index.
 *
 * What previews do NOT do is advertise a sitemap. Handing a crawler a map of a
 * deployment we want ignored is pointless at best.
 */
export default function robots(): MetadataRoute.Robots {
  const production = isProductionDeployment();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The chat and contact endpoints accept POST only and have nothing to
      // index; keeping crawlers off them saves pointless requests.
      disallow: "/api/",
    },
    ...(production ? { sitemap: `${site.url}/sitemap.xml`, host: site.url } : {}),
  };
}
