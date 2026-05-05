import type { Metadata } from 'next'
import Link from 'next/link'
import JsonLd from '../components/JsonLd'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import ArbFilter from '../components/ArbFilter'
import { createBreadcrumbSchema, createPageMetadata } from '../lib/seo'
import markets from '../../data/markets.json'

export const metadata: Metadata = createPageMetadata({
  title: 'Prediction Market Arbitrage — Live Polymarket vs Kalshi Spreads',
  description:
    'Live arbitrage opportunities between Polymarket and Kalshi. Browse 100+ prediction markets with cross-platform price discrepancies. Data updated hourly via the Musashi API.',
  path: '/arb',
  ogTitle: 'Live Prediction Market Arbitrage | MUSASHI',
  ogDescription:
    'Browse Polymarket vs Kalshi arbitrage spreads in real time. 100+ markets across crypto, politics, finance, and more.',
})

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

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', path: '/' },
  { name: 'Arbitrage Markets', path: '/arb' },
])

export default function ArbIndex() {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      <JsonLd data={breadcrumbSchema} />

      <Header />

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

          <ArbFilter markets={allMarkets} categories={categories} />

          {/* Context links */}
          <section className="mt-16 border-t border-[var(--border-primary)] pt-10">
            <h2 className="font-grotesk text-[var(--text-primary)] text-[20px] font-bold mb-4">Learn More About Prediction Market Arbitrage</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link href="/blog/polymarket-vs-kalshi-arbitrage" className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 hover:bg-[var(--overlay-light)] transition-colors">
                <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">Polymarket vs Kalshi Arbitrage Guide</h3>
                <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">How spreads form, how to trade them, and what risks to model before deploying capital.</p>
              </Link>
              <Link href="/docs/trading-bot-quickstart" className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 hover:bg-[var(--overlay-light)] transition-colors">
                <h3 className="font-grotesk text-[var(--text-primary)] text-[15px] font-semibold mb-2">Build an Arbitrage Trading Bot</h3>
                <p className="font-jetbrains text-[var(--text-tertiary)] text-[12px] leading-[1.7]">Step-by-step guide to automating arbitrage detection and execution with the Musashi API.</p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter
        compactLinks={[
          { label: 'Markets', href: '/arb' },
          { label: 'API', href: '/ai' },
          { label: 'Pricing', href: '/pricing' },
        ]}
        tagline="Prediction market intelligence for trading bots."
      />
    </div>
  )
}
