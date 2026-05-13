export type BotKind = 'arbitrage' | 'tweet-signals' | 'movers';
export type Editor = 'claude-code' | 'codex' | 'cursor';

export type Bot = {
  id: BotKind;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  endpoint: string;
  bullets: string[];
  files: string[];
  prompt: string;
};

const MUSASHI_BASE = 'https://musashi-api.vercel.app';

export const EDITORS: Record<Editor, { label: string; how: string }> = {
  'claude-code': {
    label: 'Claude Code',
    how: 'Open Claude Code in an empty folder, paste the prompt, accept the file writes.',
  },
  'codex': {
    label: 'Codex',
    how: 'Run `codex` in an empty folder, paste the prompt, approve the plan.',
  },
  'cursor': {
    label: 'Cursor',
    how: 'Open Cursor in an empty folder, hit ⌘L, paste the prompt, accept changes.',
  },
};

export const BOTS: Record<BotKind, Bot> = {
  'arbitrage': {
    id: 'arbitrage',
    title: 'Arbitrage Scanner',
    emoji: '◇',
    tagline: 'Poly vs Kalshi cross-platform spreads',
    description:
      'Polls Musashi for arbitrage opportunities between Polymarket and Kalshi. Alerts to Slack or Discord when the spread crosses your threshold.',
    endpoint: 'GET /api/markets/arbitrage',
    bullets: [
      'Polls every 30s within Musashi cache TTL',
      'Deduped alerts per market pair per hour',
      'One env file, one webhook, ready to deploy',
    ],
    files: ['package.json', 'src/index.ts', 'src/alert.ts', '.env.example', 'README.md'],
    prompt: `You are scaffolding a prediction-market arbitrage scanner that uses the Musashi API.

GOAL
Build a TypeScript/Node script that polls Musashi for cross-platform arbitrage opportunities between Polymarket and Kalshi, then posts alerts to a Slack or Discord webhook when the spread exceeds a configurable threshold. SIGNAL-ONLY — do not place real trades.

MUSASHI API
- Base URL: ${MUSASHI_BASE}
- Endpoint: GET /api/markets/arbitrage
- Query params: minSpread (default 0.05), minConfidence (default 0.5), limit (default 20), category (optional)
- No auth required during Musashi free beta
- Cache TTL is ~15s — do not poll faster than every 30s

RESPONSE SHAPE (relevant fields)
data.opportunities[].polymarket.title / yesPrice
data.opportunities[].kalshi.title / yesPrice
data.opportunities[].spread             // 0.07 = 7%
data.opportunities[].direction          // "buy_poly_sell_kalshi" | "buy_kalshi_sell_poly"
data.opportunities[].confidence
data.metadata.data_age_seconds          // skip alert if > 60

DELIVERABLES
1. package.json (Node 20+, "type": "module", deps: dotenv)
2. .env.example with MUSASHI_BASE_URL, SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL, MIN_SPREAD, POLL_INTERVAL_SECONDS
3. src/index.ts — main loop:
   - Read env vars, validate
   - Every POLL_INTERVAL_SECONDS fetch arbitrage with minSpread = MIN_SPREAD
   - For each opportunity, dedupe by (polymarket.id, kalshi.id) within a 1-hour window (in-memory Map)
   - Post a formatted alert to whichever webhook is set
4. src/alert.ts — Slack mrkdwn + Discord embeds
5. README.md — run + deploy on Railway/Fly/Render

ALERT FORMAT
Header: "Arbitrage: {spread*100}% spread"
Lines:  Poly: {title} @ {yesPrice} | Kalshi: {title} @ {yesPrice} | Direction: {direction} | Confidence: {confidence}
Footer: data age {data_age_seconds}s

CONSTRAINTS
- TypeScript, ESM, fetch global (Node 20)
- Log and continue on non-200; back off on 429
- No deps beyond dotenv
- No tests needed for v1

Scaffold the whole project. After writing files, print the run command.`,
  },

  'tweet-signals': {
    id: 'tweet-signals',
    title: 'Tweet-Signal Trader',
    emoji: '◈',
    tagline: 'Tweet in, YES/NO signal out',
    description:
      'Webhook service that runs incoming tweets through Musashi analyze-text and emits YES/NO signals with edge and reasoning when a strong opportunity is detected.',
    endpoint: 'POST /api/analyze-text',
    bullets: [
      'Express webhook, token-authenticated',
      'Filters by edge + urgency before alerting',
      'Wires up to IFTTT / Zapier / a tiny scraper',
    ],
    files: ['package.json', 'src/server.ts', 'src/alert.ts', '.env.example', 'README.md'],
    prompt: `You are scaffolding a tweet-driven prediction-market signal bot using the Musashi API.

GOAL
Build a TypeScript/Node service that accepts tweet text via a small HTTP webhook, runs it through Musashi's text-analysis pipeline, and forwards strong YES/NO signals to a Slack or Discord webhook. SIGNAL-ONLY — no real trades.

MUSASHI API
- Base URL: ${MUSASHI_BASE}
- Endpoint: POST /api/analyze-text
- Body: { "text": string, "minConfidence": 0.4, "maxResults": 3 }
- No auth required during Musashi free beta

RESPONSE SHAPE (relevant fields)
data.markets[].market.title / yesPrice / noPrice / url
data.markets[].confidence
data.suggested_action.direction      // YES | NO | HOLD
data.suggested_action.edge           // 0.12 = 12%
data.suggested_action.reasoning
data.sentiment.sentiment             // bullish | bearish | neutral
data.urgency                         // low | medium | high | critical

DELIVERABLES
1. package.json (Node 20+, "type": "module", deps: dotenv, express)
2. .env.example with MUSASHI_BASE_URL, SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL, INBOUND_TOKEN, MIN_EDGE, PORT
3. src/server.ts — Express webhook:
   - POST /tweet { text, author? } authenticated by header "x-inbound-token"
   - Call Musashi analyze-text
   - If suggested_action.direction != "HOLD" AND edge >= MIN_EDGE AND urgency in ["high","critical"], emit alert
   - Otherwise log and ignore
   - In-memory dedupe of {sha1(text)} for 24h
4. src/alert.ts — formatter (Slack mrkdwn + Discord embeds)
5. README.md — run + how to wire IFTTT / Zapier / a tiny scraper to POST /tweet

ALERT FORMAT
Header: "{direction} signal — {urgency}"
Body:   tweet excerpt, top market title + url, yesPrice, edge%, reasoning
Footer: sentiment, confidence

CONSTRAINTS
- TypeScript, ESM, fetch global (Node 20)
- Listen on PORT env, default 8080
- Reject requests without correct x-inbound-token (401)
- No DB

Scaffold the whole project. After writing files, print the run command and a sample curl posting a tweet.`,
  },

  'movers': {
    id: 'movers',
    title: 'Market Movers',
    emoji: '◆',
    tagline: '1h momentum leaderboard',
    description:
      'Polls Musashi for markets with significant 1-hour price moves, classifies them as surge / drop / drift, and posts a grouped leaderboard to Slack or Discord.',
    endpoint: 'GET /api/markets/movers',
    bullets: [
      'Top-5 grouped alerts (no per-mover spam)',
      'Surge / drop / drift classification',
      'Optional category filter',
    ],
    files: ['package.json', 'src/index.ts', 'src/classify.ts', 'src/alert.ts', '.env.example', 'README.md'],
    prompt: `You are scaffolding a momentum tracker for prediction markets using the Musashi API.

GOAL
Build a TypeScript/Node script that polls Musashi for markets with significant 1h price moves, classifies them, and posts the top movers as a single grouped leaderboard to a Slack or Discord webhook. SIGNAL-ONLY — no real trades.

MUSASHI API
- Base URL: ${MUSASHI_BASE}
- Endpoint: GET /api/markets/movers
- Query params: minChange (default 0.05), limit (default 20), category (optional)
- No auth required during Musashi free beta
- Snapshots persist 7 days; do not poll faster than every 60s

RESPONSE SHAPE (relevant fields)
data.movers[].market.title / url
data.movers[].priceChange1h            // signed, e.g. +0.08 or -0.12
data.movers[].priceChange24h
data.movers[].previousPrice / currentPrice
data.movers[].direction                // "up" | "down"
data.metadata.data_age_seconds

DELIVERABLES
1. package.json (Node 20+, "type": "module", deps: dotenv)
2. .env.example with MUSASHI_BASE_URL, SLACK_WEBHOOK_URL or DISCORD_WEBHOOK_URL, MIN_CHANGE, POLL_INTERVAL_SECONDS, CATEGORY (optional)
3. src/index.ts — main loop:
   - Every POLL_INTERVAL_SECONDS (default 300) fetch movers with minChange = MIN_CHANGE
   - Classify: surge (>10% up), drop (>10% down), drift (5–10%)
   - Dedupe by market id within a 1-hour window
   - Post top 5 movers as ONE grouped alert
4. src/classify.ts — classification helpers
5. src/alert.ts — leaderboard formatter (Slack mrkdwn + Discord embeds)
6. README.md — run + deploy

ALERT FORMAT
Header: "Top movers — last 1h"
Rows:   rank | dir | title | previousPrice → currentPrice ({change%})
Footer: data age, category filter (if set)

CONSTRAINTS
- TypeScript, ESM, fetch global (Node 20)
- One grouped message per poll
- Back off on 429
- No deps beyond dotenv

Scaffold the whole project. After writing files, print the run command.`,
  },
};

export const BOT_ORDER: BotKind[] = ['arbitrage', 'tweet-signals', 'movers'];
