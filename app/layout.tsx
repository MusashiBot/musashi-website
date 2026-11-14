import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Musashi · The prediction-market builder’s briefing",
    template: "%s · Musashi",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Musashi · The prediction-market builder’s briefing",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "Musashi · The prediction-market builder’s briefing",
    description: SITE_DESCRIPTION,
  },
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Musashi",
        url: SITE_URL,
        sameAs: ["https://github.com/MusashiBot", "https://x.com/RotcivWho"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
