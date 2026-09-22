import type { Metadata } from "next";
import { site } from "@/lib/content";

/**
 * ============================================================================
 * SHARE PREVIEWS (Open Graph / Twitter Cards)
 * ============================================================================
 * What a link to this site looks like when it is pasted into a text message,
 * WhatsApp, Slack, Facebook, LinkedIn or X.
 *
 * THE FOOTGUN THIS FILE EXISTS TO CLOSE
 *
 * Next.js does not deep-merge `openGraph`. A page that declares its own
 * `openGraph` block REPLACES the layout's entirely — so a page that sets only
 * a title and description silently loses og:image, og:site_name and og:locale,
 * and its preview card drops to a bare line of text with no picture. The same
 * applies to `twitter`: lose the block and the card quietly downgrades from
 * `summary_large_image` (the wide card) to `summary` (a small square crop).
 *
 * Nothing warns you. The build passes, the page looks right, and the failure
 * only shows up in someone else's chat app.
 *
 * So pages do not hand-write these blocks. They call `pageMetadata()`, which
 * carries the image, site name and locale forward and overrides only the parts
 * that are genuinely per-page.
 *
 * ABSOLUTE URLS
 *
 * Crawlers do not resolve relative paths. Every og:* URL has to be absolute,
 * which Next.js does for us from `metadataBase` in the root layout — and
 * `metadataBase` is built from `site.url`. If `site.url` is wrong, every share
 * preview on the site asks the wrong host for its image and gets a 404. That
 * is not hypothetical: it was the state of this site until September 2026,
 * when `site.url` still held a placeholder domain belonging to an unrelated
 * company. See the comment on `site.url` in content.ts.
 * ============================================================================
 */

/**
 * The image every card falls back to. Supplied by the client, resized from
 * 1731x909 to 1200x630 — the size Facebook, LinkedIn, Slack and X all lay out
 * at, and what iMessage renders as a large card rather than a small thumbnail.
 *
 * Two constraints if this is ever replaced:
 *
 *   1. The dimensions declared below must match the file. Platforms use them to
 *      reserve the card's space before the image has downloaded; a mismatch
 *      gives you a card that jumps, or one that is letterboxed.
 *   2. Keep it a few hundred KB at most. WhatsApp gives up on large images and
 *      falls back to a bare link, and a preview nobody waits for is the same as
 *      no preview. This file is ~210KB as JPEG quality 95 — worth the size over
 *      quality 90, which leaves visible ringing around the headline, on a card
 *      that is almost entirely sharp text on near-white.
 *
 * Also keep anything that matters within roughly 8% of each edge. X crops a
 * 1.91:1 card towards 2:1 and some clients crop a little further; the current
 * artwork's headline sits at 8% left and 7.5% right, which survives that.
 */
const SHARE_IMAGE_PATH = "/images/og-default.jpg";

export const shareImage = {
  // Relative: Next.js resolves this against metadataBase.
  url: SHARE_IMAGE_PATH,
  // NOT relative, and deliberately so. Next.js resolves `url` against
  // metadataBase but does NOT resolve `secureUrl` — hand it a relative path
  // and it emits og:image:secure_url="/images/og-default.jpg" verbatim, which
  // no scraper can resolve. That is worse than omitting the tag: a crawler
  // that prefers secure_url over og:image gets a dead URL and falls back to no
  // image at all. It is built from site.url here so it still cannot drift from
  // the canonical domain.
  //
  // The tag is redundant for modern scrapers, which use og:image directly when
  // it is already https. It is kept because WhatsApp and some older Meta
  // scrapers have historically looked for secure_url first.
  secureUrl: `${site.url}${SHARE_IMAGE_PATH}`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  // Describes what is actually on the card, for screen-reader users on
  // Facebook and X. If the artwork changes, this changes with it.
  alt: "Precision Rehab & Performance — one-on-one physical therapy, Melbourne, Florida. Pain, recovery, performance. Precision care, built around you.",
};

/**
 * The home page card.
 *
 * Deliberately not the same strings as the <title> and meta description. Those
 * are read by a search engine, which wants the search term first ("Physical
 * Therapist in Melbourne, FL | ..."). A preview card is read by a person, and
 * there a pipe and a keyword phrase read as spam while the clinic's actual
 * name matters more.
 *
 * Length is the other reason. Cards truncate hard and each platform truncates
 * at a different point, so anything that has to survive must come early. The
 * free screening is the only thing here asking the reader to act, so it sits
 * inside the first 120 characters instead of trailing off the end.
 *
 * Every claim is already on the page and in content.ts. Nothing here is a new
 * fact, and nothing here should become one — a share card is the part of a
 * site most likely to be screenshotted and quoted back at the clinic.
 */
export const shareTitle = "Precision Rehab & Performance — Melbourne, FL";
export const shareDescription =
  "One-on-one, cash-based physical therapy with Dr. Kushal Patel, PT, DPT. Free 15-minute screening — in person or virtual.";

/**
 * Is this build the real production site?
 *
 * Vercel sets VERCEL_ENV to "production" | "preview" | "development". Every
 * push to a branch produces a preview deployment on a public *.vercel.app URL
 * that serves the same content as production — which means, left alone, Google
 * can index a preview and it competes with the real site for its own keywords,
 * or worse, outranks it.
 *
 * The default is deliberately the SAFE-FOR-PRODUCTION-SEO direction, not the
 * safe-for-convenience one: anything that is not explicitly production (a
 * preview, a local dev server, a CI build with no VERCEL_ENV) is treated as
 * not-production and gets noindex. The failure mode of being too eager here is
 * that a preview does not get indexed, which is what we want anyway. The
 * failure mode of the opposite default is duplicate content on a URL nobody
 * is watching.
 */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/**
 * The robots directive for every page, decided in one place.
 *
 * It has to be one place. A page that hardcodes `robots: { index: true }` —
 * which /privacy did — overrides this and publishes an indexable preview no
 * matter what the root layout says. Routing it through pageMetadata() means a
 * page cannot opt itself back into indexing by accident.
 */
export const robotsDirective = isProductionDeployment()
  ? {
      index: true,
      follow: true,
      /**
       * Without max-image-preview:large Google caps itself at a small preview
       * or none, no matter how good the candidate images are. index/follow are
       * stated explicitly because a partial googleBot object silently drops
       * what it omits. `as const` keeps the literal from widening to string,
       * which Next's Robots type rejects.
       */
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    }
  : {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    };

type PageMeta = {
  /** Used for <title>. Falls back to the share title. */
  title: string;
  /** Used for the meta description. Falls back to the share description. */
  description: string;
  /** Root-relative, e.g. "/privacy". Resolved against metadataBase. */
  path: string;
  /** og:type. "website" for the home page, "article" for everything else. */
  type?: "website" | "article";
  /** Overrides for the card only, when it should read differently to the page. */
  shareTitle?: string;
  shareDescription?: string;
};

/**
 * Builds the canonical link plus a complete, self-consistent pair of
 * Open Graph and Twitter blocks. Use this for every route that sets metadata.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "article",
  shareTitle: cardTitle,
  shareDescription: cardDescription,
}: PageMeta): Metadata {
  const ogTitle = cardTitle ?? title;
  const ogDescription = cardDescription ?? description;

  return {
    title,
    description,
    alternates: { canonical: path },
    // Central, so no page can opt itself back into indexing on a preview.
    robots: robotsDirective,
    openGraph: {
      type,
      url: path,
      title: ogTitle,
      description: ogDescription,
      siteName: site.name,
      locale: "en_US",
      images: [shareImage],
    },
    twitter: {
      // Without this, X falls back to a small square thumbnail that crops a
      // 1200x630 card to its centre and cuts the logo off.
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [shareImage],
    },
  };
}
