import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'
import RelatedLinks from '../../components/RelatedLinks'
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createPageMetadata,
  createPublisherSchema,
} from '../../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Trading Bot Quickstart',
  description:
    'How to build a prediction market trading bot with Musashi. Step-by-step guide: connect to the feed API, read sentiment signals, and automate trades on Polymarket and Kalshi.',
  path: '/docs/trading-bot-quickstart',
  ogTitle: 'Trading Bot Quickstart | MUSASHI',
  ogDescription:
    'Build a prediction market trading bot in minutes. Free REST API with sentiment signals for Polymarket and Kalshi.',
  type: 'article',
})

const faqs: FaqEntry[] = [
  {
    q: 'How often does the Musashi feed update?',
    a: 'The feed updates every 2 minutes as Musashi polls 71 Twitter accounts and matches new tweets to active markets. For your bot, polling every 20–30 seconds is optimal to catch fresh signals quickly without excess load.',
  },
  {
    q: 'Can I use Musashi with Python?',
    a: 'Yes. The REST API returns JSON and works with any HTTP client. Use requests.get() to poll /api/feed, parse the JSON, and filter by sentiment and urgency. Python examples are in the API docs at musashi.bot/ai.',
  },
  {
    q: 'Does Musashi support Kalshi markets?',
    a: 'Yes. Musashi tracks Kalshi alongside Polymarket and its arbitrage endpoint detects cross-platform spreads between the two exchanges in real time.',
  },
  {
    q: 'How do I filter signals by urgency?',
    a: 'Pass the urgency query parameter to /api/feed. Accepted values: critical, high, medium, low. For automated trading, filtering on critical and high urgency captures the highest-confidence signals while reducing noise.',
  },
  {
    q: 'Is there a rate limit?',
    a: 'Currently no rate limits during beta. Fair usage guidelines apply — polling more frequently than every 10 seconds per endpoint is not recommended and may be throttled in a future release.',
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Build a Prediction Market Trading Bot with Musashi',
    description: 'Step-by-step guide to building an automated prediction market trading bot using the Musashi API.',
    url: 'https://musashi.bot/docs/trading-bot-quickstart',
    datePublished: '2026-04-29',
    image: 'https://musashi.bot/images/generated-1771830449125.png',
    author: createPublisherSchema(),
    publisher: createPublisherSchema(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Build a Prediction Market Trading Bot with Musashi',
    description: 'Build an automated trading bot that places Polymarket and Kalshi trades based on Twitter sentiment signals.',
    step: [
      { '@type': 'HowToStep', name: 'Install Musashi', text: 'Clone the repo, run npm install, and start the agent with npm run agent.' },
      { '@type': 'HowToStep', name: 'Poll the feed API', text: 'Call GET /api/feed every 20–30 seconds with filters for category and urgency.' },
      { '@type': 'HowToStep', name: 'Read sentiment signals', text: 'Parse sentiment (bullish/bearish/neutral), confidence score, and suggested action from each feed item.' },
      { '@type': 'HowToStep', name: 'Execute trades', text: 'Use Polymarket or Kalshi SDKs to place trades when signal confidence exceeds your threshold.' },
    ],
  },
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'Trading Bot Quickstart', path: '/docs/trading-bot-quickstart' },
  ]),
]

const nextStepLinks = [
  { href: '/docs/polymarket-api', label: 'Polymarket API Reference' },
  { href: '/compare/best-prediction-market-api', label: 'Compare prediction market APIs' },
  { href: '/blog/polymarket-vs-kalshi-arbitrage', label: 'Polymarket vs Kalshi arbitrage guide' },
]

export default function TradingBotQuickstart() {
  return (
    <ContentPage
      h1="How to Build a Prediction Market Trading Bot with Musashi"
      answer="Musashi provides a free REST API that monitors 71 Twitter accounts, matches sentiment signals to live prediction markets on Polymarket and Kalshi, and delivers structured trading data. Clone, install, and your bot has live market intelligence in minutes."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Prerequisites</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          You need Node.js 18+ and a Polymarket or Kalshi account to execute trades. The Musashi API requires no authentication and has no rate limits during beta.
        </p>
        <ul className="flex flex-col gap-2">
          {['Node.js 18+', 'Git', 'Polymarket or Kalshi account (for execution)', 'Optional: Python 3.9+ for Python bots'].map(item => (
            <li key={item} className="flex items-start gap-3 font-jetbrains text-[13px] text-[var(--text-secondary)]">
              <span className="text-[#00FF88] font-bold mt-0.5">→</span>{item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Step 1: Install Musashi</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 font-jetbrains text-[13px] text-white rounded-sm">
          <div className="text-[#6E7D93] text-[11px] mb-3 uppercase tracking-[0.14em]">Terminal</div>
          <pre>{`git clone https://github.com/MusashiBot/Musashi.git
cd Musashi && npm install
npm run agent`}</pre>
        </div>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8] mt-4">
          The agent starts polling Twitter accounts and building the market match cache. The first full cycle takes about 2 minutes.
        </p>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Step 2: Poll the Feed API</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8] mb-4">
          Your bot polls <code className="text-white">GET /api/feed</code> to get new signals. Filter by <code className="text-white">category</code> and <code className="text-white">urgency</code> to reduce noise.
        </p>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 font-jetbrains text-[13px] text-white rounded-sm">
          <div className="text-[#6E7D93] text-[11px] mb-3 uppercase tracking-[0.14em]">JavaScript (Node.js)</div>
          <pre>{`const BASE = 'https://musashi-api.vercel.app'
let lastSeen = Date.now()

async function pollFeed() {
  const res = await fetch(
    \`\${BASE}/api/feed?urgency=high&since=\${lastSeen}\`
  )
  const { signals } = await res.json()
  const newestSignalTs = signals.reduce(
    (max, signal) => Math.max(max, signal.createdAt),
    lastSeen
  )
  lastSeen = newestSignalTs
  return signals
}

setInterval(async () => {
  const signals = await pollFeed()
  for (const signal of signals) {
    if (signal.sentiment === 'bullish' && signal.confidence > 0.75) {
      await executeTrade(signal)
    }
  }
}, 25_000)`}</pre>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Step 3: Interpret Trading Signals</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8] mb-4">
          Each feed item contains everything your bot needs to make a trading decision:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { field: 'sentiment', desc: 'bullish / bearish / neutral' },
            { field: 'confidence', desc: '0.0 – 1.0 score for the signal' },
            { field: 'action', desc: 'YES / NO / HOLD recommendation' },
            { field: 'urgency', desc: 'critical / high / medium / low' },
            { field: 'markets[]', desc: 'matched markets with Polymarket and Kalshi IDs' },
            { field: 'edge', desc: 'estimated probability edge in %' },
          ].map(({ field, desc }) => (
            <div key={field} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3">
              <code className="font-jetbrains text-[#00FF88] text-[12px]">{field}</code>
              <p className="font-jetbrains text-[var(--text-tertiary)] text-[11px] mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Step 4: Execute Trades</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8] mb-4">
          Use the Polymarket CLOB client or Kalshi API to place orders when your signal threshold is met. Only trade markets where signal confidence is above your minimum threshold (0.70+ recommended to start).
        </p>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8]">
          For arbitrage opportunities, check <code className="text-white">GET /api/markets/arbitrage</code> — see the full reference in the <Link href="/ai" className="text-[#00FF88] underline hover:opacity-80">API docs</Link>.
        </p>
      </section>

      <RelatedLinks title="Next Steps" links={nextStepLinks} />
    </ContentPage>
  )
}
