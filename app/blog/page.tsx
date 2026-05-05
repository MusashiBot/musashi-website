import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../components/ContentPage'
import RelatedLinks from '../components/RelatedLinks'
import { createBreadcrumbSchema, createFaqSchema, createPageMetadata } from '../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Prediction Market Trading Blog',
  description:
    'Musashi blog guides covering Polymarket automation, Kalshi arbitrage, and practical workflows for prediction market traders and builders.',
  path: '/blog',
  ogTitle: 'Musashi Blog | Prediction Market Trading Guides',
  ogDescription:
    'Read Musashi guides on prediction market automation, arbitrage, and trading workflows.',
})

const faqs: FaqEntry[] = [
  {
    q: 'What kind of topics does the blog cover?',
    a: 'The blog focuses on practical workflows for prediction market traders and developers: automation, arbitrage, execution risk, and how to turn raw market data into usable trading systems.',
  },
  {
    q: 'Are these posts technical or strategic?',
    a: 'They are both. Each guide answers the query directly, then explains either the implementation path or the market mechanics you need to understand before shipping a bot or placing trades.',
  },
  {
    q: 'Where should I go after reading a guide?',
    a: 'Use the docs section for implementation detail and the compare section when you are evaluating data sources or tool choices.',
  },
]

const schemas = [
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]),
]

const posts = [
  {
    href: '/blog/how-to-automate-polymarket-trading',
    label: 'How to Automate Polymarket Trading',
    desc: 'A practical signal-to-execution guide for turning Musashi data into a 24/7 bot.',
  },
  {
    href: '/blog/polymarket-vs-kalshi-arbitrage',
    label: 'Polymarket vs Kalshi Arbitrage',
    desc: 'How cross-platform spreads form, what risks matter, and how to automate detection.',
  },
]

export default function BlogIndexPage() {
  return (
    <ContentPage
      h1="Prediction Market Trading Blog"
      answer="The Musashi blog focuses on answer-first guides for prediction market traders and builders. Each post explains a real implementation or trading problem, then points you toward the right docs or live data pages to go deeper."
      faqs={faqs}
      schemas={schemas}
    >
      <section>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[24px] font-bold mb-4">Featured Guides</h2>
        <div className="grid grid-cols-1 gap-4">
          {posts.map(({ href, label, desc }) => (
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

      <RelatedLinks
        title="Next Stops"
        links={[
          { href: '/docs', label: 'Developer docs hub' },
          { href: '/compare', label: 'API comparisons' },
          { href: '/arb', label: 'Live arbitrage pages' },
        ]}
      />
    </ContentPage>
  )
}
