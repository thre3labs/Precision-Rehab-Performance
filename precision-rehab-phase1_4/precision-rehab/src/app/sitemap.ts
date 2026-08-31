import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * Phase 1: single landing page. Phase 2: add an entry per new route as
 * pages ship (/about, /treatments, /treatments/[slug], /conditions,
 * /free-screening, /faq, /blog, /blog/[slug], /contact) — Next.js will
 * regenerate sitemap.xml automatically from this file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
