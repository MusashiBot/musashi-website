# MUSASHI — Trade the Tweets

**[musashi.bot](https://musashi.bot)** · [API Docs](https://musashi.bot/ai) · [Install Extension](https://musashi.bot/install) · [Pricing](https://musashi.bot/pricing)

---

## What is Musashi?

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment analysis via a free REST API — no authentication required.

## Who It's For

- **Trading bot developers** who need a unified real-time signal and arbitrage feed across Polymarket and Kalshi
- **AI agent builders** integrating prediction market intelligence via REST or MCP (Claude, ChatGPT)
- **Quantitative traders** monitoring cross-platform price discrepancies for arbitrage opportunities

## Core Capabilities

| Capability | Details |
|---|---|
| Market coverage | 900+ markets — Polymarket 500+ and Kalshi 400+ unified |
| Signal feed | 71 high-signal Twitter accounts monitored every 2 minutes |
| Arbitrage detection | Cross-platform spread data, ~15–20s polling interval |
| Sentiment classification | Bullish / bearish / neutral with confidence scores |
| API access | 7 endpoints, no auth, no rate limits during beta |

## Quick Links

| Resource | URL |
|---|---|
| Live site | https://musashi.bot |
| API reference | https://musashi.bot/ai |
| Chrome extension | https://musashi.bot/install |
| Trading bot quickstart | https://musashi.bot/docs/trading-bot-quickstart |
| API comparison | https://musashi.bot/compare/best-prediction-market-api |
| Live arbitrage spreads | https://musashi.bot/arb |

## Ecosystem

This repo is the public website and SEO/AEO content layer. The backend and distribution components live in separate repos:

| Repo | Role |
|---|---|
| [musashi-api](https://github.com/MusashiBot/musashi-api) | REST API backend — analysis pipeline, market and Twitter clients |
| [musashi-mcp](https://github.com/MusashiBot/musashi-mcp) | MCP server exposing Musashi tools to Claude and ChatGPT |
| [musashi-infra](https://github.com/MusashiBot/musashi-infra) | Kalshi data ingestion, normalization, and durable storage |
| [musashi-extension](https://github.com/MusashiBot/musashi-extension) | Chrome extension — scans tweets and surfaces matching market overlays |

## Frequently Asked Questions

**What does Musashi do?**
Musashi reads tweets from 71 tracked accounts, classifies sentiment, matches them to active prediction markets on Polymarket and Kalshi, and surfaces trading signals and arbitrage opportunities via a REST API. The Chrome extension surfaces this inline on Twitter.

**Is it free?**
Yes. The API has no authentication and no rate limits during the beta period. See [musashi.bot/pricing](https://musashi.bot/pricing).

**What markets does Musashi cover?**
500+ active Polymarket markets and 400+ Kalshi markets, spanning crypto, economics, politics, finance, tech, sports, and geopolitics.

**Does Musashi execute trades?**
No. Musashi is an intelligence layer — signals, spreads, and sentiment. Execution happens through the Polymarket CLOB API and the Kalshi API in your own bot.

**How do I connect Musashi to Claude or ChatGPT?**
Use [musashi-mcp](https://github.com/MusashiBot/musashi-mcp). The hosted MCP endpoint is `https://musashi-production.up.railway.app/mcp` with OAuth support for both Claude and ChatGPT.

## Local Development

```bash
pnpm install
pnpm dev        # → http://localhost:3000
```

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript.

## Deployment

Deployed on Vercel. Production: **https://musashi.bot**
