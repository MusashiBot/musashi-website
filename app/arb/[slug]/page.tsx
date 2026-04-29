import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import JsonLd from '../../components/JsonLd'
import markets from '../../../data/markets.json'

export const revalidate = 3600

type Market = {
  slug: string
  title: string
  category: string
  polymarket_price: number
  kalshi_price: number
  spread: number
  liquidity: number
  last_updated: string
}

const allMarkets = markets as Market[]

export async function generateStaticParams() {
  return allMarkets.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const market = allMarkets.find(m => m.slug === slug)
  if (!market) return {}

  const buyOn = market.polymarket_price < market.kalshi_price ? 'Polymarket' : 'Kalshi'
  const sellOn = buyOn === 'Polymarket' ? 'Kalshi' : 'Polymarket'

  return {
    title: `Arbitrage: ${market.title}`,
    description: `Live ${market.spread.toFixed(1)}% arbitrage spread for "${market.title}". Buy YES on ${buyOn} at ${(Math.min(market.polymarket_price, market.kalshi_price) * 100).toFixed(0)}¢, sell YES on ${sellOn} at ${(Math.max(market.polymarket_price, market.kalshi_price) * 100).toFixed(0)}¢. Live data via Musashi.`,
    openGraph: {
      title: `${market.spread.toFixed(1)}% Arb Spread — ${market.title}`,
      description: `Cross-platform arbitrage opportunity between Polymarket and Kalshi. Spread: ${market.spread.toFixed(1)}%. Liquidity: $${(market.liquidity / 1000).toFixed(0)}K.`,
      url: `https://musashi.bot/arb/${slug}`,
    },
  }
}

function formatPrice(price: number) {
  return `${(price * 100).toFixed(0)}¢`
}

function formatLiquidity(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export default async function ArbPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const market = allMarkets.find(m => m.slug === slug)
  if (!market) notFound()

  const buyOn = market.polymarket_price < market.kalshi_price ? 'Polymarket' : 'Kalshi'
  const sellOn = buyOn === 'Polymarket' ? 'Kalshi' : 'Polymarket'
  const buyPrice = Math.min(market.polymarket_price, market.kalshi_price)
  const sellPrice = Math.max(market.polymarket_price, market.kalshi_price)

  const faqs = [
    {
      q: `What is the current arbitrage spread for "${market.title}"?`,
      a: `The current gross spread is ${market.spread.toFixed(1)} percentage points: ${buyOn} prices YES at ${formatPrice(buyPrice)} and ${sellOn} prices YES at ${formatPrice(sellPrice)}. This data updates hourly via Musashi.`,
    },
    {
      q: 'How do I trade this arbitrage?',
      a: `Buy YES on ${buyOn} at ${formatPrice(buyPrice)} per share. Simultaneously sell YES on ${sellOn} at ${formatPrice(sellPrice)}. Your locked-in gross spread is ${market.spread.toFixed(1)}¢ per share because you collect the higher sale price and pay the lower entry price up front. If YES resolves, the long pays $1 and the short owes $1; if NO resolves, both legs expire worthless, and in either case you keep the initial spread before fees and slippage.`,
    },
    {
      q: 'Is this arbitrage risk-free?',
      a: 'Near risk-free in theory, but execution risk exists. Both legs must fill before the spread closes. Slippage, position limits, and the time required to withdraw funds between platforms reduce the realized profit. Model your net spread after fees and slippage before committing.',
    },
    {
      q: 'How often does this spread update?',
      a: 'Musashi polls Polymarket and Kalshi every 15-20 seconds and this page revalidates every hour. For real-time spread data, use the Musashi arbitrage API: GET /api/markets/arbitrage.',
    },
  ]

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: `Polymarket vs Kalshi Arbitrage: ${market.title}`,
      description: `Current arbitrage spread data for "${market.title}" between Polymarket and Kalshi prediction markets.`,
      url: `https://musashi.bot/arb/${market.slug}`,
      provider: { '@type': 'Organization', name: 'MUSASHI', url: 'https://musashi.bot' },
      temporalCoverage: market.last_updated,
      variableMeasured: [
        { '@type': 'PropertyValue', name: 'Polymarket YES price', value: market.polymarket_price },
        { '@type': 'PropertyValue', name: 'Kalshi YES price', value: market.kalshi_price },
        { '@type': 'PropertyValue', name: 'Spread (%)', value: market.spread },
      ],
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
        { '@type': 'ListItem', position: 2, name: 'Arbitrage Markets', item: 'https://musashi.bot/arb' },
        { '@type': 'ListItem', position: 3, name: market.title, item: `https://musashi.bot/arb/${market.slug}` },
      ],
    },
  ]

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <header className="flex items-center justify-between w-full px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] lg:px-[80px]">
        <a href="/" className="font-jetbrains text-[var(--text-primary)] text-[22px] font-bold tracking-[1px]">MUSASHI</a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/arb" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">All Markets</a>
          <a href="/blog/polymarket-vs-kalshi-arbitrage" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">Arb Guide</a>
          <a href="/ai" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">API</a>
        </nav>
        <a href="/install" className="px-5 py-[10px] border border-[#FFFFFF40] hover:bg-[var(--overlay-light)] transition-colors">
          <span className="font-jetbrains text-[var(--text-primary)] text-xs font-bold">Install</span>
        </a>
      </header>

      <main className="flex flex-col items-center w-full px-6 py-12 lg:px-[120px] lg:py-[60px]">
        <div className="w-full max-w-[860px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-jetbrains text-[11px] text-[var(--text-tertiary)] mb-6">
            <a href="/" className="hover:text-[var(--text-primary)] transition-colors">Home</a>
            <span>/</span>
            <a href="/arb" className="hover:text-[var(--text-primary)] transition-colors">Arbitrage Markets</a>
            <span>/</span>
            <span className="text-[var(--text-secondary)]">{market.category}</span>
          </nav>

          <h1 className="font-grotesk text-[var(--text-primary)] text-[30px] font-bold tracking-[-0.5px] leading-[1.2] mb-3 lg:text-[40px]">
            {market.title}
          </h1>

          <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.75] mb-2 border-l-2 border-[#00FF88] pl-4">
            Polymarket vs Kalshi spread: <strong className="text-[#00FF88]">{market.spread.toFixed(1)}%</strong>. Buy YES on {buyOn} at {formatPrice(buyPrice)}, sell YES on {sellOn} at {formatPrice(sellPrice)}. Data via Musashi — last updated hourly.
          </p>
          <p className="font-jetbrains text-[var(--text-tertiary)] text-[11px] mb-10">
            Last updated: {new Date(market.last_updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })} UTC
          </p>

          {/* Spread Cards */}
          <section className="mb-12">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[22px] font-bold mb-4">Current Spread Data</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-5">
                <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-2">Gross Spread</span>
                <span className="block font-grotesk text-[28px] font-bold text-[#00FF88]">{market.spread.toFixed(1)}%</span>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-5">
                <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-2">Polymarket YES</span>
                <span className="block font-grotesk text-[28px] font-bold text-white">{formatPrice(market.polymarket_price)}</span>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-5">
                <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-2">Kalshi YES</span>
                <span className="block font-grotesk text-[28px] font-bold text-white">{formatPrice(market.kalshi_price)}</span>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-5">
                <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-2">Liquidity</span>
                <span className="block font-grotesk text-[28px] font-bold text-white">{formatLiquidity(market.liquidity)}</span>
              </div>
            </div>
          </section>

          {/* Arbitrage Mechanics */}
          <section className="mb-12">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[22px] font-bold mb-4">How This Arbitrage Works</h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.8] mb-4">
              Both Polymarket and Kalshi are pricing the same event but at different probabilities. This {market.spread.toFixed(1)}% gap lets you trade both sides simultaneously:
            </p>
            <div className="border border-[#00FF88]/20 bg-[#00FF88]/5 p-5 font-jetbrains text-[13px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF88] font-bold w-5 flex-shrink-0">1.</span>
                  <span className="text-[var(--text-secondary)]">Buy YES on {buyOn} at <strong className="text-white">{formatPrice(buyPrice)}</strong> per share</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-[#00FF88] font-bold w-5 flex-shrink-0">2.</span>
                  <span className="text-[var(--text-secondary)]">Sell YES on {sellOn} at <strong className="text-white">{formatPrice(sellPrice)}</strong> per share</span>
                </div>
                <div className="flex items-start gap-3 border-t border-[#00FF88]/20 pt-3 mt-1">
                  <span className="text-[#00FF88] font-bold w-5 flex-shrink-0">→</span>
                  <span className="text-[var(--text-secondary)]">Gross profit either way: <strong className="text-[#00FF88]">{market.spread.toFixed(1)}¢ per share</strong></span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12 pt-10 border-t border-[var(--border-primary)]">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[22px] font-bold mb-6">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-5">
              {faqs.map(({ q, a }) => (
                <div key={q} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
                  <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">{q}</h3>
                  <p className="font-jetbrains text-[var(--text-secondary)] text-[12px] leading-[1.75]">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[18px] font-bold mb-3">Detect More Arbitrage</h2>
            <div className="flex flex-col gap-2">
              <a href="/arb" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ All arbitrage markets</a>
              <a href="/blog/polymarket-vs-kalshi-arbitrage" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ Polymarket vs Kalshi arbitrage guide</a>
              <a href="/docs/trading-bot-quickstart" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ Build an arbitrage trading bot</a>
              <a href="/ai" className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80">→ API reference (/api/markets/arbitrage)</a>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex w-full flex-col gap-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-10 lg:px-[120px]">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">MUSASHI</a>
          <nav className="flex gap-6">
            <a href="/arb" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Markets</a>
            <a href="/ai" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">API</a>
            <a href="/pricing" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
          </nav>
        </div>
        <span className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} Musashi — Prediction market intelligence for trading bots.
        </span>
      </footer>
    </div>
  )
}
