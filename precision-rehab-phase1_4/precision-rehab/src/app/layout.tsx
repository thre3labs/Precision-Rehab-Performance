import type { Metadata } from "next";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "./globals.css";
import { site, features } from "@/lib/content";
// Share-preview strings and the card image live in one place so a page can
// never half-declare an openGraph block and silently drop the image.
import { pageMetadata, shareTitle, shareDescription } from "@/lib/seo";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Analytics } from "@/components/analytics/Analytics";

// Fonts are self-hosted via @fontsource (bundled at build time) rather than
// next/font/google, since that requires a live connection to
// fonts.googleapis.com at build time — not guaranteed in every deploy
// environment (e.g. offline/CI sandboxes). Self-hosting also means no
// runtime dependency on Google's font CDN in production.

const title =
  "Physical Therapist in Melbourne, FL | Precision Rehab & Performance";
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
  robots: {
    index: true,
    follow: true,
  },
  // Set NEXT_PUBLIC_GSC_VERIFICATION to the token Google Search Console gives
  // you for its "HTML tag" method. Omitted entirely when unset, so no empty
  // meta tag ever ships.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
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
