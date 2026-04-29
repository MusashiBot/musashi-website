'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPrice, formatLiquidity } from '../utils/formatMarket'

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

interface ArbFilterProps {
  markets: Market[]
  categories: string[]
}

function pillClass(isActive: boolean) {
  const base = 'px-3 py-1.5 font-jetbrains text-[11px] uppercase tracking-[0.1em] border transition-colors'
  const active = 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
  const inactive = 'text-[var(--text-tertiary)] border-[var(--border-primary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-secondary)]'
  return `${base} ${isActive ? active : inactive}`
}

export default function ArbFilter({ markets, categories }: ArbFilterProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = markets
    if (activeCategory) result = result.filter(m => m.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(m => m.title.toLowerCase().includes(q))
    }
    return result
  }, [markets, query, activeCategory])

  const hasFilters = query.trim() !== '' || activeCategory !== null

  const clearFilters = () => { setQuery(''); setActiveCategory(null) }

  return (
    <section>
      {/* Search + category controls */}
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="search"
          placeholder="Search markets..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-4 py-3 font-jetbrains text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
        />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory(null)} className={pillClass(activeCategory === null)}>
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={pillClass(activeCategory === cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-grotesk text-[var(--text-primary)] text-[22px] font-bold">
          {hasFilters
            ? `${filtered.length} market${filtered.length !== 1 ? 's' : ''} found`
            : 'Markets by Spread (High to Low)'}
        </h2>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="font-jetbrains text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Market list */}
      {filtered.length === 0 ? (
        <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-12 text-center">
          <p className="font-jetbrains text-[var(--text-tertiary)] text-[13px]">No markets match your filters.</p>
          <button onClick={clearFilters} className="mt-3 font-jetbrains text-[12px] text-[#00FF88] hover:opacity-80">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(market => {
            const buyOn = market.polymarket_price < market.kalshi_price ? 'Poly' : 'Kalshi'
            return (
              <Link
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
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
