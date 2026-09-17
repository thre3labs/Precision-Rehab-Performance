import type { Metadata } from "next";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "./globals.css";
import { site, features } from "@/lib/content";
// Share-preview strings and the card image live in one place so a page can
// never half-declare an openGraph block and silently drop the image.
import { pageMetadata, shareTitle, shareDescription } from "@/lib/seo";
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildProviderSchema,
} from "@/lib/schema";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Analytics } from "@/components/analytics/Analytics";

// Fonts are self-hosted via @fontsource (bundled at build time) rather than
// next/font/google, since that requires a live connection to
// fonts.googleapis.com at build time — not guaranteed in every deploy
// environment (e.g. offline/CI sandboxes). Self-hosting also means no
// runtime dependency on Google's font CDN in production.

// Leads with the primary local search term, and short enough not to truncate
// in the results (Google cuts around 60 characters). The full brand name is
// the title TEMPLATE for child pages; the home page uses the short form so the
// keyword and the location both survive.
const title = "Physical Therapy in Melbourne FL | Precision Rehab";
const description =
  "Precision Rehab & Performance is a cash-based outpatient physical therapy clinic in Melbourne, FL led by Dr. Kushal Patel, PT, DPT. Book a free 15-minute screening, in person or virtual.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  description,
  keywords: [
    "physical therapist Melbourne FL",
    "physical therapy Melbourne FL",
    "cash based physical therapy Melbourne FL",
    "sports physical therapy Melbourne FL",
    "dry needling Melbourne FL",
    "physical therapy near me",
  ],
  // openGraph, twitter and the canonical link all come from one helper so
  // they cannot drift apart. See src/lib/seo.ts for why a page must never
  // hand-write a partial openGraph block.
  ...pageMetadata({
    title,
    description,
    path: "/",
    type: "website",
    shareTitle,
    shareDescription,
  }),
  // Restored after the spread: the root layout needs the template form so
  // child pages render as "Page name | Precision Rehab & Performance", which
  // the helper's plain-string title would otherwise overwrite.
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  icons: {
    icon: [
      { url: "/images/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Search engine ownership verification. Each is the token that console
  // gives you for its "HTML tag" method. Both are omitted entirely when unset,
  // so no empty meta tag ever ships, and each is independent — you can verify
  // Google without waiting on Bing.
  //
  // NEXT_PUBLIC_ is correct here: a verification token is public by design and
  // is meant to be read out of the page source. It proves control of the site
  // precisely because only someone who controls the site could put it there.
  //
  // Bing also imports a verified Google Search Console property directly,
  // which is usually faster than verifying separately. See DEPLOY.md.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ||
  process.env.NEXT_PUBLIC_BING_VERIFICATION
    ? {
        verification: {
          ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
            : {}),
          ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
            ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } }
            : {}),
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // One <script> per entity. They reference each other by @id rather than
  // nesting, so the clinic, the brand and the clinician stay one consistent
  // graph instead of three competing descriptions of the same business.
  const schemas = [
    buildLocalBusinessSchema(),
    buildOrganizationSchema(),
    buildProviderSchema(),
  ];

  return (
    <html lang="en">
      <head>
        {schemas.map((schema) => (
          <script
            key={schema["@id"]}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        {children}
        <MobileCTABar />
        {features.chatAssistant && <ChatWidget />}
        <Analytics />
      </body>
    </html>
  );
}
