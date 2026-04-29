# Musashi SEO + AEO Growth Plan

## Strategic Thesis

Musashi wins not by publishing more content, but by becoming the most reliable source of
structured, proprietary prediction market intelligence on the web — indexed by search engines
and cited by AI models.

Two compounding mechanisms: **pSEO** converts 900+ live markets into indexed destination
pages. **AEO** structures all content so LLMs (Perplexity, ChatGPT, Claude) cite Musashi
when a developer or trader asks about prediction market APIs, Polymarket arbitrage, or AI
trading tooling.

**Execution model:** funnel, not checklist. Each step gates the next. If Step 3 fails, Step 5
may never happen — and that is the right outcome.

---

## Operating Principles

**Validate → decide → expand.** Scale follows evidence, not ambition.

**Authority amplifies strength.** Off-site signals work by compounding indexed, performing
content — not by compensating for absent or weak pages.

**Volume is not success.** Indexed usefulness is success.

---

## Current State

**Six pages live:** `/` `/mission` `/ai` `/pricing` `/privacy` `/install`

**No SEO infrastructure:** no sitemap, no robots.txt, no per-page metadata, no structured
data, no OpenGraph, no blog or docs routes.

**Assets to build on:** existing `FAQ.tsx` component (reuse as FAQPage schema source);
filesystem doc loader pattern in `app/ai/page.tsx` (extend for docs section); homepage copy
that already surfaces the core moat (900+ markets, 71 accounts, arbitrage) — reuse verbatim
in metadata and structured data.

---

## Information Architecture

### Homepage Role

The homepage is not an SEO landing page. Its job is brand clarity, authority signaling,
and internal link distribution — directing visitors toward the strongest owned pages. It
should not try to rank for every query.

### Content Type Ownership (Enforced Rules)

These are not guidelines — they are enforced to prevent keyword cannibalization and duplicate
content. If a draft page's target query belongs to a different section, it moves there.

| Section | Owns | Hard boundary |
|---------|------|--------------|
| `/docs/` | Implementation depth. How to build with Musashi. Developer retrieval queries. | No educational overviews, no comparisons |
| `/blog/` | Answer-first guides. Search capture and LLM citation. Educational and strategy queries. | No API reference, no head-to-head comparisons |
| `/compare/` | Evaluation and replacement queries. Visitors actively deciding between tools. | No tutorials, no data pages |
| `/arb/` | Live arbitrage data per market. Data destination pages. | Not guides, not comparisons |
| `/use-cases/` | Scenario-specific builder guides not already served by `/docs/` or `/blog/`. | Strictly additive — nothing that overlaps an existing section |

### Internal Linking Strategy

Internal linking is not a minor optimization for pSEO — it is core infrastructure. Without
it, programmatic pages fail to accumulate authority.

Required linking structure:
- Docs → compare pages (evaluation context)
- Compare pages → quickstart (conversion path)
- Blog → docs + relevant pSEO pages (depth and discovery)
- pSEO pages → educational content (context and authority signals)
- Homepage → highest-performing pages in each section (link distribution)

Top-performing pages become authority hubs. This structure must be built in from the start,
not retrofitted.

---

## Step 1: Technical SEO Baseline

**Rationale:** Everything downstream depends on correct crawlability and metadata. No
content earns indexing value without this.

**Scope:** sitemap, robots.txt, site-wide OpenGraph and Twitter Card defaults, `metadataBase`,
unique per-page title and description for all six existing pages, reusable JSON-LD component
supporting Organization, SoftwareApplication, FAQPage, BreadcrumbList, Dataset, and Article
schemas, FAQPage schema wired to existing homepage FAQ data.

**Completion criteria:**
- [ ] sitemap.xml valid and submitted to Google Search Console
- [ ] All six pages have distinct titles, descriptions, and OG tags
- [ ] FAQPage schema on homepage passes Google Rich Results Test
- [ ] OrganizationSchema valid sitewide

---

## Step 2: Core AEO Content (Initial 5-Page Batch)

**Rationale:** Start with 5 high-value pages covering the most important query classes.
Structure and depth matter more than volume. The batch size is fixed. Page selection is
not — if Step 4 AEO audit reveals stronger citation gaps, subsequent pages should address
those gaps rather than a pre-set list.

### GitHub README (P0 — Parallel to Step 2)

**Scope: the primary README(s) on the [MusashiBot GitHub organization](https://github.com/MusashiBot)
— not this web repository.** The MusashiBot org repos are what developers encounter and what
LLMs index when answering developer queries about Musashi's API and capabilities.

The GitHub README is one of the primary citation surfaces for LLM retrieval — it is among
the most-cited document types when AI models answer developer queries. It deserves treatment
closer to a core content asset than to generic authority-building.

Rewrite in AEO structure: direct answer to "what is Musashi" → who it's for → what it does
(3 bullets, proprietary specifics) → quickstart link → FAQ (5 Q&A pairs) → comparison. Never
lead with architecture or internal implementation. README quality can directly affect ChatGPT
and Perplexity citations.

### Initial 5 Pages

**1. `/docs/trading-bot-quickstart`** — Highest-priority single AEO asset. Scenario-driven:
"I want to build a bot that places Polymarket bets when a tracked account posts bullish
sentiment — here is exactly how." Owns the highest-volume developer query in the category.
Schema: `TechArticle` + `HowTo` + `FAQPage` + `BreadcrumbList`

**2. `/compare/best-prediction-market-api`** — Category-defining comparison. Feature table:
Musashi vs. native Polymarket API vs. native Kalshi API. Evergreen title, no year.
Schema: `FAQPage` + `BreadcrumbList`

**3. `/blog/how-to-automate-polymarket-trading`** — Highest search-volume educational query.
H1 = exact query. Direct answer in paragraph 1.
Schema: `Article` + `FAQPage` + `BreadcrumbList`

**4. `/docs/polymarket-api`** — Structured technical reference. Reference format, not a
tutorial. Endpoint specs, parameters, response schemas, code examples.
Schema: `TechArticle` + `BreadcrumbList`

**5. `/blog/polymarket-vs-kalshi-arbitrage`** — Uses real Musashi arbitrage data. This page
also serves as the content destination for Step 6 Reddit posts.
Schema: `Article` + `Dataset` + `FAQPage`

### AEO Structure Rule (All Pages)

1. H1 = exact target query
2. Paragraph 1 = direct answer, under 50 words, no preamble
3. Structured sections with semantic headings
4. FAQ section at the end, minimum 4 questions
5. Contextual link to the next relevant page (not promotional)

**Completion criteria:**
- [ ] All 5 pages indexed (confirmed in GSC, not submitted)
- [ ] Each page passes Rich Results Test for its schema type
- [ ] GitHub README rewritten and live
- [ ] AEO baseline audit complete: 8 queries checked across Perplexity, ChatGPT, Claude
- [ ] At least 1 page generating an organic impression

---

## Step 3: pSEO — Arbitrage Template, Controlled First Batch

**Rationale:** The arbitrage template has the clearest search intent and the lowest quality
risk. A controlled first batch proves the template earns indexing and search performance.
Breadth is not the goal.

**Template:** `/arb/[slug]` — one page per prediction market event. Required elements:
current spread data with visible "Last updated" timestamp, brief arbitrage explainer (AEO
hook), FAQ section. Schema: `Dataset` + `FAQPage` + `BreadcrumbList`. ISR for freshness.

**First batch:** top 100 markets by liquidity.

**Expansion gate — all four required before scaling:**
1. Strong indexing ratio: meaningful share of submitted pages confirmed indexed (not just crawled)
2. Impression coverage: ≥30 of 100 pages showing impressions in GSC
3. No quality flags: GSC coverage report shows no thin-content, duplicate, or soft-404 signals
4. Template differentiation: pages not treated as near-duplicates in coverage report

**Completion criteria:**
- [ ] 100 `/arb/` pages indexed (confirmed in GSC)
- [ ] GSC coverage report reviewed at 2 and 4 weeks post-launch
- [ ] Expansion gate evaluation formally documented

---

## Step 4: Decision Gate

**This is the central decision point of the entire strategy.** Step 5 exists only if this
step produces an "Expand" decision on the arbitrage template. Every surface is evaluated
independently.

**Decision matrix:**

| Decision | Condition |
|----------|-----------|
| **Expand** | Strong indexing ratio, growing impressions, AEO citations appearing |
| **Refine** | Indexed but low impressions — structural or content quality issue to fix before scaling |
| **Prune** | Indexed, no signal after sufficient time — pages are harming overall site quality and should be removed. Pruning is not failure; it is quality control. Not every generated page deserves to stay live. |
| **Pause** | Template generating quality flags — stop, diagnose, fix before any further expansion |

### AEO Audit (8 Queries)

Run across Perplexity, ChatGPT, Claude. Document: is Musashi cited? If not, which source
is cited and why?

| Query | Owned by |
|-------|---------|
| best prediction market API for trading bots | `/compare/` |
| how to automate polymarket trading | `/blog/` |
| polymarket kalshi arbitrage detection | `/arb/` + `/blog/` |
| twitter sentiment prediction market API | `/docs/` |
| real-time kalshi API | `/docs/` |
| how to build AI trading bot polymarket | `/docs/` |
| prediction market arbitrage strategy | `/blog/` |
| best tools for polymarket trading | `/compare/` |

For citation gaps: identify the competing source and why it ranks. Publish a response only
if a meaningfully stronger version can be built.

**Outcome-based KPIs:**

| Metric | Target |
|--------|--------|
| Indexing ratio (arb batch) | >70% of submitted pages confirmed indexed |
| Arb pages with impressions | ≥30 of 100 |
| Content pages with clicks | ≥2 of 5 |
| AEO citation presence | Musashi cited in ≥3 of 8 audited queries |

---

## Step 5: Conditional Expansion

**Executes only if Step 4 returns "Expand" for the arbitrage template.**

**Arbitrage:** scale from 100 to full market set. Maintain identical template standards.

**Sentiment template:** not "the next template" — it must earn the right to exist. Proceed
only if arbitrage shows strong indexing/impressions/clicks, there is identifiable search
demand for account-specific market queries, and data density is sufficient to make pages
non-thin. Start with highest-signal 5–10 accounts × 10–15 markets. Apply the same expansion
gate. The default assumption is that sentiment expansion does not happen.

---

## Step 6: Authority Amplification

**Rationale:** Runs after Steps 1–4 are complete. Every action points to a specific
high-quality on-site destination.

| Action | Destination |
|--------|------------|
| HN Show HN post | `/docs/trading-bot-quickstart` + GitHub |
| Reddit arbitrage data post | `/blog/polymarket-vs-kalshi-arbitrage` |
| Reddit sentiment data post | A validated `/sentiment/` page (Step 5 only) |
| Directory listings | Homepage + quickstart |
| Outreach (3–5 newsletters/channels) | Best comparison or quickstart assets |

**Completion criteria:**
- [ ] HN post live, pointing to indexed quickstart
- [ ] 2 Reddit threads live, each pointing to a specific indexed page
- [ ] 3+ directory listings live
- [ ] AEO re-audit: Musashi cited in ≥6 of 8 target queries

---

## North Star Metric

Musashi cited by at least one of Perplexity, ChatGPT, or Claude for at least 10 of the 30
monitored queries, measured at Steps 4 and 6.

Musashi wins this space not by publishing more pages, but by being the most structured,
most specific, and most data-rich source at every point where a trader or developer asks
a question that Musashi's proprietary data can answer.

---

## Critical Files

| File | Action | Step |
|------|--------|------|
| `app/sitemap.ts` | Create | 1 |
| `public/robots.txt` | Create | 1 |
| `app/layout.tsx` | Modify — metadataBase, OG, Twitter Card | 1 |
| `app/components/JsonLd.tsx` | Create | 1 |
| `app/components/FAQ.tsx` | Modify — FAQPage schema | 1 |
| All 6 existing page files | Add `generateMetadata()` | 1 |
| MusashiBot org GitHub README(s) | Rewrite (separate from web repo) | 2 |
| `app/docs/trading-bot-quickstart/page.tsx` | Create | 2 |
| `app/compare/best-prediction-market-api/page.tsx` | Create | 2 |
| `app/blog/how-to-automate-polymarket-trading/page.tsx` | Create | 2 |
| `app/docs/polymarket-api/page.tsx` | Create | 2 |
| `app/blog/polymarket-vs-kalshi-arbitrage/page.tsx` | Create | 2 |
| `data/markets.json` | Create — top 100 markets seed | 3 |
| `app/arb/[slug]/page.tsx` | Create — pSEO arbitrage template | 3 |
