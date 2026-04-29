import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import JsonLd from "./components/JsonLd";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const SITE_URL = 'https://musashi.bot';
const SITE_NAME = 'MUSASHI';
const SITE_DESCRIPTION = 'AI intelligence service for trading bots. Monitor 71 high-signal accounts, track 900+ prediction markets across Polymarket and Kalshi, and get automated trading signals via REST API. Free with no rate limits.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Trade the Tweets`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Trade the Tweets`,
    description: 'AI trading bot intelligence for prediction markets. 900+ markets. Arbitrage detection. Free API.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Trade the Tweets`,
    description: 'AI trading bot intelligence for prediction markets. 900+ markets. Arbitrage detection. Free API.',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  sameAs: [
    'https://twitter.com/musashimarket',
    'https://github.com/MusashiBot',
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Prediction market intelligence API for AI trading bots. Automated feed from 71 high-signal accounts, 900+ markets on Polymarket and Kalshi, arbitrage detection, and trading signals.',
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <JsonLd data={organizationSchema} />
        <JsonLd data={softwareSchema} />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
