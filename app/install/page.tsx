import type { Metadata } from 'next'
import Header from '../components/Header'
import SiteFooter from '../components/SiteFooter'

export const metadata: Metadata = {
  title: 'Install',
  description: 'Get started with Musashi in minutes. Clone the repo, install dependencies, and run npm run agent. Free prediction market trading bot intelligence API.',
  openGraph: {
    title: 'Install MUSASHI',
    description: 'Get started with Musashi in minutes. Free prediction market API for AI trading bots.',
    url: 'https://musashi.bot/install',
  },
}

export default function Install() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--bg-primary)]">
      <Header />

      {/* Install Content */}
      <main className="flex flex-col items-center justify-center flex-1 w-full px-[80px] py-[120px]">
        <div className="flex flex-col items-center gap-12 w-full max-w-[800px]">

          {/* Chrome Badge */}
          <div className="flex items-center gap-3 px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-full">
            <svg className="w-5 h-5 fill-[var(--text-primary)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-jetbrains text-[var(--text-primary)] text-base font-medium">
              Chrome Extension • Free • No Account Required
            </span>
          </div>

          {/* Main Heading */}
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-grotesk text-[var(--text-primary)] text-[56px] font-bold tracking-[-2px] text-center leading-[1.1]">
              Install Musashi
            </h1>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[17px] font-normal leading-[1.8] text-center">
              Add prediction market intelligence to your Twitter feed.<br />
              One click. Zero setup. Works instantly.
            </p>
          </div>

          {/* Install Button */}
          <a
            href="https://chromewebstore.google.com/detail/musashi-beta/kbiajcnhcfoobejabhidbohnaanmejia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-12 py-5 bg-[var(--text-primary)] hover:opacity-90 transition-opacity rounded-full"
          >
            <span className="font-jetbrains text-[var(--bg-primary)] text-sm font-bold">ADD TO CHROME — FREE</span>
          </a>

          {/* How It Works */}
          <div className="flex flex-col gap-6 pt-12 w-full">
            <h3 className="font-grotesk text-[var(--text-primary)] text-2xl font-semibold text-center">
              How It Works
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg">
                <span className="font-grotesk text-[var(--text-primary)] text-xl font-bold">1</span>
                <div className="flex flex-col gap-1">
                  <span className="font-jetbrains text-[var(--text-primary)] text-sm font-semibold">Click &quot;Add to Chrome&quot;</span>
                  <span className="font-jetbrains text-[var(--text-secondary)] text-xs font-normal leading-[1.6]">
                    Install takes 3 seconds. No account, no email, no signup.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg">
                <span className="font-grotesk text-[var(--text-primary)] text-xl font-bold">2</span>
                <div className="flex flex-col gap-1">
                  <span className="font-jetbrains text-[var(--text-primary)] text-sm font-semibold">Browse Twitter Normally</span>
                  <span className="font-jetbrains text-[var(--text-secondary)] text-xs font-normal leading-[1.6]">
                    Musashi works silently in the background. Zero configuration needed.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg">
                <span className="font-grotesk text-[var(--text-primary)] text-xl font-bold">3</span>
                <div className="flex flex-col gap-1">
                  <span className="font-jetbrains text-[var(--text-primary)] text-sm font-semibold">See Market Intelligence Inline</span>
                  <span className="font-jetbrains text-[var(--text-secondary)] text-xs font-normal leading-[1.6]">
                    When tweets mention events with prediction markets, live odds appear right in your feed.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="flex flex-col items-center gap-4 pt-8 border-t border-[var(--border-lightest)] w-full">
            <span className="font-jetbrains text-[var(--text-tertiary)] text-xs font-medium">
              Chrome 90+ • Edge • Brave • Opera
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
