import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../components/ContentPage'
import RelatedLinks from '../components/RelatedLinks'
import { createBreadcrumbSchema, createFaqSchema, createPageMetadata } from '../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Prediction Market API Docs and Trading Bot Guides',
  description:
    'Documentation hub for Musashi. Start with the trading bot quickstart, review the Polymarket API reference, or open the interactive docs console.',
  path: '/docs',
  ogTitle: 'Musashi Docs | Prediction Market API Guides',
  ogDescription:
    'Browse Musashi quickstarts, API references, and developer guides for prediction market bots.',
})

const faqs: FaqEntry[] = [
  {
    q: 'What should I read first?',
    a: 'Start with the trading bot quickstart if you want a working integration path. It explains how to poll the feed, interpret signals, and connect execution on Polymarket or Kalshi.',
  },
  {
    q: 'Where is the endpoint reference?',
    a: 'The Polymarket API reference page documents the feed, markets, arbitrage, and movers endpoints. The interactive docs console at /ai exposes the raw source files behind those docs.',
  },
  {
    q: 'Do I need an API key?',
    a: 'No. The read endpoints are currently public during beta and do not require API keys. Trading execution still requires credentials with the execution venue you use.',
  },
]

const schemas = [
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
  ]),
]

const docLinks = [
  {
    href: '/docs/trading-bot-quickstart',
    label: 'Trading Bot Quickstart',
    desc: 'Build a working prediction market bot with Musashi, Polymarket, and Kalshi.',
  },
  {
    href: '/docs/polymarket-api',
    label: 'Polymarket API Reference',
    desc: 'Endpoint-by-endpoint documentation for the feed, markets, arbitrage, and movers APIs.',
  },
  {
    href: '/ai',
    label: 'Interactive Docs Console',
    desc: 'Browse the raw markdown, schema, OpenAPI, and code examples that power the docs.',
  },
]

export default function DocsIndexPage() {
  return (
    <ContentPage
      h1="Prediction Market API Docs and Trading Bot Guides"
      answer="Musashi documentation covers three jobs: getting a bot live, understanding the REST endpoints, and inspecting the raw source docs behind the API. Start with the quickstart, then move into the reference pages as your integration gets more specific."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Start Here</h2>
        <div className="grid grid-cols-1 gap-4">
          {docLinks.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5 transition-colors hover:bg-[var(--overlay-light)]"
            >
              <h3 className="font-grotesk text-[var(--text-primary)] text-[18px] font-semibold mb-2">
                {label}
              </h3>
              <p className="font-jetbrains text-[var(--text-tertiary)] text-[13px] leading-[1.75]">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Recommended Flow</h2>
        <ol className="flex flex-col gap-4">
          {[
            'Read the trading bot quickstart to understand the signal-to-execution workflow.',
            'Use the Polymarket API reference to map the endpoint shapes and query parameters your bot needs.',
            'Open the interactive docs console when you want the underlying markdown, schema, or example payloads.',
          ].map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex-shrink-0 font-jetbrains text-[#00FF88] font-bold text-[13px] w-5 mt-0.5">
                {index + 1}.
              </span>
              <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.75]">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <RelatedLinks
        title="Keep Exploring"
        links={[
          { href: '/compare/best-prediction-market-api', label: 'Compare prediction market APIs' },
          { href: '/blog/how-to-automate-polymarket-trading', label: 'Read the automation guide' },
          { href: '/arb', label: 'Browse live arbitrage pages' },
        ]}
      />
    </ContentPage>
  )
}
