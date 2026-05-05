import type { Metadata } from 'next'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'
import RelatedLinks from '../../components/RelatedLinks'
import { createBreadcrumbSchema, createFaqSchema, createPageMetadata } from '../../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Best Prediction Market API for Trading Bots',
  description:
    'Compare the best prediction market APIs for trading bots. Musashi vs Polymarket native API vs Kalshi native API — features, data coverage, and automation support.',
  path: '/compare/best-prediction-market-api',
  ogTitle: 'Best Prediction Market API for Trading Bots | MUSASHI',
  ogDescription:
    'Musashi is the only API combining Twitter sentiment signals, arbitrage detection, and live market data for Polymarket and Kalshi. Free with no rate limits.',
})

const faqs: FaqEntry[] = [
  {
    q: 'Which prediction market API has the most markets?',
    a: 'Musashi combines Polymarket and Kalshi data in a single unified API. Native Polymarket and Kalshi APIs only return their own markets, requiring you to maintain two separate integrations and merge the market coverage yourself.',
  },
  {
    q: 'Is there a free Polymarket API?',
    a: 'Musashi provides free access to Polymarket market data — prices, volume, movement, and sentiment signals — with no authentication and no rate limits during beta. The native Polymarket CLOB API is free for reads but requires wallet authentication for trading.',
  },
  {
    q: 'Can I get real-time Kalshi prices via API?',
    a: 'Yes. Musashi polls Kalshi prices every 15–20 seconds and exposes them via /api/markets, including 1-hour and 24-hour change data. The native Kalshi API also provides market data but requires API key authentication.',
  },
  {
    q: 'What is the best API for prediction market arbitrage?',
    a: "Musashi's /api/markets/arbitrage endpoint is the only purpose-built arbitrage API for prediction markets. It automatically detects when the same event trades at different prices on Polymarket and Kalshi, and surfaces spreads with a configurable minimum threshold.",
  },
  {
    q: 'Does Musashi provide sentiment analysis?',
    a: "Yes. Musashi is the only prediction market API that combines Twitter sentiment signals with market data. It monitors 71 high-signal accounts, runs AI classification on each tweet, and returns bullish/bearish/neutral signals with confidence scores matched to specific markets.",
  },
]

const schemas = [
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
    {
      name: 'Best Prediction Market API for Trading Bots',
      path: '/compare/best-prediction-market-api',
    },
  ]),
]

const startBuildingLinks = [
  { href: '/docs/trading-bot-quickstart', label: 'Trading Bot Quickstart' },
  { href: '/ai', label: 'Full API Reference' },
  { href: '/blog/polymarket-vs-kalshi-arbitrage', label: 'Arbitrage detection guide' },
]

const comparison = [
  { feature: 'Markets covered', musashi: 'Cross-platform (Polymarket + Kalshi)', polymarket: 'Polymarket only', kalshi: 'Kalshi only' },
  { feature: 'Authentication', musashi: 'None required', polymarket: 'Wallet signature', kalshi: 'API key required' },
  { feature: 'Twitter sentiment signals', musashi: 'Yes — 71 accounts, every 2 min', polymarket: 'No', kalshi: 'No' },
  { feature: 'Arbitrage detection', musashi: 'Yes — cross-platform', polymarket: 'No', kalshi: 'No' },
  { feature: 'Market movers (price change)', musashi: 'Yes — 1h and 24h', polymarket: 'No', kalshi: 'No' },
  { feature: 'Trading signals (AI)', musashi: 'Yes — bullish/bearish/neutral + confidence', polymarket: 'No', kalshi: 'No' },
  { feature: 'Price data freshness', musashi: '15–20 sec', polymarket: 'Real-time (WebSocket)', kalshi: 'Real-time (WebSocket)' },
  { feature: 'Rate limits', musashi: 'None (beta)', polymarket: 'Limited', kalshi: 'Limited' },
  { feature: 'Price', musashi: 'Free', polymarket: 'Free reads', kalshi: 'Free reads' },
]

export default function BestPredictionMarketApi() {
  return (
    <ContentPage
      h1="Best Prediction Market API for Trading Bots"
      answer="Musashi is the only prediction market API that unifies Polymarket and Kalshi data with Twitter sentiment signals, arbitrage detection, and AI trading signals in a single free REST API — no authentication required."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse font-jetbrains text-[12px]">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                <th className="text-left py-3 pr-4 text-[var(--text-tertiary)] uppercase tracking-[0.12em] font-medium">Feature</th>
                <th className="text-left py-3 pr-4 text-[#00FF88] uppercase tracking-[0.12em] font-medium">Musashi</th>
                <th className="text-left py-3 pr-4 text-[var(--text-tertiary)] uppercase tracking-[0.12em] font-medium">Polymarket API</th>
                <th className="text-left py-3 text-[var(--text-tertiary)] uppercase tracking-[0.12em] font-medium">Kalshi API</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(({ feature, musashi, polymarket, kalshi }) => (
                <tr key={feature} className="border-b border-[var(--border-primary)] last:border-b-0">
                  <td className="py-3 pr-4 text-[var(--text-secondary)] font-medium">{feature}</td>
                  <td className="py-3 pr-4 text-[#00FF88]">{musashi}</td>
                  <td className="py-3 pr-4 text-[var(--text-tertiary)]">{polymarket}</td>
                  <td className="py-3 text-[var(--text-tertiary)]">{kalshi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Why Musashi for Trading Bots</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Native Polymarket and Kalshi APIs are optimized for order execution, not intelligence. They return raw market data but leave signal generation entirely to you. For a trading bot that needs to know <em>when</em> to trade — not just <em>how</em> — that&apos;s a major gap.
        </p>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Musashi fills the intelligence layer: it collects and classifies Twitter signals from 71 high-signal accounts, matches them to specific markets, and returns a structured signal with confidence score, edge estimate, and suggested action. Your bot can be operational in under 30 minutes.
        </p>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8]">
          For arbitrage bots specifically, Musashi&apos;s cross-platform spread detection is the only purpose-built endpoint in the category. It surfaces Polymarket–Kalshi price discrepancies automatically, so you don&apos;t have to maintain two separate polling loops.
        </p>
      </section>

      <RelatedLinks
        title="Start Building"
        description="Free with no authentication required. Ready in minutes."
        links={startBuildingLinks}
      />
    </ContentPage>
  )
}
