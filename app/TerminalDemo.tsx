'use client';

import { useEffect, useState } from 'react';

const LEFT_LINES = 10;
const RIGHT_LINES = 13;

type TerminalDemoProps = {
  compactLayout?: boolean;
};

export default function TerminalDemo({ compactLayout = false }: TerminalDemoProps) {
  const [visibleLinesLeft, setVisibleLinesLeft] = useState(0);
  const [visibleLinesRight, setVisibleLinesRight] = useState(0);

  useEffect(() => {
    const leftInterval = setInterval(() => {
      setVisibleLinesLeft((prev) => {
        if (prev >= LEFT_LINES) {
          clearInterval(leftInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    const rightInterval = setInterval(() => {
      setVisibleLinesRight((prev) => {
        if (prev >= RIGHT_LINES) {
          clearInterval(rightInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };
  }, []);

  const withoutCard = (
    <div className="terminal-column flex h-full flex-col gap-6 rounded-[24px] border border-[#222] bg-[#111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="font-jetbrains text-base font-bold uppercase tracking-[1px] text-[#ff5f56] sm:text-lg">
          Without Musashi
        </div>
      </div>
      <div className="space-y-2 font-jetbrains text-[12px] leading-[1.8] sm:text-[13px]">
        <div className={`text-[#888] transition-opacity duration-300 ${visibleLinesLeft >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#888]">$</span> <span className="text-[#4a9eff]">trading-agent</span> <span className="text-[#e0e0e0]">is running...</span>
        </div>
        <div className={`text-[#666] italic transition-opacity duration-300 ${visibleLinesLeft >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          Fresh install. No Musashi. No connected agentware.
        </div>
        <div className={`text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesLeft >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          The agent does not know what it can reach.
        </div>
        <div className={`text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesLeft >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          No Twitter sentiment. No Kalshi. No Polymarket.
        </div>
        <div className={`text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesLeft >= 5 ? 'opacity-100' : 'opacity-0'}`}>
          It behaves like a normal chat assistant.
        </div>
        <div className={`mt-5 transition-opacity duration-300 ${visibleLinesLeft >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#888]">Human:</span> <span className="text-[#e0e0e0]">&quot;What&apos;s the sentiment on Bitcoin right now?&quot;</span>
        </div>
        <div className={`text-[#ff5f56] transition-opacity duration-300 ${visibleLinesLeft >= 7 ? 'opacity-100' : 'opacity-0'}`}>
          No map. No flow. No action.
        </div>
        <div className={`text-[#ff5f56] transition-opacity duration-300 ${visibleLinesLeft >= 8 ? 'opacity-100' : 'opacity-0'}`}>
          Just waiting for prompts it cannot turn into reality.
        </div>
        <div className={`mt-4 text-[#666] italic transition-opacity duration-300 ${visibleLinesLeft >= 9 ? 'opacity-100' : 'opacity-0'}`}>
          {"// expensive intelligence, trapped in a box"}
        </div>
        <div className={`mt-5 transition-opacity duration-300 ${visibleLinesLeft >= 10 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#888]">Human:</span> <span className="text-[#e0e0e0]">&quot;So... it still does nothing.&quot;</span>
        </div>
      </div>
    </div>
  );

  const withCard = (
    <div className="terminal-column flex h-full flex-col gap-6 rounded-[24px] border border-[#222] bg-[#111] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
      <div className="flex items-center gap-3 border-b border-[#222] pb-4">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="h-3 w-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="font-jetbrains text-base font-bold uppercase tracking-[1px] text-[#27c93f] sm:text-lg">
          With Musashi
        </div>
      </div>
      <div className="space-y-2 font-jetbrains text-[12px] leading-[1.8] sm:text-[13px]">
        <div className={`text-[#888] transition-opacity duration-300 ${visibleLinesRight >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#888]">$</span> <span className="text-[#4a9eff]">npm run agent</span>
        </div>
        <div className={`text-[#666] italic transition-opacity duration-300 ${visibleLinesRight >= 2 ? 'opacity-100' : 'opacity-0'}`}>
          {"// Launches terminal dashboard with 6 panels"}
        </div>

        <div className={`mt-3 rounded border border-[#27c93f]/30 bg-[#0a0a0a] p-3 text-[10px] leading-relaxed transition-opacity duration-300 ${visibleLinesRight >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-[#4a9eff]/30 bg-[#0a0a0a] p-2">
              <div className="mb-1 text-[10px] font-bold text-[#4a9eff]">FEED</div>
              <div className="text-[9px] leading-relaxed text-[#888]">@Reuters • 2m</div>
              <div className="text-[9px] leading-relaxed text-[#e0e0e0]">Trump ends...</div>
              <div className="text-[9px] leading-relaxed text-[#ffbd2e]">• HIGH • 95%</div>
            </div>

            <div className="rounded border border-[#ffbd2e]/30 bg-[#0a0a0a] p-2">
              <div className="mb-1 text-[10px] font-bold text-[#ffbd2e]">ARBITRAGE</div>
              <div className="text-[9px] leading-relaxed text-[#e0e0e0]">Bitcoin Up/Down</div>
              <div className="flex gap-2 text-[9px] leading-relaxed">
                <span className="text-[#27c93f]">YES 37%</span>
                <span className="text-[#ff5f56]">NO 64%</span>
              </div>
              <div className="text-[9px] leading-relaxed text-[#ffbd2e]">Spread: 5.2%</div>
            </div>

            <div className="rounded border border-[#ff5f56]/30 bg-[#0a0a0a] p-2">
              <div className="mb-1 text-[10px] font-bold text-[#ff5f56]">MOVERS</div>
              <div className="text-[9px] leading-relaxed text-[#27c93f]">↑ Iran Ceasefire</div>
              <div className="text-[9px] leading-relaxed text-[#27c93f]">+12.3% (55→67%)</div>
            </div>

            <div className="rounded border border-[#888]/30 bg-[#0a0a0a] p-2">
              <div className="mb-1 text-[10px] font-bold text-[#888]">STATS</div>
              <div className="text-[9px] leading-relaxed text-[#e0e0e0]">Tweets: 124</div>
              <div className="text-[9px] leading-relaxed text-[#e0e0e0]">Politics: 45</div>
            </div>
          </div>

          <div className="mt-3 rounded border border-[#27c93f]/30 bg-[#0a0a0a] p-2">
            <div className="mb-1 text-[10px] font-bold text-[#27c93f]">LOGS</div>
            <div className="text-[9px] leading-relaxed text-[#27c93f]">[15:23:45] ✓ Updated: 3 new</div>
            <div className="text-[9px] leading-relaxed text-[#ffbd2e]">[15:23:40] ⚠ Arb: 5.2%</div>
          </div>
        </div>
        <div className={`mt-3 text-[#666] italic transition-opacity duration-300 ${visibleLinesRight >= 4 ? 'opacity-100' : 'opacity-0'}`}>
          {"// Real-time data visualization, not JSON"}
        </div>
        <div className={`mt-2 text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 5 ? 'opacity-100' : 'opacity-0'}`}>
          Polling every 5s. Parallel fetch (300ms).
        </div>
        <div className={`mt-2 text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesRight >= 6 ? 'opacity-100' : 'opacity-0'}`}>
          → 10 tweets analyzed
        </div>
        <div className={`text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesRight >= 7 ? 'opacity-100' : 'opacity-0'}`}>
          → 2 arbitrage opportunities found
        </div>
        <div className={`text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesRight >= 8 ? 'opacity-100' : 'opacity-0'}`}>
          → 4 markets moving significantly
        </div>
        <div className={`mt-3 text-[#666] italic transition-opacity duration-300 ${visibleLinesRight >= 9 ? 'opacity-100' : 'opacity-0'}`}>
          {"// Agent monitors dashboard, executes autonomously"}
        </div>
        <div className={`mt-3 text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesRight >= 10 ? 'opacity-100' : 'opacity-0'}`}>
          No prompts. No chat. Pure data.
        </div>
        <div className={`mt-2 text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 11 ? 'opacity-100' : 'opacity-0'}`}>
          → PolyDepth-style YES/NO splits
        </div>
        <div className={`mt-2 text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 12 ? 'opacity-100' : 'opacity-0'}`}>
          → Color-coded urgency levels
        </div>
        <div className={`mt-4 transition-opacity duration-300 ${visibleLinesRight >= 13 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#888]">Agent:</span> <span className="text-[#27c93f]">*executes trade on 5.2% spread*</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="flex w-full flex-col items-center gap-12 bg-[var(--bg-primary)] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-[100px]">
      <div className="flex w-full flex-col items-center gap-4">
        <span className="font-jetbrains text-[11px] font-bold tracking-[2px] text-[var(--text-lighter)]">
          {"// FOR AGENTS"}
        </span>
        <h2 className="font-grotesk text-[32px] font-bold tracking-[-1px] text-[var(--text-primary)] text-center md:text-[42px]">
          Stop Searching. Start Asking.
        </h2>
      </div>

      <div className={compactLayout ? 'w-full' : 'w-full xl:hidden'}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7B889D]">
            Swipe the cards
          </span>
          <span className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#4a9eff]">
            mobile carousel
          </span>
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6">
          <div className="w-[86vw] max-w-[520px] shrink-0 snap-center">
            {withoutCard}
          </div>
          <div className="w-[86vw] max-w-[520px] shrink-0 snap-center">
            {withCard}
          </div>
        </div>
      </div>

      <div className={compactLayout ? 'hidden' : 'hidden w-full max-w-[1400px] grid-cols-1 gap-8 xl:grid xl:grid-cols-2'}>
        <div>{withoutCard}</div>
        <div>{withCard}</div>
      </div>

      <div className="mt-12 grid w-full max-w-[1000px] grid-cols-3 gap-3 sm:gap-6">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-[#222] bg-[#111] px-3 py-5 sm:gap-3 sm:p-8">
          <div className="font-grotesk text-[30px] font-bold tracking-[-1px] text-[#4a9eff] sm:text-[48px]">
            659
          </div>
          <div className="text-center font-jetbrains text-[9px] uppercase tracking-[1px] text-[#888] sm:text-xs">
            Markets Live
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-[#222] bg-[#111] px-3 py-5 sm:gap-3 sm:p-8">
          <div className="font-grotesk text-[30px] font-bold tracking-[-1px] text-[#4a9eff] sm:text-[48px]">
            7
          </div>
          <div className="text-center font-jetbrains text-[9px] uppercase tracking-[1px] text-[#888] sm:text-xs">
            API Endpoints
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-[#222] bg-[#111] px-3 py-5 sm:gap-3 sm:p-8">
          <div className="font-grotesk text-[30px] font-bold tracking-[-1px] text-[#4a9eff] sm:text-[48px]">
            71
          </div>
          <div className="text-center font-jetbrains text-[9px] uppercase tracking-[1px] text-[#888] sm:text-xs">
            Twitter Accounts
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
