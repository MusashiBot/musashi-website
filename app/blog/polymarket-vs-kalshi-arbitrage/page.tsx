import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'

export const metadata: Metadata = {
  title: 'Polymarket vs Kalshi Arbitrage: Detect and Trade Price Discrepancies',
  description: 'How to detect and trade Polymarket vs Kalshi arbitrage. When the same event trades at different prices on both platforms, you can lock in a risk-free profit. Musashi detects these spreads automatically.',
  openGraph: {
    title: 'Polymarket vs Kalshi Arbitrage | MUSASHI',
    description: 'Detect and trade Polymarket–Kalshi price discrepancies automatically with the Musashi arbitrage API. Real spread data, free.',
    url: 'https://musashi.bot/blog/polymarket-vs-kalshi-arbitrage',
  },
}

const faqs: FaqEntry[] = [
  {
    q: 'Is Polymarket vs Kalshi arbitrage profitable?',
    a: 'It can be, but execution risk is the primary constraint. Spreads above 5% on liquid markets are realistically tradeable. Below that, slippage, position limits, and withdrawal delays reduce or eliminate the edge. Use Musashi\'s arbitrage endpoint to surface only spreads above your minimum threshold.',
  },
  {
    q: 'How often do Polymarket–Kalshi spreads appear?',
    a: 'According to Musashi data, significant spreads (≥3%) appear on 15–30 markets at any given time, concentrated in crypto, politics, and economics categories. The number increases during high-news periods when market makers reprice slowly across platforms.',
  },
  {
    q: 'What is the minimum spread worth trading?',
    a: 'For manual trading, a spread of 5–7%+ is typically required to justify the effort and execution risk. For automated bots with fast execution, 3–4% spreads on liquid markets can be worth pursuing — but model slippage conservatively.',
  },
  {
    q: 'Can I automate Polymarket vs Kalshi arbitrage?',
    a: "Yes. Musashi's /api/markets/arbitrage endpoint returns cross-platform spreads in real time. Pair it with the Polymarket CLOB API and Kalshi API to execute both legs automatically. The main risk is leg execution timing — ensure both legs fill within seconds of each other.",
  },
  {
    q: 'Why do price discrepancies form between Polymarket and Kalshi?',
    a: 'Both platforms have separate liquidity pools, market makers, and order books. News or sentiment can cause one platform to update prices before the other does, creating a temporary window. Regulatory restrictions also prevent some users from trading on one platform but not the other, limiting arbitrage pressure.',
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Polymarket vs Kalshi Arbitrage: How to Detect and Trade Price Discrepancies',
    description: 'Guide to detecting and trading arbitrage between Polymarket and Kalshi prediction markets using the Musashi API.',
    url: 'https://musashi.bot/blog/polymarket-vs-kalshi-arbitrage',
    datePublished: '2026-04-29',
    image: 'https://musashi.bot/images/generated-1771830449125.png',
    author: { '@type': 'Organization', name: 'MUSASHI', url: 'https://musashi.bot' },
    publisher: { '@type': 'Organization', name: 'MUSASHI', url: 'https://musashi.bot' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Polymarket–Kalshi Arbitrage Spreads',
    description: 'Real-time cross-platform price discrepancies between Polymarket and Kalshi prediction markets, detected by Musashi.',
    url: 'https://musashi-api.vercel.app/api/markets/arbitrage',
    provider: { '@type': 'Organization', name: 'MUSASHI', url: 'https://musashi.bot' },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://musashi-api.vercel.app/api/markets/arbitrage',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://musashi.bot' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://musashi.bot/blog/polymarket-vs-kalshi-arbitrage' },
    ],
  },
]

export default function PolymarketVsKalshiArbitrage() {
  return (
    <ContentPage
      h1="Polymarket vs Kalshi Arbitrage: How to Detect and Trade Price Discrepancies"
      answer="Arbitrage between Polymarket and Kalshi occurs when the same event trades at different prices on each platform. Buy YES on the cheaper platform, sell YES on the more expensive one, and lock in the spread. Musashi's arbitrage API detects these opportunities automatically."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">What Is Prediction Market Arbitrage?</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Prediction markets like Polymarket and Kalshi let you buy and sell shares in the outcome of future events. Each share resolves to $1 if the event occurs, $0 if it doesn&apos;t. When both platforms price the same event differently, you can trade both sides simultaneously for a near-guaranteed profit.
        </p>
        <div className="border border-[#00FF88]/30 bg-[#00FF88]/5 p-5">
          <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.8]">
            <strong className="text-[#00FF88]">Example:</strong> &quot;Will the Fed cut rates in June?&quot; trades at 63% YES on Polymarket and 70% YES on Kalshi.
            Buy 100 YES shares at $0.63 on Polymarket. Sell 100 YES shares (short) at $0.70 on Kalshi.
            You collect $70 from the short sale and spend $63 on the long, locking in a <strong className="text-[#00FF88]">$7 gross spread</strong> up front.
            If YES resolves, the long pays $100 and the short owes $100.
            If NO resolves, both legs expire worthless.
            Gross spread: <strong className="text-[#00FF88]">7%</strong> regardless of outcome.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">How Price Discrepancies Form</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Polymarket and Kalshi have separate liquidity pools. When new information appears — a tweet, a news article, a data release — one platform typically reprices faster than the other. This creates a window, often lasting seconds to minutes, where both platforms have diverged on the same event.
        </p>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8]">
          Regulatory differences also play a role. US-only restrictions prevent some arbitrageurs from trading on Polymarket (which does not serve US users), reducing the pressure that would otherwise close spreads quickly.
        </p>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Live Arbitrage Data from Musashi</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Musashi&apos;s <code className="text-white">/api/markets/arbitrage</code> endpoint polls both platforms every 15–20 seconds and surfaces cross-platform spreads. Each entry includes:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: 'spread_pct', desc: 'Gross spread in percentage points' },
            { label: 'polymarket_price', desc: 'Current YES price on Polymarket' },
            { label: 'kalshi_price', desc: 'Current YES price on Kalshi' },
            { label: 'direction', desc: 'Which platform has the lower price to buy' },
            { label: 'liquidity', desc: 'Available order book depth at posted price' },
            { label: 'category', desc: 'Market category for filtering' },
          ].map(({ label, desc }) => (
            <div key={label} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-3">
              <code className="font-jetbrains text-[#00FF88] text-[12px]">{label}</code>
              <p className="font-jetbrains text-[var(--text-tertiary)] text-[11px] mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/arb" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ View live arbitrage pages by market</Link>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Automating Arbitrage Detection</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-5 font-jetbrains text-[13px] text-white rounded-sm overflow-x-auto">
          <div className="text-[#6E7D93] text-[11px] mb-3 uppercase tracking-[0.14em]">JavaScript</div>
          <pre>{`const res = await fetch(
  'https://musashi-api.vercel.app/api/markets/arbitrage?minSpread=0.05'
)
const { data } = await res.json()
const { opportunities } = data

for (const arb of opportunities) {
  console.log(\`
    Market: \${arb.polymarketMarket.title}
    Spread: \${(arb.spread * 100).toFixed(1)}%
    Direction: \${arb.direction}
    Buy Polymarket YES at: \${arb.polymarketMarket.yesPrice}
    Sell Kalshi YES at: \${arb.kalshiMarket.yesPrice}
  \`)
  // Execute both legs via Polymarket + Kalshi APIs
}`}</pre>
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Risk and Slippage Considerations</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
          Arbitrage in prediction markets is not risk-free in practice. Key risks:
        </p>
        <ul className="flex flex-col gap-3">
          {[
            { r: 'Leg execution risk', d: 'The spread may close before both legs fill. Execute the larger leg first (worse liquidity) to reduce exposure.' },
            { r: 'Liquidity limits', d: 'Many spreads are only available at small sizes. The posted price may not fill at scale.' },
            { r: 'Withdrawal delays', d: 'Kalshi withdrawals can take 1–3 business days. Capital is locked during resolution.' },
            { r: 'Market resolution risk', d: 'Very rare, but markets can resolve differently than expected (e.g., a disputed outcome).' },
          ].map(({ r, d }) => (
            <li key={r} className="border-l-2 border-[var(--border-primary)] pl-4">
              <h3 className="font-jetbrains text-[var(--text-primary)] text-[13px] font-bold mb-1">{r}</h3>
              <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
        <h2 className="font-grotesk text-[var(--text-primary)] text-[20px] font-bold mb-3">Start Detecting Arbitrage</h2>
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] mb-4">
          The Musashi arbitrage endpoint is free and requires no authentication. Browse live spread data by market below.
        </p>
        <div className="flex flex-col gap-2">
          <Link href="/arb" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ Live arbitrage market pages</Link>
          <Link href="/docs/trading-bot-quickstart" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ Build an arbitrage bot (quickstart)</Link>
          <Link href="/docs/polymarket-api" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ Full API reference</Link>
        </div>
      </section>
    </ContentPage>
  )
}
