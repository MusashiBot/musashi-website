import type { Metadata } from 'next'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'
import RelatedLinks from '../../components/RelatedLinks'
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createPageMetadata,
  createPublisherSchema,
} from '../../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Polymarket API Reference',
  description:
    'Musashi Polymarket API reference. Endpoints for market data, sentiment feed, arbitrage detection, and market movers. Free REST API with no authentication required.',
  path: '/docs/polymarket-api',
  ogTitle: 'Polymarket API Reference | MUSASHI',
  ogDescription:
    'Free Polymarket API with sentiment signals, arbitrage detection, and real-time market data. No authentication required.',
  type: 'article',
})

const faqs: FaqEntry[] = [
  {
    q: 'Does Musashi have a native Polymarket API?',
    a: 'Musashi is built on top of the Polymarket CLOB data layer and exposes a simplified REST API optimized for trading bots. It adds sentiment signals, cross-platform arbitrage detection, and pre-computed trading signals that the native Polymarket API does not provide.',
  },
  {
    q: 'How often does Polymarket data update?',
    a: 'Musashi polls Polymarket prices every 15–20 seconds and stores price history for computing 1-hour and 24-hour changes. The sentiment feed updates every 2 minutes as Twitter polling cycles complete.',
  },
  {
    q: 'Is there a rate limit on the API?',
    a: 'No rate limits during beta. Fair use guidelines recommend polling no faster than every 10 seconds per endpoint. Excessive polling may be throttled in future versions.',
  },
  {
    q: 'Can I get historical Polymarket data?',
    a: 'Musashi currently provides up to 48 hours of feed history via the since timestamp parameter on /api/feed. For longer historical data, the Polymarket CLOB API provides order book history directly.',
  },
  {
    q: 'Do I need authentication to use the API?',
    a: 'No. Musashi API endpoints for market data and sentiment require no API keys or authentication during beta. Only trade execution (via Polymarket or Kalshi directly) requires wallet credentials.',
  },
]

const endpoints = [
  {
    method: 'GET',
    path: '/api/feed',
    description: 'Sentiment signals matched to prediction markets',
    params: [
      { name: 'since', type: 'number', desc: 'Unix ms timestamp — return signals after this time' },
      { name: 'urgency', type: 'string', desc: 'Filter: critical | high | medium | low' },
      { name: 'category', type: 'string', desc: 'Filter: crypto | politics | economics | tech | sports | geopolitics | finance | breaking_news' },
      { name: 'sentiment', type: 'string', desc: 'Filter: bullish | bearish | neutral' },
    ],
  },
  {
    method: 'GET',
    path: '/api/markets',
    description: 'Live market list with prices across Polymarket and Kalshi',
    params: [
      { name: 'category', type: 'string', desc: 'Filter by market category' },
      { name: 'limit', type: 'number', desc: 'Number of markets to return (default 50, max 200)' },
    ],
  },
  {
    method: 'GET',
    path: '/api/markets/arbitrage',
    description: 'Cross-platform arbitrage opportunities (Polymarket vs Kalshi)',
    params: [
      { name: 'minSpread', type: 'number', desc: 'Minimum spread as a decimal (default 0.03 = 3%)' },
      { name: 'minConfidence', type: 'number', desc: 'Minimum match confidence (default 0.50)' },
      { name: 'limit', type: 'number', desc: 'Maximum results to return (default 10)' },
      { name: 'category', type: 'string', desc: 'Filter by market category' },
    ],
  },
  {
    method: 'GET',
    path: '/api/markets/movers',
    description: 'Markets with significant recent price movement',
    params: [
      { name: 'timeframe', type: 'string', desc: 'Time window: 1h | 24h (default 1h)' },
      { name: 'minChange', type: 'number', desc: 'Minimum price change as a decimal (default 0.05 = 5%)' },
      { name: 'limit', type: 'number', desc: 'Maximum results to return (default 20)' },
      { name: 'platform', type: 'string', desc: 'Optional platform filter: polymarket | kalshi' },
    ],
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Polymarket API Reference — Musashi',
    description: 'REST API reference for Musashi\'s Polymarket data endpoints including feed, markets, arbitrage, and movers.',
    url: 'https://musashi.bot/docs/polymarket-api',
    datePublished: '2026-04-29',
    image: 'https://musashi.bot/images/generated-1771830449125.png',
    author: createPublisherSchema(),
    publisher: createPublisherSchema(),
  },
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'Polymarket API', path: '/docs/polymarket-api' },
  ]),
]

const referenceLinks = [
  { href: '/ai', label: 'Interactive API docs' },
  { href: '/docs/trading-bot-quickstart', label: 'Trading bot quickstart' },
  { href: '/compare/best-prediction-market-api', label: 'Compare prediction market APIs' },
]

export default function PolymarketApiReference() {
  return (
    <ContentPage
      h1="Polymarket API Reference"
      answer="Musashi exposes a unified REST API for Polymarket and Kalshi market data. Base URL: musashi-api.vercel.app. No authentication required. All endpoints return JSON. 4 endpoints covering feed, markets, arbitrage, and movers."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-2">Base URL</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-5 py-4 font-jetbrains text-[13px] text-[#00FF88]">
          https://musashi-api.vercel.app
        </div>
        <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] mt-2">No API key or authentication headers required for read endpoints.</p>
      </section>

      {endpoints.map(({ method, path, description, params }) => (
        <section key={path}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-jetbrains text-[11px] font-bold text-[#00FF88] border border-[#00FF88]/40 bg-[#00FF88]/10 px-2 py-1">
              {method}
            </span>
            <code className="font-jetbrains text-[var(--text-primary)] text-[15px]">{path}</code>
          </div>
          <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.7] mb-4">{description}</p>
          <table className="w-full border-collapse font-jetbrains text-[12px] mb-2">
            <thead>
              <tr className="border-b border-[var(--border-primary)]">
                <th className="text-left py-2 pr-4 text-[var(--text-tertiary)] font-medium uppercase tracking-[0.1em]">Parameter</th>
                <th className="text-left py-2 pr-4 text-[var(--text-tertiary)] font-medium uppercase tracking-[0.1em]">Type</th>
                <th className="text-left py-2 text-[var(--text-tertiary)] font-medium uppercase tracking-[0.1em]">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map(p => (
                <tr key={p.name} className="border-b border-[var(--border-primary)] last:border-b-0">
                  <td className="py-2 pr-4"><code className="text-[#00FF88]">{p.name}</code></td>
                  <td className="py-2 pr-4 text-[var(--text-tertiary)]">{p.type}</td>
                  <td className="py-2 text-[var(--text-secondary)]">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Response Schema: /api/feed</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 font-jetbrains text-[13px] text-white rounded-sm overflow-x-auto">
          <pre>{`{
  "signals": [
    {
      "id": "string",
      "createdAt": 1714000000000,
      "tweet": {
        "author": "@handle",
        "text": "...",
        "url": "https://x.com/..."
      },
      "sentiment": "bullish" | "bearish" | "neutral",
      "confidence": 0.84,
      "action": "YES" | "NO" | "HOLD",
      "edge": 0.07,
      "urgency": "critical" | "high" | "medium" | "low",
      "category": "crypto",
      "markets": [
        {
          "polymarketId": "0x...",
          "kalshiId": "BTCUSD-...",
          "title": "Bitcoin above $70k by end of May?",
          "matchScore": 0.91
        }
      ]
    }
  ]
}`}</pre>
        </div>
      </section>

      <RelatedLinks
        title="Full API Reference"
        description="The complete interactive API docs with examples in Python, Node.js, and curl are at the link below."
        links={referenceLinks}
      />
    </ContentPage>
  )
}
