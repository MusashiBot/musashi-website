'use client';

import { useEffect, useState } from 'react';

export default function TerminalDemo() {
  const [visibleLinesLeft, setVisibleLinesLeft] = useState(0);
  const [visibleLinesRight, setVisibleLinesRight] = useState(0);

  // Left column has 10 lines
  const leftLines = 10;
  // Right column has 13 lines
  const rightLines = 13;

  useEffect(() => {
    // Show left column lines one by one
    const leftInterval = setInterval(() => {
      setVisibleLinesLeft((prev) => {
        if (prev >= leftLines) {
          clearInterval(leftInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    // Show right column lines one by one (with slight delay)
    const rightInterval = setInterval(() => {
      setVisibleLinesRight((prev) => {
        if (prev >= rightLines) {
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

  return (
    <section className="flex flex-col items-center gap-12 w-full px-[120px] py-[100px] bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4 w-full">
        <span className="font-jetbrains text-[var(--text-lighter)] text-[11px] font-bold tracking-[2px]">
          // FOR AGENTS
        </span>
        <h2 className="font-grotesk text-[var(--text-primary)] text-[42px] font-bold tracking-[-1px] text-center">
          Stop Searching. Start Asking.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-[1400px]">
        {/* WITHOUT MUSASHI */}
        <div className="terminal-column flex flex-col gap-6 p-8 bg-[#111] border border-[#222] rounded-lg">
          <div className="flex items-center gap-3 pb-4 border-b border-[#222]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="font-jetbrains text-[#ff5f56] text-lg font-bold uppercase tracking-[1px]">
              Without Musashi
            </div>
          </div>
          <div className="font-jetbrains text-[13px] leading-[1.8] space-y-2">
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
              // expensive intelligence, trapped in a box
            </div>
            <div className={`mt-5 transition-opacity duration-300 ${visibleLinesLeft >= 10 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#888]">Human:</span> <span className="text-[#e0e0e0]">&quot;So... it still does nothing.&quot;</span>
            </div>
          </div>
        </div>

        {/* WITH MUSASHI */}
        <div className="terminal-column flex flex-col gap-6 p-8 bg-[#111] border border-[#222] rounded-lg">
          <div className="flex items-center gap-3 pb-4 border-b border-[#222]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="font-jetbrains text-[#27c93f] text-lg font-bold uppercase tracking-[1px]">
              With Musashi
            </div>
          </div>
          <div className="font-jetbrains text-[13px] leading-[1.8] space-y-2">
            <div className={`text-[#888] transition-opacity duration-300 ${visibleLinesRight >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#888]">$</span> <span className="text-[#4a9eff]">curl</span> <span className="text-[#e0e0e0]">musashi.bot/api/analyze-text</span>
            </div>
            <div className={`text-[#666] italic transition-opacity duration-300 ${visibleLinesRight >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              // Agent queries: &quot;Iran strikes Israel today&quot;
            </div>
            <div className={`mt-3 text-[#888] transition-opacity duration-300 ${visibleLinesRight >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#27c93f]">200 OK</span> <span className="text-[#666]">• 147ms</span>
            </div>
            <div className={`mt-2 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded text-[11px] transition-opacity duration-300 ${visibleLinesRight >= 4 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-[#888]">&#123;</div>
              <div className="ml-3 text-[#4a9eff]">&quot;markets&quot;: <span className="text-[#888]">[</span></div>
              <div className="ml-6">
                <span className="text-[#888]">&#123;</span><span className="text-[#ffbd2e]">&quot;title&quot;</span><span className="text-[#888]">:</span> <span className="text-[#27c93f]">&quot;US/Israel strike Iran March 6?&quot;</span><span className="text-[#888]">,</span>
              </div>
              <div className="ml-6">
                <span className="text-[#ffbd2e]">&quot;confidence&quot;</span><span className="text-[#888]">:</span> <span className="text-[#4a9eff]">0.95</span><span className="text-[#888]">,</span>
              </div>
              <div className="ml-6">
                <span className="text-[#ffbd2e]">&quot;yesPrice&quot;</span><span className="text-[#888]">:</span> <span className="text-[#4a9eff]">0.99</span><span className="text-[#888]">,</span>
              </div>
              <div className="ml-6">
                <span className="text-[#ffbd2e]">&quot;platform&quot;</span><span className="text-[#888]">:</span> <span className="text-[#27c93f]">&quot;polymarket&quot;</span>
              </div>
              <div className="ml-3 text-[#888]">&#125;</div>
              <div className="ml-3 text-[#888]">],</div>
              <div className="ml-3 text-[#4a9eff]">&quot;sentiment&quot;: <span className="text-[#888]">&#123;</span> <span className="text-[#ffbd2e]">&quot;sentiment&quot;</span><span className="text-[#888]">:</span> <span className="text-[#27c93f]">&quot;neutral&quot;</span> <span className="text-[#888]">&#125;,</span></div>
              <div className="ml-3 text-[#4a9eff]">&quot;suggested_action&quot;: <span className="text-[#888]">&#123;</span></div>
              <div className="ml-6">
                <span className="text-[#ffbd2e]">&quot;direction&quot;</span><span className="text-[#888]">:</span> <span className="text-[#ff5f56]">&quot;HOLD&quot;</span><span className="text-[#888]">,</span>
              </div>
              <div className="ml-6">
                <span className="text-[#ffbd2e]">&quot;edge&quot;</span><span className="text-[#888]">:</span> <span className="text-[#4a9eff]">0</span>
              </div>
              <div className="ml-3 text-[#888]">&#125;</div>
              <div className="text-[#888]">&#125;</div>
            </div>
            <div className={`mt-4 text-[#888] transition-opacity duration-300 ${visibleLinesRight >= 5 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#888]">$</span> <span className="text-[#4a9eff]">curl</span> <span className="text-[#e0e0e0]">musashi.bot/api/feed?urgency=critical</span>
            </div>
            <div className={`mt-2 text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 6 ? 'opacity-100' : 'opacity-0'}`}>
              → 3 tweets • geopolitics • urgency: critical
            </div>
            <div className={`mt-4 text-[#888] transition-opacity duration-300 ${visibleLinesRight >= 7 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#888]">$</span> <span className="text-[#4a9eff]">curl</span> <span className="text-[#e0e0e0]">musashi.bot/api/markets/arbitrage</span>
            </div>
            <div className={`mt-2 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded text-[11px] transition-opacity duration-300 ${visibleLinesRight >= 8 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-[#888]">&#123;</div>
              <div className="ml-3 text-[#ffbd2e]">&quot;spread&quot;</div><span className="text-[#888]">:</span> <span className="text-[#4a9eff]">0.08</span><span className="text-[#888]">,</span> <span className="text-[#666]">// 8% profit</span>
              <div className="ml-3 text-[#ffbd2e]">&quot;direction&quot;</div><span className="text-[#888]">:</span> <span className="text-[#27c93f]">&quot;buy_kalshi_sell_poly&quot;</span><span className="text-[#888]">,</span>
              <div className="ml-3 text-[#ffbd2e]">&quot;urgency&quot;</div><span className="text-[#888]">:</span> <span className="text-[#ff5f56]">&quot;high&quot;</span>
              <div className="text-[#888]">&#125;</div>
            </div>
            <div className={`mt-4 text-[#666] italic transition-opacity duration-300 ${visibleLinesRight >= 9 ? 'opacity-100' : 'opacity-0'}`}>
              // Agent parses JSON, executes trades autonomously
            </div>
            <div className={`mt-4 text-[#e0e0e0] transition-opacity duration-300 ${visibleLinesRight >= 10 ? 'opacity-100' : 'opacity-0'}`}>
              No prompts. No chat. Just structured data flowing.
            </div>
            <div className={`mt-2 text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 11 ? 'opacity-100' : 'opacity-0'}`}>
              → 659 markets • 24 tweets/hour • 4 endpoints • real-time
            </div>
            <div className={`mt-5 transition-opacity duration-300 ${visibleLinesRight >= 12 ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[#888]">Agent:</span> <span className="text-[#e0e0e0]">*executes trade on Kalshi*</span>
            </div>
            <div className={`text-[#27c93f] transition-opacity duration-300 ${visibleLinesRight >= 13 ? 'opacity-100' : 'opacity-0'}`}>
              Position opened. Edge captured. Moving to next signal.
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 w-full max-w-[1000px] mt-12">
        <div className="flex flex-col items-center gap-3 p-8 bg-[#111] border border-[#222] rounded-lg">
          <div className="font-grotesk text-[#4a9eff] text-[48px] font-bold tracking-[-1px]">
            659
          </div>
          <div className="font-jetbrains text-[#888] text-xs uppercase tracking-[1px]">
            Markets Live
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 p-8 bg-[#111] border border-[#222] rounded-lg">
          <div className="font-grotesk text-[#4a9eff] text-[48px] font-bold tracking-[-1px]">
            7
          </div>
          <div className="font-jetbrains text-[#888] text-xs uppercase tracking-[1px]">
            API Endpoints
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 p-8 bg-[#111] border border-[#222] rounded-lg">
          <div className="font-grotesk text-[#4a9eff] text-[48px] font-bold tracking-[-1px]">
            71
          </div>
          <div className="font-jetbrains text-[#888] text-xs uppercase tracking-[1px]">
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
