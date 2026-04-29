import type { Metadata } from 'next'
import JsonLd from './components/JsonLd'
import HomepageClient from './HomepageClient'

export const metadata: Metadata = {
  title: { absolute: 'MUSASHI - Trade the Tweets' },
  description: 'AI intelligence service for trading bots. Monitor 71 high-signal accounts, track 900+ prediction markets across Polymarket and Kalshi, detect arbitrage, and get automated trading signals via REST API. Free.',
  openGraph: {
    title: 'MUSASHI - Trade the Tweets',
    description: 'AI trading bot intelligence for prediction markets. 900+ markets. Arbitrage detection. Free API with no rate limits.',
    url: 'https://musashi.bot',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Musashi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Musashi is an AI intelligence service that automatically collects and analyzes tweets from 71 high-signal accounts every 2 minutes, matches them to 900+ prediction markets, generates trading signals, and feeds structured data to AI trading bots via a polling API.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is Musashi built for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primarily for AI trading bots and developers building automated prediction market strategies. The core product is a feed API that provides analyzed tweets with sentiment, urgency levels, confidence scores, and suggested trading actions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the automated feed work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every 2 minutes, Musashi collects tweets from 71 monitored accounts across 8 categories (crypto, politics, economics, tech, sports, geopolitics, finance, breaking news). Each tweet is analyzed using keyword matching, entity extraction, and sentiment analysis, then matched to relevant markets.',
      },
    },
    {
      '@type': 'Question',
      name: 'What markets does Musashi cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '900+ markets from Polymarket (500) and Kalshi (400), sorted by volume. Politics, economics, crypto, technology, sports, geopolitics, climate, and entertainment. Markets update every 15-20 seconds for real-time trading decisions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Musashi free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, completely free during beta. The feed API and SDK are free with no rate limits. Fair usage limits may be added in the future, but the core service will remain free for reasonable bot usage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I integrate Musashi into my trading bot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the Agent SDK (TypeScript/JavaScript) or call the REST API directly. Poll /api/feed every 20-30 seconds with filters for category, urgency, and timestamp. The SDK provides callback methods like onFeed() that handle polling automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'What about arbitrage and market movers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Musashi detects cross-platform arbitrage opportunities (e.g., same market trading at 63% on Polymarket, 70% on Kalshi = 7% spread) and tracks markets with significant price changes. Access via /api/markets/arbitrage and /api/markets/movers endpoints.',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <HomepageClient />
    </>
  )
}
