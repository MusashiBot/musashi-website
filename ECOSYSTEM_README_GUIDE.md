# Musashi Ecosystem README Guide

This guide defines what each repo in the Musashi ecosystem needs to add to its README to ensure brand consistency, correct cross-linking, and LLM citability. Apply these changes directly to the `README.md` in each repo.

---

## Why This Matters

GitHub READMEs are among the most-cited sources when LLMs (Perplexity, ChatGPT, Claude) answer developer queries. When a developer asks "what is Musashi" or "best prediction market API for trading bots," the answer is shaped by what our READMEs say — not just our website. Each README that describes its component in isolation, with no brand narrative and no cross-links, misses a citation opportunity and creates an inconsistent experience for developers evaluating the ecosystem.

The goal is not to turn technical documentation into marketing copy. The rule is: one short brand paragraph at the top, correct cross-links, and a small FAQ that answers the questions developers actually ask. Everything else stays as-is.

---

## Standard Brand Block

Copy this block to the **top** of every repo README, above the existing content. Fill in the `[REPO_SUBTITLE]` and `[REPO_ONE_LINE]` slots per the repo-specific instructions below.

```markdown
# MUSASHI / [REPO_SUBTITLE]

**[musashi.bot](https://musashi.bot)** · [API Docs](https://musashi.bot/ai) · [GitHub Org](https://github.com/MusashiBot)

[REPO_ONE_LINE]

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment classification via a free REST API. This repo is one component in that stack — see [Ecosystem](#ecosystem) below.
```

After the brand block, add an **Ecosystem** section near the top (before installation steps):

```markdown
## Ecosystem

| Repo | Role |
|---|---|
| [musashi-api](https://github.com/MusashiBot/musashi-api) | REST API backend — analysis pipeline, market and Twitter clients |
| [musashi-mcp](https://github.com/MusashiBot/musashi-mcp) | MCP server exposing Musashi tools to Claude and ChatGPT |
| [musashi-infra](https://github.com/MusashiBot/musashi-infra) | Kalshi data ingestion, normalization, and durable storage |
| [musashi-extension](https://github.com/MusashiBot/musashi-extension) | Chrome extension — scans tweets and surfaces matching market overlays |
```

---

## Cross-Linking Table

Every repo must include these links somewhere in the README (in the brand block, ecosystem section, or relevant prose):

| Every repo links to | Why |
|---|---|
| https://musashi.bot | Main product URL — for LLM citation and brand authority |
| https://musashi.bot/ai | API reference — so developers can see endpoint specs without digging |
| https://musashi.bot/docs/trading-bot-quickstart | Entry point for new integrators |

In addition, each repo links to the repos it directly depends on or serves (see repo-specific sections below).

---

## Repo-Specific Instructions

### musashi-api

**Subtitle:** `musashi-api`
**One-line:** `REST API backend for the Musashi prediction market intelligence stack.`

**Brand block (ready to paste):**

```markdown
# MUSASHI / musashi-api

**[musashi.bot](https://musashi.bot)** · [API Docs](https://musashi.bot/ai) · [GitHub Org](https://github.com/MusashiBot)

REST API backend for the Musashi prediction market intelligence stack.

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment classification via a free REST API. This repo is the shared backend that powers all Musashi products — see [Ecosystem](#ecosystem) below.
```

**Position in Platform section** — add after the brand block:

```markdown
## Position in Platform

`musashi-api` is the source of truth for shared prediction-market intelligence. It owns:
- REST handlers consumed by the Chrome extension and MCP server
- The analysis pipeline (sentiment, arbitrage, signal classification)
- Market and Twitter client integrations
- The database schema and backend server

**Upstream:** [musashi-infra](https://github.com/MusashiBot/musashi-infra) provides the Kalshi ingestion layer that feeds this API's market data.
**Downstream:** [musashi-extension](https://github.com/MusashiBot/musashi-extension) and [musashi-mcp](https://github.com/MusashiBot/musashi-mcp) both consume this API.
```

**FAQ block** — add before or after existing content:

```markdown
## FAQ

**What does this API expose?**
Seven endpoints: `/api/feed`, `/api/markets`, `/api/markets/arbitrage`, `/api/markets/movers`, `/api/sentiment`, `/api/signals`, `/api/health`. Full reference at [musashi.bot/ai](https://musashi.bot/ai).

**Does it require authentication?**
No. The public API is open during beta with no rate limits.

**How do I build a trading bot with this?**
See the [trading bot quickstart](https://musashi.bot/docs/trading-bot-quickstart) for a step-by-step integration guide.

**Who consumes this API?**
The [Chrome extension](https://github.com/MusashiBot/musashi-extension) and the [MCP server](https://github.com/MusashiBot/musashi-mcp) both hit this API directly.
```

---

### musashi-mcp

**Subtitle:** `musashi-mcp`
**One-line:** `MCP server that exposes Musashi prediction market intelligence to Claude and ChatGPT.`

**Brand block (ready to paste):**

```markdown
# MUSASHI / musashi-mcp

**[musashi.bot](https://musashi.bot)** · [API Docs](https://musashi.bot/ai) · [GitHub Org](https://github.com/MusashiBot)

MCP server that exposes Musashi prediction market intelligence to Claude and ChatGPT.

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment classification via a free REST API. This repo wraps that API as an MCP server so Claude and ChatGPT can call Musashi tools directly — see [Ecosystem](#ecosystem) below.
```

**Position in Platform section:**

```markdown
## Position in Platform

`musashi-mcp` is the MCP distribution layer. It wraps the [musashi-api](https://github.com/MusashiBot/musashi-api) REST endpoints as 14 MCP-accessible tools and handles OAuth for Claude and ChatGPT clients.

**Upstream:** All data and analysis comes from [musashi-api](https://github.com/MusashiBot/musashi-api).
**Hosted endpoint:** `https://musashi-production.up.railway.app/mcp`
```

**Add to the existing "Example prompts" section** — append this line:

```markdown
For a full list of Musashi capabilities and how they compare to native Polymarket and Kalshi APIs, see [musashi.bot/compare/best-prediction-market-api](https://musashi.bot/compare/best-prediction-market-api).
```

**FAQ block:**

```markdown
## FAQ

**What MCP tools does this expose?**
14 tools including `analyze_text`, `get_arbitrage`, `get_movers`, `ground_probability`, `get_feed`, `get_market_brief`, and `explain_market_move`. Full specs at [musashi.bot/ai](https://musashi.bot/ai).

**What's the hosted MCP endpoint?**
`https://musashi-production.up.railway.app/mcp` — supports OAuth for Claude and ChatGPT.

**Does it need a Musashi account?**
No. The underlying API is open during beta. The MCP server may require an API key depending on configuration — check `MUSASHI_MCP_API_KEY` in the environment variables section.

**How is this different from calling musashi-api directly?**
This adds MCP protocol support so LLM clients like Claude and ChatGPT can call Musashi as a tool without custom integration code.
```

---

### musashi-infra

**Subtitle:** `musashi-infra`
**One-line:** `Kalshi-first data ingestion and storage infrastructure for the Musashi platform.`

**Brand block (ready to paste):**

```markdown
# MUSASHI / musashi-infra

**[musashi.bot](https://musashi.bot)** · [API Docs](https://musashi.bot/ai) · [GitHub Org](https://github.com/MusashiBot)

Kalshi-first data ingestion and storage infrastructure for the Musashi platform.

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment classification via a free REST API. This repo is the data foundation (Stage 0) that the rest of the stack is built on — see [Ecosystem](#ecosystem) below.
```

**Position in Platform section:**

```markdown
## Position in Platform

`musashi-infra` owns Stage 0 of the Musashi platform: canonical market type definitions, Kalshi ingestion, data normalization, durable Supabase storage, and job scheduling for snapshots and resolution tracking. It does **not** own product APIs, MCP distribution, UI, or intelligence features.

**Downstream:** [musashi-api](https://github.com/MusashiBot/musashi-api) consumes the normalized market data this repo stores.
```

**Note:** Do not add marketing language to the operational job docs (`npm run job:*` sections). Keep those purely technical. The brand block and Position in Platform section are sufficient.

**FAQ block:**

```markdown
## FAQ

**What data does this repo own?**
Kalshi market snapshots, resolution records, and gap-detection logs. All stored in Supabase with idempotent writes.

**Where does the data go after ingestion?**
[musashi-api](https://github.com/MusashiBot/musashi-api) reads it to power the REST endpoints at [musashi.bot/ai](https://musashi.bot/ai).

**Does this repo expose any public APIs?**
No. It is internal infrastructure. All public-facing endpoints are in musashi-api.
```

---

### musashi-extension

**Subtitle:** `musashi-extension`
**One-line:** `Chrome extension that surfaces Musashi prediction market intelligence inline on Twitter.`

**Brand block (ready to paste):**

```markdown
# MUSASHI / musashi-extension

**[musashi.bot](https://musashi.bot)** · [Install from Chrome Web Store](https://musashi.bot/install) · [API Docs](https://musashi.bot/ai) · [GitHub Org](https://github.com/MusashiBot)

Chrome extension that surfaces Musashi prediction market intelligence inline on Twitter.

Musashi is an AI intelligence service for prediction market trading bots. It monitors 71 high-signal Twitter accounts, tracks 900+ markets across Polymarket and Kalshi, and delivers automated trading signals, arbitrage detection, and sentiment classification via a free REST API. This extension is the browser-native interface to that intelligence — see [Ecosystem](#ecosystem) below.
```

**Position in Platform section:**

```markdown
## Position in Platform

`musashi-extension` is the browser distribution layer. A content script scans tweets in the timeline, sends them to [musashi-api](https://github.com/MusashiBot/musashi-api) for analysis, and renders a market overlay card inline if a matching prediction market is found. A service worker manages badge state and the configured API base URL.

**Install:** [musashi.bot/install](https://musashi.bot/install) or search "Musashi" in the Chrome Web Store (ID: `kbiajcnhcfoobejabhidbohnaanmejia`).
**API dependency:** [musashi-api](https://github.com/MusashiBot/musashi-api) — default endpoint `https://musashi-api.vercel.app`, configurable via `chrome.storage.sync`.
```

**FAQ block:**

```markdown
## FAQ

**How do I install the extension?**
From the Chrome Web Store at [musashi.bot/install](https://musashi.bot/install). No account required.

**What does it show on Twitter?**
When you view a tweet from one of Musashi's 71 tracked accounts, the extension overlays a card showing matched prediction markets, current prices, and sentiment classification.

**What API does the extension call?**
[musashi-api](https://github.com/MusashiBot/musashi-api). The default endpoint is `https://musashi-api.vercel.app`. You can point it at a local instance via the extension popup.

**Does it require a Musashi account?**
No. The extension works instantly with no sign-up. See [musashi.bot/pricing](https://musashi.bot/pricing).
```

---

## Implementation Checklist

Apply to each repo's `README.md` in this order:

- [ ] **Brand block** pasted at the very top, above all existing content
- [ ] **Ecosystem table** added near the top (after brand block, before installation)
- [ ] **Position in Platform** section added (repo-specific content from above)
- [ ] **Cross-links** to `musashi.bot`, `musashi.bot/ai`, `musashi.bot/docs/trading-bot-quickstart` present somewhere in the file
- [ ] **FAQ block** added (minimum 3 Q&A pairs from above, or add repo-specific ones)
- [ ] No marketing language added to operational sections (job docs, env vars, build commands)
- [ ] Existing content unchanged below the new sections

Priority order: **musashi-api → musashi-mcp → musashi-extension → musashi-infra**
(API and MCP have the highest LLM citation surface area.)
