# Musashi SEO + AEO Execution Plan

Updated: May 5, 2026

## Current Baseline

The site now has a real technical SEO foundation:

- Canonical metadata is wired across indexed routes.
- `sitemap.xml` now uses file-backed and data-backed `lastmod` values instead of stamping every URL with the current build time.
- Breadcrumb and FAQ schema now match real route hierarchy.
- `/docs`, `/blog`, and `/compare` now exist as crawlable hub pages instead of leaving child pages orphaned under non-existent parents.
- The `Data License` page no longer ships with a placeholder effective date.

This means the next phase should focus less on infrastructure and more on authority, query coverage, and measurement.

## What The Site Should Own

### `/docs/`

Own implementation queries and developer retrieval:

- how to build a prediction market trading bot
- prediction market API docs
- polymarket API reference
- twitter sentiment API for trading bots

### `/blog/`

Own educational and strategy queries:

- how to automate polymarket trading
- polymarket vs kalshi arbitrage
- prediction market arbitrage strategy
- how AI agents trade prediction markets

### `/compare/`

Own evaluation queries:

- best prediction market API
- Musashi vs Polymarket API
- Musashi vs Kalshi API
- best API for prediction market trading bots

### `/arb/`

Own live market-intent queries:

- [event] arbitrage
- polymarket vs kalshi spread for [event]
- live prediction market arbitrage opportunities

## Remaining Gaps

### 1. Query coverage is still thin

The site now has better structure, but only a small set of pages actually targets high-value queries:

- 2 docs pages
- 2 blog pages
- 1 comparison page

That is enough for a clean first cluster, not enough for category authority.

### 2. `/ai` is still a utility page, not a strong search landing page

`/ai` is useful for humans who want the raw docs console, but it is still broader and less answer-focused than the dedicated `/docs/*` pages. We should decide whether to:

- keep it indexed as a documentation hub, or
- de-emphasize it for search and treat `/docs/*` as the primary indexed docs surface

Do not do both at once.

### 3. No measurement loop exists yet

There is still no documented process for:

- Google Search Console monitoring
- Bing Webmaster Tools submission
- query-level impression tracking
- AI citation tracking across ChatGPT, Perplexity, Claude, and Gemini

Without this, content expansion will be guesswork.

### 4. pSEO scale should stay gated

The arbitrage template is now in a better crawlable state, but expansion should still depend on quality signals:

- indexation ratio
- impressions per batch
- duplicate/thin-page signals
- whether pages earn citations or links

### 5. Off-site authority is still underpowered

The most important non-site AEO surfaces remain outside this repo:

- GitHub org README
- primary API repo docs
- launch and community posts that link back to canonical pages

For developer-facing AEO, those surfaces matter almost as much as the site itself.

## Phase Plan

### Phase 1: Measurement and Validation

Ship first:

- Submit `https://musashi.bot/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- Validate homepage, docs pages, compare page, and arbitrage template in Rich Results Test.
- Track 10 owned queries in a simple weekly sheet: ranking, impressions, clicks, cited source, cited competitor.
- Run a weekly citation audit in ChatGPT, Perplexity, Claude, and Gemini for the same 10 queries.

### Phase 2: Fill The Core Content Cluster

Publish next:

- `/docs/kalshi-api`
- `/docs/twitter-sentiment-api`
- `/blog/prediction-market-arbitrage-strategy`
- `/blog/how-to-build-an-ai-trading-bot-for-polymarket`
- `/compare/musashi-vs-polymarket-api`
- `/compare/musashi-vs-kalshi-api`

Rules:

- H1 must match the owned query.
- Paragraph 1 must answer the query directly.
- Every page must end with FAQs and point to the next logical page.
- Every new page must link back to a hub page and at least one sibling page.

### Phase 3: Improve Entity and Citation Strength

Strengthen off-site and structured signals:

- Rewrite the main GitHub README to mirror the docs hierarchy.
- Make the API repo README answer “what is Musashi, who is it for, how do I use it” in the first screen.
- Add explicit source attribution and canonical links anywhere market data is reused publicly.
- Create one reusable citation block for docs and README pages so LLMs repeatedly see the same product description.

### Phase 4: Controlled pSEO Expansion

Only expand `/arb/[slug]` when the first batch shows:

- healthy indexation
- impressions on a meaningful share of pages
- no soft-404 or duplicate-content warnings
- stable internal linking from `/arb`, `/blog`, and `/docs`

If those checks fail, improve the template before generating more pages.

## Success Criteria

Within the next 30 days, success means:

- every indexed page has valid metadata, canonical tags, and accurate structured data
- docs, blog, compare, and arb each have a real hub page and at least 2 supporting child pages
- at least 10 owned queries are being tracked weekly
- Musashi appears as a cited or suggested source for at least some target queries in one or more AI products
- arbitrage pages show real impressions before any large-scale pSEO expansion

## Do Not Do Yet

- Do not mass-generate hundreds of new non-differentiated content pages.
- Do not add more comparison pages until each one has a distinct query target.
- Do not split authority between `/ai` and `/docs` without making an explicit indexing decision.
- Do not optimize for “more pages” before validating impressions, citations, and internal linking.
