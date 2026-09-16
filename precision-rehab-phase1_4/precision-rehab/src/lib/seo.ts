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
 * The image every card falls back to. 1200x630 is the size Facebook, LinkedIn,
 * Slack and X all lay out at, and it is what iMessage renders as a large card
 * rather than a thumbnail.
 *
 * Keep it under a few hundred KB. WhatsApp in particular gives up on large
 * images and falls back to a bare link, and a preview nobody waits for is the
 * same as no preview.
 *
 * An alternative light-background version of this card is kept alongside it at
 * /images/og-alt-light.jpg. To use it, change the url below — nothing else.
 */
export const shareImage = {
  url: "/images/og-default.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Precision Rehab & Performance — outpatient physical therapy in Melbourne, Florida",
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
