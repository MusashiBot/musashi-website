import type { Metadata } from 'next'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'
import { createPageMetadata } from '../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Pricing',
  description:
    'Musashi is free during beta. No rate limits, no API keys required. Full access to the prediction market feed API, trading signals, arbitrage detection, and Agent SDK.',
  path: '/pricing',
  ogTitle: 'Pricing | MUSASHI',
  ogDescription:
    'Free prediction market API. Cross-platform market intelligence, trading signals, and arbitrage detection. No rate limits.',
})

export default function Pricing() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--bg-primary)]">
      <Header />

      {/* Pricing Content */}
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-[80px] lg:py-[120px]">
        <div className="flex flex-col items-center gap-12 w-full max-w-[800px]">

          {/* Free Badge */}
          <div className="flex items-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full">
            <svg className="w-5 h-5 fill-[#00FF88]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span className="font-jetbrains text-[var(--text-primary)] text-base font-medium">
              Musashi is currently free
            </span>
          </div>

          {/* Future Plans Message */}
          <p className="font-jetbrains text-[var(--text-secondary)] text-[17px] font-normal leading-[1.8] text-center">
            In the future, we may introduce paid features or plans. If we do, we&apos;ll clearly<br />
            describe the terms and pricing before you&apos;re charged.
          </p>

          {/* Install Button */}
          <a href="/install" className="px-12 py-5 bg-[var(--text-primary)] hover:opacity-90 transition-opacity rounded-full">
            <span className="font-jetbrains text-[var(--bg-primary)] text-sm font-bold">Install Musashi</span>
          </a>

          {/* Additional Info */}
          <div className="flex flex-col items-center gap-4 pt-8 border-t border-[var(--border-lightest)] w-full">
            <span className="font-jetbrains text-[var(--text-tertiary)] text-xs font-medium">
              Chrome Extension • No account needed • Works instantly
            </span>
            <span className="font-jetbrains text-[var(--text-tertiary)] text-[11px] font-normal text-center">
              Cross-platform market coverage • Live arbitrage pages • Price updates every 15-20 seconds
            </span>
          </div>

        </div>
      </main>

      <SiteFooter
        variant="extended"
        description="Chrome extension that shows prediction markets on Twitter. API for agents."
      />
    </div>
  );
}
