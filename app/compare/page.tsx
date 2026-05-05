import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../components/ContentPage'
import RelatedLinks from '../components/RelatedLinks'
import { createBreadcrumbSchema, createFaqSchema, createPageMetadata } from '../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Prediction Market API Comparisons',
  description:
    'Compare prediction market APIs, tooling, and data sources. Start with Musashi vs native Polymarket and Kalshi APIs for trading bots.',
  path: '/compare',
  ogTitle: 'Musashi Compare | Prediction Market API Evaluations',
  ogDescription:
    'Evaluate prediction market APIs and decide which data stack fits your trading bot.',
})

const faqs: FaqEntry[] = [
  {
    q: 'Who are these comparisons for?',
    a: 'They are written for developers and traders who are choosing between raw exchange APIs and higher-level intelligence layers. The goal is to make the tradeoffs obvious before you build the wrong integration.',
  },
  {
    q: 'Do the comparisons focus on execution APIs or data quality?',
    a: 'Both, but the emphasis is on what your bot actually needs: market coverage, authentication, update frequency, and whether you have to build your own signal layer.',
  },
  {
    q: 'Where should I go after a comparison?',
    a: 'Use the docs if you decide to build with Musashi, or the blog if you want the strategy context behind a use case like automation or arbitrage.',
  },
]

const schemas = [
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Compare', path: '/compare' },
  ]),
]

export default function CompareIndexPage() {
  return (
    <ContentPage
      h1="Prediction Market API Comparisons"
      answer="Musashi comparisons are built for decision-stage queries. They focus on the tradeoffs that matter when you are choosing a prediction market data stack: market coverage, signal quality, authentication friction, and whether you need to maintain multiple integrations yourself."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Current Comparison</h2>
        <Link
          href="/compare/best-prediction-market-api"
          className="block border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 transition-colors hover:bg-[var(--overlay-light)]"
        >
          <h3 className="font-grotesk text-[var(--text-primary)] text-[18px] font-semibold mb-2">
            Best Prediction Market API for Trading Bots
          </h3>
          <p className="font-jetbrains text-[var(--text-tertiary)] text-[13px] leading-[1.75]">
            Musashi vs the native Polymarket and Kalshi APIs, with a feature table built around bot-builder needs.
          </p>
        </Link>
      </section>

      <RelatedLinks
        title="Build From Here"
        links={[
          { href: '/docs', label: 'Open the docs hub' },
          { href: '/docs/trading-bot-quickstart', label: 'Start the quickstart' },
          { href: '/blog/how-to-automate-polymarket-trading', label: 'Read the automation guide' },
        ]}
      />
    </ContentPage>
  )
}
