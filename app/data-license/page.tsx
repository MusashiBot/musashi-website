import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import JsonLd from '../components/JsonLd'
import { createPageMetadata } from '../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Data License',
  description:
    'Data license governing use of MUSASHI dataset pages, arbitrage summaries, spread calculations, API responses, and other analytical outputs at musashi.bot.',
  path: '/data-license',
  ogTitle: 'Data License | MUSASHI',
})

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'MUSASHI Data License',
  url: 'https://musashi.bot/data-license',
  creator: {
    '@type': 'Organization',
    name: 'MUSASHI',
    url: 'https://musashi.bot',
  },
  license: 'https://musashi.bot/data-license',
}

function LegalSection({
  num,
  title,
  children,
}: {
  num: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
        {num}. {title}
      </h2>
      {children}
    </section>
  )
}

export default function DataLicense() {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      <JsonLd data={pageSchema} />
      <Header />

      <main className="flex flex-col items-center w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-[80px] lg:py-[60px]">
        <div className="w-full max-w-[900px]">

          {/* Title */}
          <div className="border-l-4 border-[var(--text-primary)] pl-4 mb-8">
            <h1 className="font-jetbrains text-[var(--text-primary)] text-[48px] font-bold tracking-[-1px]">
              Data License
            </h1>
          </div>

          <p className="font-jetbrains text-[var(--text-tertiary)] text-sm mb-10">
            Effective Date: May 5, 2026
          </p>

          {/* Summary */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--text-primary)] border-l-4 p-6 mb-12">
            <h3 className="font-jetbrains text-[var(--text-primary)] text-lg font-bold mb-4">
              Summary
            </h3>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>
                MUSASHI makes selected market intelligence, arbitrage data, and analytical outputs
                available for reference, research, and internal use.
              </li>
              <li>
                This material is provided under a limited, revocable, non-exclusive license — not
                as open data or open source.
              </li>
              <li>
                Third-party platform data (including Polymarket, Kalshi, and X/Twitter) remains
                subject to those platforms&apos; own terms.
              </li>
              <li>
                Bulk republication, resale, and competing commercial data products require
                MUSASHI&apos;s prior written authorization.
              </li>
              <li>
                This page is not legal advice. Contact{' '}
                <a
                  href="mailto:support@musashi.bot"
                  className="text-[var(--text-primary)] underline"
                >
                  support@musashi.bot
                </a>{' '}
                for licensing or permissions inquiries.
              </li>
            </ul>
          </div>

          {/* 1. Scope */}
          <LegalSection num={1} title="Scope">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              This Data License governs dataset pages, structured data markup, API responses,
              downloadable files, tables, rankings, spread calculations, summaries, and other
              analytical outputs made available by MUSASHI at{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">musashi.bot</code> or any
              MUSASHI-operated endpoint that links to this page.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              This license covers only the rights that MUSASHI has authority to grant. It does not
              expand, transfer, or alter any rights in third-party source materials.
            </p>
          </LegalSection>

          {/* 2. License Grant */}
          <LegalSection num={2} title="License Grant">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              Subject to the terms of this Data License, MUSASHI grants you a limited,
              non-exclusive, non-transferable, revocable license to access, view, use, and retain
              covered material for internal, research, evaluation, and reference purposes only.
            </p>
          </LegalSection>

          {/* 3. Permitted Uses */}
          <LegalSection num={3} title="Permitted Uses">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              You may, subject to the terms of this Data License:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>access and view MUSASHI data pages and related materials;</li>
              <li>
                use covered material internally for research, evaluation, modeling, monitoring, and
                decision support;
              </li>
              <li>
                retain limited local copies for internal archival, caching, debugging, and testing
                purposes;
              </li>
              <li>
                cite or reference MUSASHI data in commentary, analysis, academic work, or
                non-commercial informational materials; and
              </li>
              <li>
                link to canonical MUSASHI pages when discussing a specific dataset or market.
              </li>
            </ul>
          </LegalSection>

          {/* 4. Prohibited Uses */}
          <LegalSection num={4} title="Prohibited Uses">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
              Unless MUSASHI expressly authorizes it in writing, you may not:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-sm space-y-2 pl-5 list-disc">
              <li>redistribute, sublicense, sell, or commercially resell covered material;</li>
              <li>
                republish covered material in bulk through another website, API, database, feed, or
                product;
              </li>
              <li>
                create a competing commercial dataset, feed, index, or API substantially derived
                from MUSASHI material;
              </li>
              <li>remove or obscure source attribution, notices, or identifying references;</li>
              <li>
                use covered material to train, fine-tune, or otherwise improve a model intended for
                public or commercial distribution; or
              </li>
              <li>
                represent that you own or control third-party source data incorporated into MUSASHI
                outputs.
              </li>
            </ul>
          </LegalSection>

          {/* 5. Attribution */}
          <LegalSection num={5} title="Attribution">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              Where public reference to MUSASHI material is otherwise permitted under this license,
              you must include clear attribution to MUSASHI and, where feasible, a link to the
              relevant canonical page on{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">musashi.bot</code>.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm mb-3">
              Attribution example:
            </p>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-4">
              <code className="font-jetbrains text-[var(--text-primary)] text-sm">
                Source: MUSASHI (https://musashi.bot)
              </code>
            </div>
          </LegalSection>

          {/* 6. Third-Party Rights and Exclusions */}
          <LegalSection num={6} title="Third-Party Rights and Exclusions">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              Certain MUSASHI outputs may incorporate, summarize, transform, or depend on
              information originating from third-party platforms, exchanges, publishers, APIs, or
              public web sources, including Polymarket, Kalshi, and X/Twitter.
            </p>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] border-l-4 border-l-[var(--text-primary)] p-6 mb-4">
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
                Third-party platform data, API outputs, content, trademarks, service marks, and
                other third-party materials remain subject to their respective owners&apos; terms,
                policies, and rights. MUSASHI makes no representation that it holds rights
                sufficient to grant you any license over such materials.
              </p>
            </div>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              This Data License does not grant rights in third-party source materials except to the
              extent MUSASHI has independent authority to grant such rights. Where a page, endpoint,
              or output contains both MUSASHI-created material and third-party material, only the
              MUSASHI-created portions are covered by this Data License, and only to the extent
              MUSASHI has authority to license them.
            </p>
          </LegalSection>

          {/* 7. No Warranty */}
          <LegalSection num={7} title="No Warranty">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              Covered material is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo;
              without warranty of any kind. MUSASHI makes no representations or warranties, express
              or implied, as to accuracy, completeness, timeliness, availability, merchantability,
              fitness for a particular purpose, non-infringement, or uninterrupted operation.
            </p>
          </LegalSection>

          {/* 8. No Financial, Legal, or Investment Advice */}
          <LegalSection num={8} title="No Financial, Legal, or Investment Advice">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              MUSASHI data, rankings, signals, spread calculations, and analytical outputs are
              provided for informational purposes only. Nothing on{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">musashi.bot</code>{' '}
              constitutes financial advice, investment advice, legal advice, tax advice, accounting
              advice, or an offer or solicitation to buy or sell any instrument, position, or
              strategy. You bear sole responsibility for any decisions made in reliance on this
              material.
            </p>
          </LegalSection>

          {/* 9. Reservation of Rights */}
          <LegalSection num={9} title="Reservation of Rights">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              All rights not expressly granted under this Data License are reserved by MUSASHI.
            </p>
          </LegalSection>

          {/* 10. Termination */}
          <LegalSection num={10} title="Termination">
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              MUSASHI may suspend, restrict, or revoke this license at any time if you breach these
              terms, or if MUSASHI reasonably determines that continued access or use creates legal,
              contractual, technical, security, abuse, or platform-compliance risk.
            </p>
          </LegalSection>

          {/* 11. Contact */}
          <LegalSection num={11} title="Contact">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] border-l-4 border-l-[var(--text-primary)] p-6">
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-3">
                For permissions requests, commercial licensing inquiries, redistribution requests,
                partnership discussions, or other questions about this Data License, contact:
              </p>
              <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
                <strong className="text-[var(--text-primary)]">Email:</strong>{' '}
                <a
                  href="mailto:support@musashi.bot"
                  className="text-[var(--text-primary)] underline"
                >
                  support@musashi.bot
                </a>
              </p>
            </div>
          </LegalSection>

          {/* Structured Data Values */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              Structured Data Values
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8] mb-4">
              The following values may be used to attribute MUSASHI as the creator and to reference
              this license in structured data and metadata.
            </p>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] p-6 mb-4 overflow-x-auto">
              <pre className="font-jetbrains text-[var(--text-primary)] text-sm">{`{
  "creator": {
    "@type": "Organization",
    "name": "MUSASHI",
    "url": "https://musashi.bot"
  },
  "license": "https://musashi.bot/data-license"
}`}</pre>
            </div>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm leading-[1.8]">
              These values correspond to schema.org{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">Dataset</code>{' '}
              properties. Publishers incorporating MUSASHI data should include both the{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">creator</code> and{' '}
              <code className="font-jetbrains text-[var(--text-primary)]">license</code> fields in
              any associated structured data markup.
            </p>
          </section>

        </div>
      </main>

      <SiteFooter variant="extended" />
    </div>
  )
}
