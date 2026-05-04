import type { Metadata } from 'next'
import JsonLd from './components/JsonLd'
import HomepageClient from './HomepageClient'
import markets from '../data/markets.json'

const publicMarketCount = (markets as Array<{ slug: string }>).length
const homeTitleTopic = 'Trading Bot API for Prediction Markets & Twitter Signals'
const homeTitle = `MUSASHI | ${homeTitleTopic}`

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: 'Free trading bot API for prediction markets. Track Polymarket and Kalshi prices, arbitrage spreads, and Twitter/X market signals in one feed.',
  openGraph: {
    title: homeTitle,
    description: 'Free trading bot API for prediction markets with Polymarket/Kalshi prices, arbitrage spreads, and Twitter/X signals.',
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
        text: 'Musashi is a free prediction market API with X/Twitter signals for trading bots. It tracks Polymarket and Kalshi prices, arbitrage spreads, and market signals in one structured feed.',
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
        text: `The public site currently surfaces ${publicMarketCount} live arbitrage pages across crypto, economics, entertainment, finance, geopolitics, politics, sports, and tech. Musashi matches signals across both Polymarket and Kalshi and keeps cross-platform pricing fresh for live trading decisions.`,
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
      <HomepageClient publicMarketCount={publicMarketCount} />
    </>
  )
}
