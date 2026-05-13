import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'
import CopyableCodeBlock from '../../components/CopyableCodeBlock'
import MasterPromptCard from '../../components/MasterPromptCard'
import RelatedLinks from '../../components/RelatedLinks'
import {
  createBreadcrumbSchema,
  createFaqSchema,
  createPageMetadata,
  createPublisherSchema,
} from '../../lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Trading Bot Quickstart',
  description:
    'Paste one prompt into Claude Code, Codex, or Cursor and ship a real-money prediction-market trading bot. Polymarket and Kalshi execution wired to Musashi signals with built-in risk limits, kill switch, and dry-run mode.',
  path: '/docs/trading-bot-quickstart',
  ogTitle: 'Trading Bot Quickstart | MUSASHI',
  ogDescription:
    'One prompt, one Musashi-powered trading bot. Real-money Polymarket and Kalshi execution with built-in risk limits.',
  type: 'article',
})

const MUSASHI_PROMPT = `Build me a production trading bot for prediction markets that places real-money trades on Polymarket and Kalshi using Musashi as the signal source.

# Overview
A long-running TypeScript/Node service that:
- Polls Musashi for arbitrage opportunities, market movers, and tweet signals
- Sizes positions based on edge and configurable risk limits
- Places real-money limit orders on Polymarket (CLOB) and Kalshi (REST)
- Enforces a daily-loss kill switch, per-market position cap, and minimum edge
- Logs every fill and every risk event to Slack or Discord

# Musashi API (signal source)
Base URL: https://musashi-api.vercel.app
No auth required during free beta.

Endpoints:
- GET /api/markets/arbitrage?minSpread={MIN_SPREAD}&minConfidence=0.5&limit=20
  Cross-platform Poly↔Kalshi opportunities.
  Fields: data.opportunities[].{polymarket,kalshi,spread,direction,confidence}, data.metadata.data_age_seconds.
  Poll every 30s.

- GET /api/markets/movers?minChange={MIN_CHANGE}&limit=20
  1h / 24h price movers.
  Fields: data.movers[].{market,priceChange1h,previousPrice,currentPrice,direction}.
  Poll every 60s+.

- POST /api/analyze-text { "text": string, "minConfidence": 0.4 }
  Tweet/news analysis.
  Fields: data.suggested_action.{direction,edge,reasoning}, data.urgency, data.sentiment, data.markets[].{market,confidence}.
  Called from the /tweet webhook.

- GET /api/health — surface via /healthz on the bot.

# Brokers
Polymarket — @polymarket/clob-client.
  - Auth: POLYMARKET_PRIVATE_KEY (Polygon wallet), USDC on Polygon for collateral.
  - Orders: post-only limit at signal price, IOC fallback at marketable price after 10s.
  - SDK: \`npm install @polymarket/clob-client\`.

Kalshi — REST API.
  - Auth: KALSHI_API_KEY + KALSHI_API_SECRET (RSA-PSS signed requests).
  - Base URL: https://trading-api.kalshi.com/trade-api/v2.
  - Write a thin typed wrapper around fetch.

# Architecture
src/
  index.ts          # boot: load env, start strategies + webhook + risk manager, SIGTERM cleanup
  config.ts         # zod env: keys, risk limits, thresholds; refuse to boot if unsafe
  musashi.ts        # typed Musashi client
  brokers/
    polymarket.ts   # CLOB wrapper: balance(), placeOrder(), cancelOrder(), positions()
    kalshi.ts       # REST wrapper: same surface
  risk.ts           # position sizing, per-market cap, daily-loss kill switch, persistent state
  executor.ts       # takeSignal(signal) → broker.placeOrder() iff risk allows
  dedupe.ts         # TTL Map for signal dedupe (1h)
  alert.ts          # Slack mrkdwn + Discord embed formatters; one send() entry
  server.ts         # Express: POST /tweet (x-inbound-token auth), GET /healthz, GET /pnl
  strategies/
    arbitrage.ts    # poll Musashi arbitrage → executor.takeArbitrage(opportunity)
    movers.ts       # poll Musashi movers → executor.takeMomentum(mover)
    tweet.ts        # /tweet → analyzeText → executor.takeSignal(signal)

# Risk model (non-negotiable defaults)
- MAX_POSITION_USD per market (default $50)
- MAX_DAILY_LOSS_USD across all positions (default $100). Hit → kill switch fires, no new orders for the rest of the day. Existing positions are held.
- MIN_EDGE = 0.05 (signal must show ≥5% edge to enter)
- One-position-per-market rule (no scaling in on the same market)
- DRY_RUN=1 logs intended orders without submitting them (rehearsal). Default is live.
- Idempotency: every order has a deterministic client ID derived from (strategy, market, timestamp-bucket). Never double-submit.
- Persist daily P&L + kill-switch state in a small SQLite or LowDB file so a restart preserves the limit.

# .env.example
MUSASHI_BASE_URL=https://musashi-api.vercel.app

# Polymarket
POLYMARKET_PRIVATE_KEY=
POLYMARKET_FUNDER_ADDRESS=
POLYMARKET_CHAIN_ID=137

# Kalshi
KALSHI_API_KEY=
KALSHI_API_SECRET=

# Notifications
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=

# Risk (start small)
MAX_POSITION_USD=50
MAX_DAILY_LOSS_USD=100
MIN_EDGE=0.05

# Safety
DRY_RUN=

# Bot
INBOUND_TOKEN=change-me
PORT=8080
LOG_LEVEL=info

# Alert formats (Slack mrkdwn — translate cleanly to Discord embeds)
FILLED
> *FILLED* — {platform} {market} {side} {size}@{price}
> Signal: {strategy} | Edge: {edge%} | Position: {totalPosUSD}
> Daily P&L: {dailyPnl}

KILL SWITCH
> *KILL SWITCH* — daily loss limit hit ({dailyPnl})
> No new orders for the rest of the day. Existing positions held.

DRY RUN
> *DRY RUN* — would have placed {platform} {market} {side} {size}@{price}

# Constraints
- TypeScript 5, ESM ("type": "module"), Node 20+, native fetch.
- Refuse to boot if (POLYMARKET_PRIVATE_KEY missing AND KALSHI_API_KEY missing) AND DRY_RUN is not set.
- Before each order: re-fetch position, re-check risk limits, re-check kill switch.
- Graceful SIGTERM: cancel open limit orders, persist state, exit 0.
- Single-process. No tests required for v1.

# Deliverables
1. package.json, tsconfig.json, .env.example, .gitignore, README.md
2. All src/ files above
3. Dockerfile (multi-stage, node:20-slim) for Fly.io / Railway / Render
4. README sections: prerequisites, fund-your-wallet, dry-run rehearsal, going live, risk model, kill-switch behavior, recovery

When everything is written, print:
- Install command
- DRY_RUN rehearsal command
- Live trading command
- Sample curl that posts a tweet to /tweet`

const faqs: FaqEntry[] = [
  {
    q: 'Does the bot really trade with real money?',
    a: 'Yes. The default scaffold places real-money limit orders on Polymarket (via CLOB) and Kalshi (via REST) whenever a Musashi signal exceeds your MIN_EDGE. Risk limits are enforced before every order — MAX_POSITION_USD per market and MAX_DAILY_LOSS_USD across the bot. When daily loss hits the limit, a kill switch activates and no new orders are submitted. Set DRY_RUN=1 for a rehearsal that logs intended orders without sending them.',
  },
  {
    q: 'How do I limit my risk?',
    a: 'Three knobs in .env: MAX_POSITION_USD caps each individual position, MAX_DAILY_LOSS_USD activates a kill switch once hit, and MIN_EDGE rejects signals below your edge threshold. Start small ($25–$50 per position, $100 daily cap), run with DRY_RUN=1 for a session or two, then drop the flag to go live.',
  },
  {
    q: 'Why a prompt instead of a tutorial?',
    a: 'Hand-written tutorials go stale. A well-scoped prompt re-runs on every model upgrade and produces a bot tailored to your stack, package versions, and deployment target. Treat the prompt as the source of truth — let your editor regenerate the implementation when SDKs update.',
  },
  {
    q: 'Which editor should I use?',
    a: 'Claude Code is recommended for end-to-end scaffolding from a single prompt. Codex CLI works well if you prefer a plan-then-execute flow. Cursor is the best fit if you want to apply the prompt inside an existing repo via Composer (⌘L).',
  },
  {
    q: 'How do I deploy the bot?',
    a: 'The prompt asks for a Dockerfile, so `fly launch` on Fly.io, `railway up`, or `render deploy` all work. Set your wallet keys, risk limits, and Slack/Discord webhook in the provider dashboard. The bot persists daily P&L state to a volume so restarts preserve the kill switch.',
  },
  {
    q: 'What if the Musashi API is rate-limited?',
    a: 'The bot exponentially backs off on HTTP 429 (5s → 15s → 45s) and continues. Each Musashi response also includes data_age_seconds — the bot skips alerts and trades when the data is stale (>60s), to avoid acting on a cached snapshot.',
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Build a Prediction Market Trading Bot with Musashi',
    description:
      'Paste one prompt into Claude Code, Codex, or Cursor and scaffold a real-money prediction-market trading bot using the Musashi API.',
    url: 'https://musashi.bot/docs/trading-bot-quickstart',
    datePublished: '2026-04-29',
    dateModified: '2026-05-13',
    image: 'https://musashi.bot/images/generated-1771830449125.png',
    author: createPublisherSchema(),
    publisher: createPublisherSchema(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Build a Prediction Market Trading Bot with Musashi',
    description:
      'Use a single prompt to scaffold a real-money prediction-market trading bot that places orders on Polymarket and Kalshi using Musashi signals.',
    step: [
      { '@type': 'HowToStep', name: 'Open your coding agent', text: 'In an empty folder, launch Claude Code, Codex, or Cursor.' },
      { '@type': 'HowToStep', name: 'Paste the master prompt', text: 'Paste the copied prompt into the editor and approve the file scaffold.' },
      { '@type': 'HowToStep', name: 'Add your keys and risk limits', text: 'Fill .env with Polymarket private key, Kalshi API keys, MAX_POSITION_USD, MAX_DAILY_LOSS_USD, and MIN_EDGE.' },
      { '@type': 'HowToStep', name: 'Rehearse, then go live', text: 'Run with DRY_RUN=1 first to verify behavior, then drop the flag to send real orders.' },
      { '@type': 'HowToStep', name: 'Deploy', text: 'Build the included Dockerfile and deploy to Fly.io, Railway, or Render with a persistent volume for daily P&L state.' },
    ],
  },
  createFaqSchema(faqs),
  createBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Docs', path: '/docs' },
    { name: 'Trading Bot Quickstart', path: '/docs/trading-bot-quickstart' },
  ]),
]

const editors = [
  { name: 'Claude Code', href: 'https://www.anthropic.com/claude-code' },
  { name: 'Codex', href: 'https://developers.openai.com/codex' },
  { name: 'Cursor', href: 'https://cursor.com' },
]

const nextStepLinks = [
  { href: '/docs/polymarket-api', label: 'Polymarket API Reference' },
  { href: '/ai', label: 'Full interactive API docs' },
  { href: '/compare/best-prediction-market-api', label: 'Compare prediction market APIs' },
  { href: '/blog/polymarket-vs-kalshi-arbitrage', label: 'Polymarket vs Kalshi arbitrage guide' },
]

type Step = {
  title: string
  body: ReactNode
  code?: string
  extras?: ReactNode
  optional?: boolean
}

const steps: Step[] = [
  {
    title: 'Open your coding agent',
    body: 'In an empty folder, launch Claude Code, Codex, or Cursor. The prompt works the same way in all three.',
    extras: (
      <div className="flex flex-wrap gap-2">
        {editors.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 border border-[var(--border-primary)] px-3 py-1.5 font-jetbrains text-[12px] text-[var(--text-secondary)] transition-colors hover:border-[#00FF88]/40 hover:text-[var(--text-primary)]"
          >
            {name}
            <span className="text-[var(--text-muted)] transition-colors group-hover:text-[#00FF88]">↗</span>
          </a>
        ))}
      </div>
    ),
    code: `mkdir my-musashi-bot && cd my-musashi-bot
claude`,
  },
  {
    title: 'Paste the master prompt',
    body: 'Use the Copy prompt button above, then paste into your editor’s chat. Approve the file scaffold the agent proposes — package.json, src/, brokers/, risk.ts, Dockerfile, README.',
  },
  {
    title: 'Add your keys and risk limits',
    body: 'Fill in your Polymarket wallet, Kalshi API keys, and the risk knobs. Start small — you can raise the caps after a few clean rehearsals.',
    code: `cp .env.example .env

# .env
POLYMARKET_PRIVATE_KEY=0x...
KALSHI_API_KEY=...
KALSHI_API_SECRET=...
MAX_POSITION_USD=50
MAX_DAILY_LOSS_USD=100
MIN_EDGE=0.05
SLACK_WEBHOOK_URL=https://hooks.slack.com/...`,
  },
  {
    title: 'Rehearse, then go live',
    body: (
      <>
        Dry-run first — orders are <span className="text-[var(--text-primary)]">logged, not placed</span>. When the
        log looks right, drop the flag and the bot starts sending real orders.
      </>
    ),
    code: `npm install
DRY_RUN=1 npm run dev   # rehearsal
npm run dev             # live trading`,
  },
  {
    title: 'Deploy',
    optional: true,
    body: 'Ship to Fly.io, Railway, or Render for 24/7 operation. The scaffold includes a multi-stage Dockerfile; attach a small persistent volume so daily P&L state survives restarts.',
    code: 'fly launch',
  },
]

function StepGuide({ steps }: { steps: Step[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={step.title} className="relative flex gap-5 pb-10 last:pb-0">
            {!isLast && (
              <div className="pointer-events-none absolute left-[15.5px] top-9 bottom-[20px] w-px bg-[var(--border-primary)]" />
            )}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--border-primary)] bg-[var(--bg-primary)] font-jetbrains text-[12px] text-[var(--text-secondary)]">
              {i + 1}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <h3 className="font-grotesk text-[18px] font-semibold tracking-[-0.2px] text-[var(--text-primary)] sm:text-[19px]">
                  {step.title}
                </h3>
                {step.optional && (
                  <span className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 py-0.5 font-jetbrains text-[9px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Optional
                  </span>
                )}
              </div>
              <p className="max-w-[600px] font-jetbrains text-[13.5px] leading-[1.85] text-[var(--text-secondary)]">
                {step.body}
              </p>
              {step.extras}
              {step.code && <CopyableCodeBlock code={step.code} />}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function TradingBotQuickstart() {
  return (
    <ContentPage
      h1="How to Build a Prediction Market Trading Bot with Musashi"
      answer="Paste one prompt. Your editor scaffolds a real-money trading bot for Polymarket and Kalshi, powered by Musashi signals — with risk limits and a kill switch baked in."
      faqs={faqs}
      schemas={schemas}
    >
      <section className="flex flex-col gap-3 pt-2">
        <MasterPromptCard title="Give your trading bot everything it needs" prompt={MUSASHI_PROMPT} />
      </section>

      <section className="pt-2">
        <StepGuide steps={steps} />
      </section>

      <section className="border-t border-[var(--border-primary)] pt-8">
        <div className="flex flex-col gap-3">
          <p className="font-jetbrains text-[13px] leading-[1.85] text-[var(--text-tertiary)]">
            Risk reminder — this bot moves real money. Always rehearse with{' '}
            <code className="text-[var(--text-secondary)]">DRY_RUN=1</code> first, fund your wallet with only what you
            can afford to lose, and verify <code className="text-[var(--text-secondary)]">MAX_DAILY_LOSS_USD</code> is
            set before going live.
          </p>
          <p className="font-jetbrains text-[13px] leading-[1.85] text-[var(--text-tertiary)]">
            Full reference →{' '}
            <Link
              href="/ai"
              className="text-[var(--text-primary)] underline decoration-[var(--border-primary)] underline-offset-[3px] transition-colors hover:decoration-[#00FF88]"
            >
              interactive API docs
            </Link>
            .
          </p>
        </div>
      </section>

      <RelatedLinks title="Next" links={nextStepLinks} />
    </ContentPage>
  )
}
