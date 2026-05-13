import Link from 'next/link';
import PromptCard from '../components/PromptCard';
import { BOT_ORDER, BOTS } from './prompts';

export const metadata = {
  title: 'Build a prediction-market bot in one prompt — Musashi',
  description:
    'Paste one prompt into Claude Code, Codex, or Cursor and ship an arbitrage scanner, tweet-signal trader, or market-mover tracker powered by the Musashi API.',
};

const TOOLS = [
  {
    name: 'Claude Code',
    href: 'https://www.anthropic.com/claude-code',
    note: 'Terminal-native, agentic. Best for end-to-end scaffolding.',
  },
  {
    name: 'Codex',
    href: 'https://developers.openai.com/codex',
    note: 'OpenAI Codex CLI. Plan + execute in a single session.',
  },
  {
    name: 'Cursor',
    href: 'https://cursor.com',
    note: 'IDE-first. Use Composer (⌘L) to apply the prompt across files.',
  },
];

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/analyze-text',
    body: '{ "text": "...", "minConfidence": 0.4, "maxResults": 3 }',
    returns: 'matching markets, sentiment, suggested YES/NO action with edge',
  },
  {
    method: 'GET',
    path: '/api/markets/arbitrage',
    body: '?minSpread=0.05&minConfidence=0.5&limit=20',
    returns: 'cross-platform Poly ↔ Kalshi opportunities with direction',
  },
  {
    method: 'GET',
    path: '/api/markets/movers',
    body: '?minChange=0.05&limit=20',
    returns: '1h / 24h price movers with previous → current price',
  },
  {
    method: 'GET',
    path: '/api/health',
    body: '',
    returns: 'service status + per-source availability',
  },
];

export default function BuildPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--bg-primary)]">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between gap-8 border-b border-[#FFFFFF14] bg-[var(--bg-primary)]/95 px-4 py-4 backdrop-blur sm:px-6 md:px-10 lg:px-[80px]">
        <Link
          href="/"
          className="font-jetbrains text-[20px] font-bold tracking-[1px] text-[var(--text-primary)] md:text-[22px]"
        >
          MUSASHI
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/mission" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            MISSION
          </Link>
          <Link href="/build" className="font-jetbrains text-xs font-medium text-white">
            BUILD
          </Link>
          <Link href="/quickstart" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            MCP
          </Link>
          <Link href="/ai" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            API
          </Link>
          <Link href="/pricing" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            PRICING
          </Link>
        </nav>
        <Link
          href="/install"
          className="border border-[#FFFFFF40] bg-transparent px-4 py-[10px] transition-colors hover:bg-[var(--overlay-light)] sm:px-5"
        >
          <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">Install</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <section className="border border-[#FFFFFF14] bg-[linear-gradient(180deg,#090D14_0%,#05080D_100%)] p-6 sm:p-10">
          <span className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.2em] text-[#00FF88]">Build</span>
          <h1 className="mt-3 font-grotesk text-[40px] font-bold leading-[1.05] tracking-[-1.2px] text-white sm:text-[52px] lg:text-[64px]">
            Don&apos;t write the bot.
            <br />
            Prompt for it.
          </h1>
          <p className="mt-5 max-w-[720px] font-jetbrains text-[14px] leading-[1.8] text-[#A8B0BC] sm:text-[15px]">
            Paste one of the prompts below into Claude Code, Codex, or Cursor. Your editor scaffolds
            a working bot wired into the Musashi API — arbitrage, tweet signals, or market movers —
            in minutes. Signal-only by default; bring your own Slack or Discord webhook.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              Free beta
            </span>
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              No key required today
            </span>
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-1.5 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              Polymarket + Kalshi
            </span>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-grotesk text-[24px] font-semibold tracking-[-0.4px] text-white sm:text-[28px]">
              1. Pick your tool
            </h2>
            <span className="font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#7E899B]">3 options</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {TOOLS.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 border border-[#FFFFFF14] bg-[#0B0F16] p-5 transition-colors hover:bg-[#101725]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[22px] font-semibold text-white">{t.name}</span>
                  <span className="font-jetbrains text-[14px] text-[#7E899B] transition-colors group-hover:text-white">↗</span>
                </div>
                <p className="font-jetbrains text-[12px] leading-[1.7] text-[#9CA8B8]">{t.note}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-grotesk text-[24px] font-semibold tracking-[-0.4px] text-white sm:text-[28px]">
              2. Pick your bot
            </h2>
            <span className="font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#7E899B]">3 prompts</span>
          </div>
          <div className="flex flex-col gap-6">
            {BOT_ORDER.map((id) => (
              <PromptCard key={id} bot={BOTS[id]} variant="full" />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-grotesk text-[24px] font-semibold tracking-[-0.4px] text-white sm:text-[28px]">
              3. API cheat sheet
            </h2>
            <Link href="/ai" className="font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#A7F3D0] hover:text-white">
              Full docs →
            </Link>
          </div>
          <div className="border border-[#FFFFFF14] bg-[#0B0F16]">
            <div className="border-b border-[#FFFFFF12] p-4 sm:p-5">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Base URL</div>
              <code className="mt-1 block font-jetbrains text-[13px] text-white">https://musashi-api.vercel.app</code>
            </div>
            <ul className="divide-y divide-[#FFFFFF10]">
              {ENDPOINTS.map((e) => (
                <li key={e.path} className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-[80px_1fr] sm:gap-4 sm:p-5">
                  <div className="flex items-start gap-2">
                    <span
                      className={`border px-2 py-0.5 font-jetbrains text-[10px] font-bold ${
                        e.method === 'POST'
                          ? 'border-[#00FF88]/40 bg-[#00FF88]/10 text-[#A7F3D0]'
                          : 'border-[#FFFFFF20] bg-[#FFFFFF06] text-white'
                      }`}
                    >
                      {e.method}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <code className="font-jetbrains text-[13px] text-white">
                      {e.path}
                      {e.body && e.method === 'GET' ? <span className="text-[#7E899B]">{e.body}</span> : null}
                    </code>
                    {e.body && e.method !== 'GET' ? (
                      <code className="font-jetbrains text-[11px] text-[#9CA8B8]">{e.body}</code>
                    ) : null}
                    <span className="font-jetbrains text-[11px] leading-[1.6] text-[#9CA8B8]">{e.returns}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
          <h2 className="font-grotesk text-[24px] font-semibold tracking-[-0.4px] text-white sm:text-[28px]">
            4. Next steps
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Want a live agent?</div>
              <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#C4CCD8]">
                Use Musashi&apos;s MCP server instead of polling. One server entry, Claude or ChatGPT
                queries markets directly.
              </p>
              <Link href="/quickstart" className="mt-3 inline-flex font-jetbrains text-[11px] font-bold uppercase tracking-[0.12em] text-[#A7F3D0] hover:text-white">
                MCP quickstart →
              </Link>
            </div>
            <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Need an API key?</div>
              <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#C4CCD8]">
                Free beta is keyless. When auth lands, your bot only needs an Authorization header
                added — the rest of the prompt stays the same.
              </p>
              <Link href="/ai" className="mt-3 inline-flex font-jetbrains text-[11px] font-bold uppercase tracking-[0.12em] text-[#A7F3D0] hover:text-white">
                API docs →
              </Link>
            </div>
            <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Share what you built</div>
              <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#C4CCD8]">
                Post your bot in the open. Tag @musashimarket so we can boost it.
              </p>
              <a
                href="https://twitter.com/musashimarket"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-jetbrains text-[11px] font-bold uppercase tracking-[0.12em] text-[#A7F3D0] hover:text-white"
              >
                Twitter →
              </a>
            </div>
            <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Read the source</div>
              <p className="mt-2 font-jetbrains text-[12px] leading-[1.7] text-[#C4CCD8]">
                All of Musashi is open on GitHub: API, MCP, extension, infra.
              </p>
              <a
                href="https://github.com/MusashiBot"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-jetbrains text-[11px] font-bold uppercase tracking-[0.12em] text-[#A7F3D0] hover:text-white"
              >
                MusashiBot →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex w-full flex-col gap-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-10 sm:px-6 lg:px-[120px]">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <span className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">MUSASHI</span>
          <span className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">
            Built for agents. Powered by prediction markets.
          </span>
        </div>
      </footer>
    </div>
  );
}
