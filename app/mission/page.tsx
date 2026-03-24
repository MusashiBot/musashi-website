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

          {/* Section 1: The Shift */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              The Shift
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              The era of humans staring at screens, clicking buttons, and manually executing trades is ending. We're entering the age of autonomous agents—AI systems that monitor, analyze, and act on information faster and more reliably than any human could.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              Traditional trading interfaces are built for human eyes: colorful charts, animated dashboards, notification bells. But agents don't need any of that. They need structured data, confidence scores, and machine-readable signals delivered through APIs at millisecond latency.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8]">
              The future isn't better UIs. It's better APIs. The future is CLI, not GUI.
            </p>
          </section>

          {/* Section 2: Why Musashi Exists */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              Why Musashi Exists
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              Prediction markets are some of the highest-signal data sources in the world. When real money is at stake, prices reveal what people actually believe—not what they say they believe. But trading these markets manually is exhausting: monitoring Twitter for breaking news, checking prices across multiple platforms, calculating arbitrage opportunities, and executing trades before the edge disappears.
            </p>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              Musashi automates the entire intelligence layer:
            </p>
            <ul className="font-jetbrains text-[var(--text-secondary)] text-[15px] space-y-3 pl-6 list-disc mb-4">
              <li>Monitors 71 high-signal Twitter accounts 24/7 (politicians, journalists, CEOs, market movers)</li>
              <li>Analyzes every tweet in real-time using NLP and sentiment analysis</li>
              <li>Matches tweets to 900+ prediction markets across Polymarket and Kalshi</li>
              <li>Detects cross-platform arbitrage opportunities (same event, different prices)</li>
              <li>Tracks price movements and generates trading signals with confidence scores</li>
              <li>Delivers everything through a REST API that agents can poll every 15-20 seconds</li>
            </ul>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8]">
              The Chrome extension? That's just for humans to monitor what the agents see. The real product is the API. Musashi is built for agents, not humans.
            </p>
          </section>

          {/* Section 3: Agent-First Philosophy */}
          <section className="mb-12">
            <h2 className="font-jetbrains text-[var(--text-primary)] text-[28px] font-bold uppercase tracking-[2px] mb-5">
              Agent-First Philosophy
            </h2>
            <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-4">
              Building for agents means different design principles:
            </p>

            <div className="space-y-6">
              <div className="bg-[var(--bg-secondary)] border-l-4 border-[#00FF88] p-5">
                <h3 className="font-jetbrains text-[var(--text-primary)] text-[16px] font-bold mb-2">
                  1. Structured Data Over Pretty Interfaces
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7]">
                  Agents don't need gradients, animations, or rounded corners. They need JSON responses with confidence scores, urgency levels, and reasoning. Every API response includes the raw data an agent needs to make a decision: sentiment (bullish/bearish/neutral), suggested action (YES/NO/HOLD), confidence percentage, and expected edge.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] border-l-4 border-[#00FF88] p-5">
                <h3 className="font-jetbrains text-[var(--text-primary)] text-[16px] font-bold mb-2">
                  2. Speed Over Aesthetics
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7]">
                  Markets update every 15-20 seconds. Arbitrage opportunities disappear in seconds. We optimize for latency, not visual polish. Agents poll our API every 20-30 seconds and get fresh data instantly—no page loads, no JavaScript rendering, just raw JSON.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] border-l-4 border-[#00FF88] p-5">
                <h3 className="font-jetbrains text-[var(--text-primary)] text-[16px] font-bold mb-2">
                  3. Terminal > Browser
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7]">
                  The best interface for an AI trading bot isn't a web dashboard—it's a terminal. Run <code className="bg-[var(--bg-primary)] px-2 py-1 text-[#00FF88]">npm run agent</code> and get a live CLI showing arbitrage opportunities, market movers, and tweet analysis as they happen. No mouse, no clicks, just keyboard-driven automation.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] border-l-4 border-[#00FF88] p-5">
                <h3 className="font-jetbrains text-[var(--text-primary)] text-[16px] font-bold mb-2">
                  4. SDK Over UI
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7]">
                  We ship a TypeScript/JavaScript SDK with polling methods like <code className="bg-[var(--bg-primary)] px-2 py-1 text-[#00FF88]">agent.onArbitrage()</code> and <code className="bg-[var(--bg-primary)] px-2 py-1 text-[#00FF88]">agent.onFeed()</code>. Agents import a library, write 10 lines of code, and start trading autonomously. No UI to build, no webhooks to configure—just clean, composable functions.
                </p>
              </div>

              <div className="bg-[var(--bg-secondary)] border-l-4 border-[#00FF88] p-5">
                <h3 className="font-jetbrains text-[var(--text-primary)] text-[16px] font-bold mb-2">
                  5. Free and Open
                </h3>
                <p className="font-jetbrains text-[var(--text-secondary)] text-[14px] leading-[1.7]">
                  No paywalls, no API keys (yet), no rate limits during beta. The entire codebase is open source. We believe the best way to accelerate the agent era is to give developers unrestricted access to high-quality infrastructure. If agents succeed, we all win.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: The Vision */}
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
