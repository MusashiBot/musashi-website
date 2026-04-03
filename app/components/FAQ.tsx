'use client';

import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'What is the mission of Musashi?',
    answer: 'Andrej Karpathy said in his tweet: "it\'s 2026, Build. For. Agents" - and that\'s why we built Musashi. We believe the era of CLI and agent-first products is here. Humans shouldn\'t be glued to screens watching markets - agents should monitor, analyze, and trade autonomously. Musashi provides the structured intelligence layer that agents need: not a pretty dashboard, but a high-frequency API with trading signals, confidence scores, and real-time market data. We\'re building infrastructure for the autonomous trading era.',
  },
  {
    question: 'What is Musashi?',
    answer: 'Musashi is an AI intelligence service that automatically collects and analyzes tweets from 71 high-signal accounts every 2 minutes, matches them to 900+ prediction markets, generates trading signals, and feeds structured data to AI trading bots via a polling API. The Chrome extension is just a monitoring dashboard (10% of the product) - the real product is the intelligence layer for automated trading.',
  },
  {
    question: 'Who is Musashi built for?',
    answer: 'Primarily for AI trading bots and developers building automated prediction market strategies. The Chrome extension lets humans monitor what the bots see, but the core product is the feed API that provides analyzed tweets with sentiment, urgency levels, confidence scores, and suggested trading actions.',
  },
  {
    question: 'How does the automated feed work?',
    answer: 'Every 2 minutes, Musashi collects tweets from 71 monitored accounts across 8 categories (crypto, politics, economics, tech, sports, geopolitics, finance, breaking news). Each tweet is analyzed using keyword matching, entity extraction, and sentiment analysis, then matched to relevant markets. Only tweets that match ≥1 market are stored in the feed for 48 hours.',
  },
  {
    question: 'What data do AI agents get?',
    answer: 'For each analyzed tweet: original author and text, 1-5 matched markets with confidence scores, sentiment (bullish/bearish/neutral), suggested action (YES/NO/HOLD with confidence + edge), urgency level (critical/high/medium/low), category, and reasoning. Everything your bot needs to make trading decisions.',
  },
  {
    question: 'How do I integrate Musashi into my trading bot?',
    answer: 'Use the Agent SDK (TypeScript/JavaScript) or call the REST API directly. Poll /api/feed every 20-30 seconds with filters (category, urgency, since timestamp) for optimal freshness. The SDK provides callback methods like onFeed() that handle polling automatically. Python, Node.js, and other language examples are in the docs.',
  },
  {
    question: 'What markets does Musashi cover?',
    answer: '900+ markets from Polymarket (500) and Kalshi (400), sorted by volume. Politics, economics, crypto, technology, sports, geopolitics, climate, and entertainment. Markets update every 15-20 seconds for real-time trading decisions. Coverage includes all major markets across categories with fresh pricing data.',
  },
  {
    question: 'Is Musashi free?',
    answer: 'Yes, completely free during beta. The feed API, Chrome extension, and SDK are all free with no rate limits currently. All infrastructure runs on free tiers (Vercel, Vercel KV, Twitter API). Fair usage limits may be added in the future to ensure service reliability, but the core service will remain free for reasonable bot usage.',
  },
  {
    question: 'What about arbitrage and market movers?',
    answer: 'Musashi detects cross-platform arbitrage opportunities (e.g., same market trading at 63% on Polymarket, 70% on Kalshi = 7% spread) and tracks markets with significant price changes (>5% in 1h or 24h windows). Access via /api/markets/arbitrage and /api/markets/movers endpoints.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex w-full flex-col items-start gap-10 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-16 sm:px-6 lg:flex-row lg:gap-12 lg:px-[120px] lg:py-[100px]">
      {/* Left: Pricing Card */}
      <div className="w-full lg:w-[400px] flex-shrink-0">
        <div className="flex flex-col gap-6 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-6 sm:p-8 lg:sticky lg:top-8 lg:gap-8">
          {/* Investment */}
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 border-b border-[var(--border-primary)] pb-6 sm:min-h-[140px]">
            <span className="font-jetbrains text-[var(--text-tertiary)] text-[11px] font-bold tracking-[2px] uppercase">
              Your Investment
            </span>
            <span className="font-grotesk text-[clamp(2.75rem,12vw,4rem)] font-bold leading-none tracking-[-2px] text-[var(--text-primary)]">
              Free
            </span>
          </div>

          {/* What You Get */}
          <div className="flex flex-col gap-4">
            <h3 className="font-grotesk text-[var(--text-primary)] text-xl font-semibold text-center">
              What You Get
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  Automated feed from 71 high-signal accounts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  900+ markets (Polymarket + Kalshi)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  AI sentiment analysis + trading signals
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  REST API + Agent SDK (TypeScript/JS)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  Arbitrage detection + market movers
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 fill-[#00FF88] mt-0.5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span className="font-jetbrains text-[var(--text-secondary)] text-[13px] font-normal leading-[1.6]">
                  No rate limits, no API keys required
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right: FAQ Accordion */}
      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="font-grotesk text-[clamp(1.9rem,8.8vw,2.8rem)] font-bold tracking-[-1.5px] text-[var(--text-primary)]">
            Common Questions
          </h2>
          <p className="max-w-[28rem] font-jetbrains text-[13px] font-normal leading-[1.7] text-[var(--text-secondary)] sm:text-[14px]">
            Everything you need to know about Musashi
          </p>
        </div>

        <div className="flex flex-col">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-[var(--border-primary)] last:border-b-0"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="flex w-full items-start justify-between gap-4 py-5 text-left transition-opacity hover:opacity-80 sm:items-center sm:py-6"
              >
                <span className="pr-4 font-grotesk text-[clamp(1.05rem,5.6vw,1.6rem)] font-medium leading-[1.35] text-[var(--text-primary)] sm:pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`mt-1 h-5 w-5 flex-shrink-0 fill-[var(--text-primary)] transition-transform duration-200 sm:mt-0 ${
                    openIndex === index ? 'rotate-45' : ''
                  }`}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'
                }`}
              >
                <p className="pr-2 font-jetbrains text-[13px] font-normal leading-[1.75] text-[var(--text-secondary)] sm:pr-12 sm:text-[14px]">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
