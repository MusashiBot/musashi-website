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
  title: 'How to Automate Polymarket Trading',
  description:
    'Step-by-step guide to automating Polymarket trading. Use the Musashi API for sentiment signals and market data, then execute trades with the Polymarket CLOB client.',
  path: '/blog/how-to-automate-polymarket-trading',
  ogTitle: 'How to Automate Polymarket Trading | MUSASHI',
  ogDescription:
    'Automate Polymarket trading with sentiment signals and real-time market data from the Musashi API. Free guide.',
  type: 'article',
})

const faqs: FaqEntry[] = [
  {
    q: 'Is automated Polymarket trading allowed?',
    a: 'Yes. Polymarket allows bot trading via its CLOB API. You need a wallet with USDC on Polygon to place orders. Musashi provides the market intelligence layer; you connect it to Polymarket execution using the official CLOB client.',
  },
  {
    q: 'What programming languages can I use for Polymarket automation?',
    a: 'Any language that can make HTTP requests. Musashi has a TypeScript/JavaScript Agent SDK and REST API, so direct support for Node.js and Python. The Polymarket CLOB client is available in Python and JavaScript.',
  },
  {
    q: 'How do I know which markets to trade?',
    a: "Musashi's signal feed returns markets where high-signal Twitter accounts have posted content that AI classifies as bullish or bearish with a confidence score. Start by filtering for urgency=high and confidence>0.75 to find the clearest setups.",
  },
  {
    q: 'What is the minimum edge worth trading?',
    a: 'Polymarket charges no fees to make (limit) orders. For automated bots, a net edge of 2–3% after slippage is a reasonable minimum. Use Musashi\'s edge field on each signal as a starting point, but validate against recent market history.',
  },
  {
    q: 'Can Musashi automate the trading execution itself?',
    a: "No — Musashi provides market intelligence (signals, sentiment, arbitrage). Trade execution requires a separate integration with Polymarket's CLOB API or Kalshi's trading API, using your own wallet credentials.",
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Automate Polymarket Trading',
    description: 'Guide to automating Polymarket trading using the Musashi API for market intelligence and sentiment signals.',
    url: 'https://musashi.bot/blog/how-to-automate-polymarket-trading',
    datePublished: '2026-04-29',
    image: 'https://musashi.bot/images/generated-1771830449125.png',
    author: createPublisherSchema(),
    publisher: createPublisherSchema(),
  },
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'How to Automate Polymarket Trading', path: '/blog/how-to-automate-polymarket-trading' },
  ]),
]

const relatedGuideLinks = [
  { href: '/docs/trading-bot-quickstart', label: 'Trading Bot Quickstart (full setup)' },
  { href: '/blog/polymarket-vs-kalshi-arbitrage', label: 'Polymarket vs Kalshi arbitrage' },
  { href: '/docs/polymarket-api', label: 'Polymarket API reference' },
]

export default function HowToAutomatePolymarket() {
  return (
    <ContentPage
      h1="How to Automate Polymarket Trading"
      answer="To automate Polymarket trading, you need a market intelligence source and an execution layer. Musashi handles intelligence — providing sentiment signals matched to live prediction markets across Polymarket and Kalshi every 2 minutes. The Polymarket CLOB API handles execution. Connect both and your bot runs 24/7."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">What You Need</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Market Intelligence', desc: 'Musashi API — sentiment signals, market data, arbitrage detection. Free, no auth required.' },
            { label: 'Execution Layer', desc: 'Polymarket CLOB API — place limit and market orders. Requires wallet with USDC on Polygon.' },
            { label: 'Signal Logic', desc: 'Your bot code — filter signals by confidence and urgency, map to Polymarket market IDs, decide position size.' },
            { label: 'Risk Management', desc: 'Position limits, maximum drawdown rules, and urgency thresholds to prevent runaway trading.' },
          ].map(({ label, desc }) => (
            <div key={label} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
              <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">{label}</h3>
              <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">The Signal-to-Execution Flow</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-6">
          A well-structured Polymarket bot follows this loop:
        </p>
        <ol className="flex flex-col gap-4">
          {[
            { n: '1', title: 'Poll Musashi /api/feed', body: 'Every 25 seconds, fetch new signals filtered by urgency=high. Each signal contains matched market IDs for both Polymarket and Kalshi.' },
            { n: '2', title: 'Filter and score signals', body: 'Keep signals where sentiment ≠ neutral, confidence > 0.70, and your position in that market is below your exposure limit.' },
            { n: '3', title: 'Check current market price', body: 'Before entering, verify the Polymarket price is consistent with the signal direction. Reject if price has already moved past your entry threshold.' },
            { n: '4', title: 'Calculate position size', body: 'Use Kelly criterion or fixed fractional sizing based on confidence and edge. The Musashi signal includes an edge estimate as a starting point.' },
            { n: '5', title: 'Place the order', body: 'Submit a limit order via the Polymarket CLOB API. Set a time-in-force to avoid stale fills if price moves away.' },
          ].map(({ n, title, body }) => (
            <li key={n} className="flex gap-4">
              <span className="flex-shrink-0 font-jetbrains text-[#00FF88] font-bold text-[13px] w-5 mt-0.5">{n}.</span>
              <div>
                <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-1">{title}</h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.75]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Code: Polling Musashi and Placing a Polymarket Order</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 font-jetbrains text-[13px] text-white rounded-sm overflow-x-auto">
          <div className="text-[#6E7D93] text-[11px] mb-3 uppercase tracking-[0.14em]">JavaScript</div>
          <pre>{`const MUSASHI = 'https://musashi-api.vercel.app'
const MIN_CONFIDENCE = 0.72
const MAX_POSITION_SIZE = 50 // USDC

async function runTradingLoop() {
  let lastSeen = Date.now()

  setInterval(async () => {
    // 1. Fetch signals
    const res = await fetch(
      \`\${MUSASHI}/api/feed?urgency=high&since=\${lastSeen}\`
    )
    const { signals } = await res.json()
    const newestSignalTs = signals.reduce(
      (max, signal) => Math.max(max, signal.createdAt),
      lastSeen
    )
    lastSeen = newestSignalTs

    // 2. Filter
    const actionable = signals.filter(s =>
      s.sentiment !== 'neutral' && s.confidence >= MIN_CONFIDENCE
    )

    // 3. Execute
    for (const signal of actionable) {
      const size = Math.min(signal.edge * 100, MAX_POSITION_SIZE)
      await placePolymarketOrder({
        marketId: signal.markets[0].polymarketId,
        side: signal.action === 'YES' ? 'buy' : 'sell',
        size,
      })
    }
  }, 25_000)
}

runTradingLoop()`}</pre>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Risk Management</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Automated trading amplifies both gains and errors. Before deploying:
        </p>
        <ul className="flex flex-col gap-3">
          {[
            'Paper trade for at least 2 weeks to calibrate signal accuracy before using real funds.',
            'Set a per-market position limit (e.g., 5% of your total bankroll) to prevent over-concentration.',
            'Add a daily drawdown circuit breaker — if you\'re down more than X% in 24 hours, the bot pauses.',
            'Monitor Musashi\'s signal accuracy by tracking whether bullish signals corresponded to price moves.',
          ].map(tip => (
            <li key={tip} className="flex items-start gap-3 font-jetbrains text-[13px] text-[var(--text-secondary)]">
              <span className="text-[#00FF88] font-bold mt-0.5 flex-shrink-0">→</span>{tip}
            </li>
          ))}
        </ul>
      </section>

      <RelatedLinks title="Related Guides" links={relatedGuideLinks} />
    </ContentPage>
  )
}
