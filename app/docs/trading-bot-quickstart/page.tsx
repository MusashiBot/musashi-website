import type { Metadata } from 'next'
import Link from 'next/link'
import ContentPage, { type FaqEntry } from '../../components/ContentPage'
import CopyPromptBlock from '../../components/CopyPromptBlock'
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
    'Paste one prompt into Claude Code, Codex, or Cursor and ship a production-grade Musashi-powered prediction-market trading bot. Arbitrage, tweet signals, and market movers in one service.',
  path: '/docs/trading-bot-quickstart',
  ogTitle: 'Trading Bot Quickstart | MUSASHI',
  ogDescription:
    'One prompt, one Musashi-powered prediction-market trading bot. Free REST API for Polymarket and Kalshi.',
  type: 'article',
})

const MUSASHI_PROMPT = `Build me a production-grade prediction-market signal bot that uses the Musashi API.

# Overview
A long-running TypeScript/Node service that polls three Musashi endpoints in parallel, applies configurable thresholds, dedupes alerts, and posts unified messages to a Slack or Discord webhook. SIGNAL-ONLY by default — do not place real trades unless I explicitly add an execution module later.

# Musashi API
Base URL: https://musashi-api.vercel.app
No auth required during free beta.

Endpoints:
- GET /api/markets/arbitrage?minSpread={MIN_SPREAD}&minConfidence=0.5&limit=20
  Returns cross-platform Poly↔Kalshi opportunities.
  Fields: data.opportunities[].{polymarket,kalshi,spread,direction,confidence}, data.metadata.data_age_seconds.
  Cache TTL ~15s — poll no faster than every 30s.

- GET /api/markets/movers?minChange={MIN_CHANGE}&limit=20
  Returns 1h / 24h movers.
  Fields: data.movers[].{market,priceChange1h,priceChange24h,previousPrice,currentPrice,direction}.
  Snapshots persist 7 days; poll no faster than every 60s.

- POST /api/analyze-text { "text": string, "minConfidence": 0.4, "maxResults": 3 }
  Analyzes tweet/news text.
  Fields: data.suggested_action.{direction,edge,reasoning}, data.urgency, data.sentiment, data.markets[].{market,confidence}.
  Used for the inbound webhook strategy.

- GET /api/health — surface via /healthz on the bot.

# Architecture
src/
  index.ts          # boot: load env, start enabled strategies + webhook server, SIGTERM cleanup
  config.ts         # zod-validated env, defaults, type-safe export
  musashi.ts        # typed fetch client: getArbitrage(), getMovers(), analyzeText(), getHealth()
  dedupe.ts         # in-memory TTL Map — has(key), seen(key, ttlMs); 1h default
  alert.ts          # Slack mrkdwn + Discord embed formatters; one send() entry point
  server.ts         # Express: POST /tweet (x-inbound-token auth), GET /healthz
  strategies/
    arbitrage.ts    # interval loop, dedupe by (polyId,kalshiId), alert when spread >= MIN_SPREAD
    movers.ts       # interval loop, dedupe by marketId, group top-5 per poll
    tweet.ts        # called from server.ts; gate on edge >= MIN_EDGE AND urgency in [high, critical]

# .env.example
MUSASHI_BASE_URL=https://musashi-api.vercel.app
SLACK_WEBHOOK_URL=
DISCORD_WEBHOOK_URL=
INBOUND_TOKEN=change-me
MIN_SPREAD=0.05
MIN_CHANGE=0.05
MIN_EDGE=0.08
ARBITRAGE_INTERVAL_SECONDS=30
MOVERS_INTERVAL_SECONDS=300
PORT=8080
LOG_LEVEL=info
DISABLE_ARBITRAGE=
DISABLE_MOVERS=
DISABLE_TWEET=

# Alert format (Slack mrkdwn — translate cleanly to Discord embeds)
ARBITRAGE
> *Arbitrage* — {spread%} spread
> Poly: {title} @ {yesPrice}
> Kalshi: {title} @ {yesPrice}
> Direction: {direction} | Confidence: {confidence} | Age: {data_age}s

MOVERS (single grouped message per poll)
> *Top movers — last 1h*
> 1. ▲ {title} {prev}→{curr} ({change%})
> 2. ▼ {title} {prev}→{curr} ({change%})
> Age: {data_age}s

TWEET SIGNAL
> *{direction} signal — {urgency}*
> _{tweet excerpt}_
> {market_title} @ {yesPrice} | edge {edge%}
> {reasoning}

# Constraints
- TypeScript 5, ESM ("type": "module"), Node 20+, native fetch.
- Single-process. No DB. In-memory dedupe with 1h TTL.
- Graceful: log + continue on non-200; exponential back-off on 429 (5s, 15s, 45s).
- One webhook required (Slack OR Discord). Refuse to boot if neither is set.
- /tweet rejects requests without correct x-inbound-token header (401).
- Each strategy independently disableable via DISABLE_* env.
- Clean SIGTERM: stop intervals, await in-flight requests, exit 0.
- No tests required for v1.

# Deliverables
1. package.json, tsconfig.json, .env.example, .gitignore, README.md
2. All src/ files above
3. Dockerfile (multi-stage, node:20-slim) for Fly.io / Railway / Render
4. README sections: prerequisites, env reference, run locally, deploy to Fly.io, how to swap signal-only for live execution later

When everything is written, print:
- The install command
- The run command
- A sample curl that posts a tweet to /tweet`

const faqs: FaqEntry[] = [
  {
    q: 'Why a prompt instead of a tutorial?',
    a: 'Hand-written tutorials go stale. A well-scoped prompt re-runs on every model upgrade and produces a bot tailored to your stack, package versions, and deployment target. Treat the prompt as the source of truth and let your editor regenerate the implementation.',
  },
  {
    q: 'Does the bot place real trades?',
    a: 'No. The default scaffold is signal-only — it polls Musashi and posts alerts to Slack or Discord. To add execution, ask your editor for a follow-up: "Add an executor module that places limit orders on Polymarket via @polymarket/clob-client when MIN_EDGE is exceeded, behind a LIVE_TRADING=1 env flag with a confirmation gate."',
  },
  {
    q: 'Which editor should I use?',
    a: 'Claude Code is recommended for end-to-end scaffolding from a single prompt. Codex CLI works well if you prefer a plan-then-execute flow. Cursor is the best fit if you want to apply the prompt inside an existing repo via Composer (⌘L).',
  },
  {
    q: 'Does Musashi require an API key?',
    a: 'No key required during free beta. When auth ships, only an Authorization header is added — the prompt stays the same. Polling cadence guidance: arbitrage ≥ 30s, movers ≥ 60s.',
  },
  {
    q: 'How do I deploy the bot?',
    a: 'The prompt asks for a Dockerfile, so `fly launch` on Fly.io, `railway up`, or `render deploy` all work. Set the env vars in your provider, and the bot starts polling and serving the /tweet webhook on PORT.',
  },
  {
    q: 'What if the Musashi API is rate-limited?',
    a: 'The bot exponentially backs off on HTTP 429 (5s → 15s → 45s) and continues. Each Musashi response also includes data_age_seconds — the bot skips alerts when the data is stale (>60s).',
  },
]

const schemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'How to Build a Prediction Market Trading Bot with Musashi',
    description:
      'Paste one prompt into Claude Code, Codex, or Cursor and scaffold a production-grade prediction-market trading bot using the Musashi API.',
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
      'Use a single prompt to scaffold a production-grade prediction-market signal bot that polls the Musashi API and alerts to Slack or Discord.',
    step: [
      { '@type': 'HowToStep', name: 'Open a coding agent', text: 'Open Claude Code, Codex, or Cursor in an empty folder.' },
      { '@type': 'HowToStep', name: 'Paste the prompt', text: 'Paste the full Musashi trading-bot prompt and accept the file scaffold the agent proposes.' },
      { '@type': 'HowToStep', name: 'Configure env', text: 'Copy .env.example to .env, set MUSASHI_BASE_URL and either SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL, plus thresholds.' },
      { '@type': 'HowToStep', name: 'Run locally', text: 'Install dependencies and start the bot — it begins polling arbitrage and movers, and serves the /tweet webhook on PORT.' },
      { '@type': 'HowToStep', name: 'Deploy', text: 'Build the included Dockerfile and deploy to Fly.io, Railway, or Render. Set env vars in your provider dashboard.' },
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

const scaffoldTree = `.
├ src/index.ts          boot + lifecycle
├ src/config.ts         zod-validated env
├ src/musashi.ts        typed API client
├ src/dedupe.ts         TTL dedupe
├ src/alert.ts          Slack + Discord
├ src/server.ts         /tweet + /healthz
├ src/strategies/       arbitrage · movers · tweet
├ Dockerfile            node:20-slim, multi-stage
└ README.md             run + deploy + go-live`

const nextStepLinks = [
  { href: '/docs/polymarket-api', label: 'Polymarket API Reference' },
  { href: '/ai', label: 'Full interactive API docs' },
  { href: '/compare/best-prediction-market-api', label: 'Compare prediction market APIs' },
  { href: '/blog/polymarket-vs-kalshi-arbitrage', label: 'Polymarket vs Kalshi arbitrage guide' },
]

function StepHeader({ number, title, tagline }: { number: string; title: string; tagline: string }) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <span className="font-jetbrains text-[12px] font-bold uppercase tracking-[0.28em] text-[#00FF88]">
          {number}
        </span>
        <div className="h-px flex-1 bg-[var(--border-primary)]" />
      </div>
      <h2 className="font-grotesk text-[28px] font-semibold tracking-[-0.5px] text-[var(--text-primary)] lg:text-[34px]">
        {title}
      </h2>
      <p className="max-w-[600px] font-jetbrains text-[14px] leading-[1.85] text-[var(--text-secondary)]">
        {tagline}
      </p>
    </header>
  )
}

export default function TradingBotQuickstart() {
  return (
    <ContentPage
      h1="How to Build a Prediction Market Trading Bot with Musashi"
      answer="Paste one prompt. Your editor scaffolds a Musashi-powered bot that scans arbitrage, movers, and tweet signals — and alerts to Slack or Discord. Signal-only by default."
      faqs={faqs}
      schemas={schemas}
    >
      <section className="flex flex-col gap-6 pt-4">
        <StepHeader
          number="01"
          title="Open your editor"
          tagline="Use any agentic coding tool in an empty folder. They all handle the prompt the same way."
        />
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
      </section>

      <section className="flex flex-col gap-7 pt-4">
        <StepHeader
          number="02"
          title="Copy the prompt"
          tagline="One self-contained prompt. It encodes the architecture, env contract, alert format, and Musashi endpoint contracts."
        />
        <CopyPromptBlock label="Master prompt" prompt={MUSASHI_PROMPT} />
        <div>
          <div className="mb-3 font-jetbrains text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            What you&apos;ll get
          </div>
          <pre className="whitespace-pre bg-[var(--bg-secondary)] p-5 font-jetbrains text-[12px] leading-[1.85] text-[var(--text-secondary)] sm:p-6">
            {scaffoldTree}
          </pre>
        </div>
      </section>

      <section className="flex flex-col gap-6 pt-4">
        <StepHeader
          number="03"
          title="Configure and run"
          tagline="Set your webhook URL and start the bot. Node 20+, one of Slack or Discord."
        />
        <pre className="whitespace-pre-wrap bg-[var(--bg-secondary)] p-5 font-jetbrains text-[12.5px] leading-[1.95] text-white sm:p-6">
{`cp .env.example .env
# set SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL, INBOUND_TOKEN
npm install
npm run dev`}
        </pre>
        <p className="max-w-[600px] font-jetbrains text-[13px] leading-[1.85] text-[var(--text-tertiary)]">
          Arbitrage polls every 30s, movers every 5m,{' '}
          <code className="text-[var(--text-secondary)]">/tweet</code> listens on{' '}
          <code className="text-[var(--text-secondary)]">PORT 8080</code>. Alerts above your thresholds land in Slack or Discord.
        </p>
      </section>

      <section className="flex flex-col gap-6 pt-4">
        <StepHeader
          number="04"
          title="Going live"
          tagline="The scaffold is signal-only by design. When you're ready to trade real money, ask your editor:"
        />
        <blockquote className="max-w-[640px] border-l border-[var(--border-primary)] pl-5 font-jetbrains text-[13.5px] leading-[1.85] italic text-[var(--text-secondary)]">
          &ldquo;Add an executor that places limit orders on Polymarket via{' '}
          <span className="not-italic text-[var(--text-primary)]">@polymarket/clob-client</span> when{' '}
          <span className="not-italic text-[var(--text-primary)]">MIN_EDGE</span> is exceeded, behind a{' '}
          <span className="not-italic text-[var(--text-primary)]">LIVE_TRADING=1</span> env flag with a confirmation gate.&rdquo;
        </blockquote>
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
      </section>

      <RelatedLinks title="Next" links={nextStepLinks} />
    </ContentPage>
  )
}
