import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mission',
  description: 'Musashi is building the API infrastructure for the autonomous trading era — the intelligence layer that AI agents need to monitor prediction markets and execute trades 24/7.',
  openGraph: {
    title: 'Mission | MUSASHI',
    description: 'Building infrastructure for autonomous AI trading agents. The era of CLI and agent-first products is here.',
    url: 'https://musashi.bot/mission',
  },
}

export default function Mission() {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between w-full px-[80px] py-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] gap-10">
        <a href="/" className="font-jetbrains text-[var(--text-primary)] text-[22px] font-bold tracking-[1px]">
          MUSASHI
        </a>
        <nav className="flex items-center gap-8">
          <a href="/mission" className="font-jetbrains text-[var(--text-primary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">MISSION</a>
          <a href="/ai" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">API</a>
          <a href="/pricing" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">PRICING</a>
          <a href="/privacy" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">PRIVACY</a>
        </nav>
        <a href="/install" className="px-5 py-[10px] border border-[#FFFFFF40] bg-transparent hover:bg-[var(--overlay-light)] transition-colors">
          <span className="font-jetbrains text-[var(--text-primary)] text-xs font-bold">Install</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center w-full px-[80px] py-[60px]">
        <div className="w-full max-w-[900px]">
          {/* Title */}
          <div className="border-l-4 border-[var(--text-primary)] pl-4 mb-8">
            <h1 className="font-jetbrains text-[var(--text-primary)] text-[48px] font-bold tracking-[-1px]">
              Mission
            </h1>
          </div>

          <p className="font-jetbrains text-[var(--text-tertiary)] text-sm mb-10">
            Building for the autonomous era
          </p>

          {/* Quote Box */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--text-primary)] border-l-4 p-6 mb-12">
            <blockquote className="font-jetbrains text-[var(--text-primary)] text-lg font-medium italic mb-4">
              "it's 2026, Build. For. Agents"
            </blockquote>
            <p className="font-jetbrains text-[var(--text-secondary)] text-sm">
              — Andrej Karpathy
            </p>
          </div>

          {/* The Vision */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              The Vision
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              In 5 years, most prediction market trades will be executed by agents, not humans. Agents will monitor millions of data sources simultaneously, detect patterns humans can't see, and execute trades in milliseconds. They'll run 24/7, never sleep, never panic sell, and never miss an opportunity because they were in a meeting.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              Musashi is building the infrastructure for that future. We're not trying to make a prettier TradingView or a better Robinhood. We're building the API layer that the next generation of autonomous trading systems will run on.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8]">
              The era of CLI is here. The era of agents is here. And Musashi is ready.
            </p>
          </section>

          {/* CTA Box */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--text-primary)] p-8 text-center">
            <h3 className="font-jetbrains text-[var(--text-primary)] text-[20px] font-bold mb-4">
              Start Building
            </h3>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7] mb-6">
              The API is live. The SDK is ready. Build the future of autonomous trading.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://github.com/MusashiBot/Musashi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] font-jetbrains text-xs font-bold hover:opacity-80 transition-opacity"
              >
                View on GitHub
              </a>
              <a
                href="https://musashi-api.vercel.app/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[var(--text-primary)] text-[var(--text-primary)] font-jetbrains text-xs font-bold hover:bg-[var(--overlay-light)] transition-colors"
              >
                API Docs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
