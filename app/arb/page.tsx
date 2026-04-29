import type { Metadata } from 'next'
import JsonLd from '../components/JsonLd'
import markets from '../../data/markets.json'

export const metadata: Metadata = {
  title: 'Prediction Market Arbitrage — Live Polymarket vs Kalshi Spreads',
  description: 'Live arbitrage opportunities between Polymarket and Kalshi. Browse 100+ prediction markets with cross-platform price discrepancies. Data updated hourly via the Musashi API.',
  openGraph: {
    title: 'Live Prediction Market Arbitrage | MUSASHI',
    description: 'Browse Polymarket vs Kalshi arbitrage spreads in real time. 100+ markets across crypto, politics, finance, and more.',
    url: 'https://musashi.bot/arb',
  },
}

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

const allMarkets = (markets as Market[]).sort((a, b) => b.spread - a.spread)

const categories = Array.from(new Set(allMarkets.map(m => m.category))).sort()

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://musashi.bot' },
    { '@type': 'ListItem', position: 2, name: 'Arbitrage Markets', item: 'https://musashi.bot/arb' },
  ],
}

function formatPrice(price: number) {
  return `${(price * 100).toFixed(0)}¢`
}

function formatLiquidity(amount: number) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export default function ArbIndex() {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      <JsonLd data={breadcrumbSchema} />

      <header className="flex items-center justify-between w-full px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] lg:px-[80px]">
        <a href="/" className="font-jetbrains text-[var(--text-primary)] text-[22px] font-bold tracking-[1px]">MUSASHI</a>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/blog/polymarket-vs-kalshi-arbitrage" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">Arb Guide</a>
          <a href="/docs/trading-bot-quickstart" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">Build a Bot</a>
          <a href="/ai" className="font-jetbrains text-[var(--text-secondary)] text-xs hover:text-[var(--text-primary)] transition-colors">API</a>
        </nav>
        <a href="/install" className="px-5 py-[10px] border border-[#FFFFFF40] hover:bg-[var(--overlay-light)] transition-colors">
          <span className="font-jetbrains text-[var(--text-primary)] text-xs font-bold">Install</span>
        </a>
      </header>

      <main className="flex flex-col items-center w-full px-6 py-12 lg:px-[120px] lg:py-[60px]">
        <div className="w-full max-w-[1100px]">
          <div className="mb-10">
            <h1 className="font-grotesk text-[var(--text-primary)] text-[36px] font-bold tracking-[-1px] mb-4 lg:text-[52px]">
              Live Prediction Market Arbitrage
            </h1>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.75] max-w-[640px] border-l-2 border-[#00FF88] pl-4">
              Cross-platform price discrepancies between Polymarket and Kalshi, updated hourly by Musashi. Click any market to see spread mechanics, live prices, and how to trade the arbitrage.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
            <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-4">
              <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-1">Markets Tracked</span>
              <span className="block font-grotesk text-[24px] font-bold text-white">{allMarkets.length}</span>
            </div>
            <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-4">
              <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-1">Max Spread</span>
              <span className="block font-grotesk text-[24px] font-bold text-[#00FF88]">{allMarkets[0].spread.toFixed(1)}%</span>
            </div>
            <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-4">
              <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-1">Avg Spread</span>
              <span className="block font-grotesk text-[24px] font-bold text-white">{(allMarkets.reduce((s, m) => s + m.spread, 0) / allMarkets.length).toFixed(1)}%</span>
            </div>
            <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-4">
              <span className="block font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[var(--text-tertiary)] mb-1">Categories</span>
              <span className="block font-grotesk text-[24px] font-bold text-white">{categories.length}</span>
            </div>
          </div>

          {/* Market Table */}
          <section>
            <h2 className="font-grotesk text-[var(--text-primary)] text-[22px] font-bold mb-4">
              Markets by Spread (High to Low)
            </h2>
            <div className="flex flex-col gap-2">
              {allMarkets.map(market => {
                const buyOn = market.polymarket_price < market.kalshi_price ? 'Poly' : 'Kalshi'
                return (
                  <a
                    key={market.slug}
                    href={`/arb/${market.slug}`}
                    className="flex items-center justify-between border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-5 py-4 hover:bg-[var(--overlay-light)] transition-colors group"
                  >
                    <div className="flex flex-col gap-1 min-w-0 flex-1 mr-4">
                      <span className="font-grotesk text-[var(--text-primary)] text-[14px] font-medium leading-tight group-hover:text-white transition-colors truncate">
                        {market.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-jetbrains text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)] border border-[var(--border-primary)] px-2 py-0.5">
                          {market.category}
                        </span>
                        <span className="font-jetbrains text-[10px] text-[var(--text-tertiary)]">
                          Buy {buyOn} · {formatLiquidity(market.liquidity)} liquidity
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden sm:flex items-center gap-3 font-jetbrains text-[12px]">
                        <span className="text-[var(--text-tertiary)]">PM: {formatPrice(market.polymarket_price)}</span>
                        <span className="text-[var(--text-tertiary)]">KS: {formatPrice(market.kalshi_price)}</span>
                      </div>
                      <div className="border border-[#00FF88]/40 bg-[#00FF88]/10 px-3 py-1">
                        <span className="font-jetbrains text-[#00FF88] text-[13px] font-bold">{market.spread.toFixed(1)}%</span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>

          {/* Context links */}
          <section className="mt-16 border-t border-[var(--border-primary)] pt-10">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[20px] font-bold mb-4">Learn More About Prediction Market Arbitrage</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a href="/blog/polymarket-vs-kalshi-arbitrage" className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 hover:bg-[var(--overlay-light)] transition-colors">
                <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">Polymarket vs Kalshi Arbitrage Guide</h3>
                <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">How spreads form, how to trade them, and what risks to model before deploying capital.</p>
              </a>
              <a href="/docs/trading-bot-quickstart" className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 hover:bg-[var(--overlay-light)] transition-colors">
                <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">Build an Arbitrage Trading Bot</h3>
                <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">Step-by-step guide to automating arbitrage detection and execution with the Musashi API.</p>
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="flex w-full flex-col gap-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-10 lg:px-[120px]">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">MUSASHI</a>
          <nav className="flex gap-6">
            <a href="/ai" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">API</a>
            <a href="/pricing" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="/privacy" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Privacy</a>
          </nav>
        </div>
        <span className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} Musashi — Prediction market intelligence for trading bots.
        </span>
      </footer>
    </div>
  )
}
