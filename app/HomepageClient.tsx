'use client';

import { useEffect, useRef, useState } from 'react';
import TerminalDemo from "./TerminalDemo";
import SmoothScrollLink from "./components/SmoothScrollLink";
import FAQ from "./components/FAQ";
import InstallCodeReveal from "./components/InstallCodeReveal";
import useCompactLayout from "./hooks/useCompactLayout";

const mobileInstallSteps = [
  {
    label: 'Clone',
    value: 'git clone https://github.com/VittorioC13/Musashi.git',
  },
  {
    label: 'Install',
    value: 'cd Musashi && npm install',
  },
  {
    label: 'Run',
    value: 'npm run agent',
  },
];

export default function HomepageClient() {
  const [showInstallCode, setShowInstallCode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingInstallScroll, setPendingInstallScroll] = useState(false);
  const isCompactLayout = useCompactLayout();
  const installSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pendingInstallScroll) return;

    const frameId = window.requestAnimationFrame(() => {
      installSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingInstallScroll(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pendingInstallScroll]);

  const handleInstallClick = () => {
    if (isCompactLayout) {
      setMobileMenuOpen(false);
      setPendingInstallScroll(true);
      return;
    }

    setShowInstallCode((current) => !current);
  };

  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)]">
      <header className="relative z-50 flex items-center justify-between w-full gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-4 sm:px-6 lg:px-[80px]">
        <div className="font-jetbrains text-xl font-bold tracking-[1px] text-[var(--text-primary)] sm:text-[22px]">
          MUSASHI
        </div>
        <nav className={`${isCompactLayout ? 'hidden' : 'hidden md:flex'} items-center gap-8`}>
          <a href="/mission" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">MISSION</a>
          <a href="/ai" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">API</a>
          <a href="/pricing" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">PRICING</a>
          <a href="/privacy" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">PRIVACY</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleInstallClick}
            className="border border-[#FFFFFF40] bg-transparent px-4 py-[10px] transition-colors hover:bg-[var(--overlay-light)] sm:px-5"
          >
            <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">
              {isCompactLayout ? 'Install' : showInstallCode ? 'Close' : 'Install'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className={`flex h-10 w-10 items-center justify-center border border-[#FFFFFF24] bg-[#FFFFFF08] ${isCompactLayout ? '' : 'md:hidden'}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span className="flex flex-col gap-[4px]">
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${mobileMenuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`}></span>
              <span className={`block h-[1.5px] w-4 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${mobileMenuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`}></span>
            </span>
          </button>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div className={`fixed inset-0 z-40 bg-[#05070D]/88 backdrop-blur-md ${isCompactLayout ? '' : 'md:hidden'}`}>
          <div className="absolute inset-x-4 top-[76px] rounded-[28px] border border-[#FFFFFF14] bg-[linear-gradient(180deg,#0B1018_0%,#080C12_100%)] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="mb-5 flex items-center justify-between border-b border-[#FFFFFF10] pb-4">
              <div>
                <div className="font-jetbrains text-[10px] uppercase tracking-[0.22em] text-[#8C99AD]">Mobile Menu</div>
                <div className="mt-2 font-grotesk text-[28px] leading-none text-white">Navigate fast.</div>
              </div>
              <span className="rounded-full border border-[#00FF88]/20 bg-[#00FF88]/10 px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#A7F3D0]">
                responsive
              </span>
            </div>

            <nav className="flex flex-col gap-3">
              <a href="/mission" onClick={() => setMobileMenuOpen(false)} className="border border-[#FFFFFF12] bg-[#FFFFFF06] px-4 py-4 font-jetbrains text-xs font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#FFFFFF10]">
                MISSION
              </a>
              <a href="/ai" onClick={() => setMobileMenuOpen(false)} className="border border-[#FFFFFF12] bg-[#FFFFFF06] px-4 py-4 font-jetbrains text-xs font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#FFFFFF10]">
                API DOCS
              </a>
              <a href="/pricing" onClick={() => setMobileMenuOpen(false)} className="border border-[#FFFFFF12] bg-[#FFFFFF06] px-4 py-4 font-jetbrains text-xs font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#FFFFFF10]">
                PRICING
              </a>
              <a href="/privacy" onClick={() => setMobileMenuOpen(false)} className="border border-[#FFFFFF12] bg-[#FFFFFF06] px-4 py-4 font-jetbrains text-xs font-semibold tracking-[0.08em] text-white transition-colors hover:bg-[#FFFFFF10]">
                PRIVACY
              </a>
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-white px-4 py-4 text-center"
              >
                <span className="font-jetbrains text-[11px] font-bold text-[#0A0A0F]">SETUP</span>
              </button>
              <SmoothScrollLink
                targetId="see-the-difference"
                className="border border-[#FFFFFF18] bg-transparent px-4 py-4 text-center transition-colors hover:bg-[#FFFFFF08]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="font-jetbrains text-[11px] font-bold text-white">DEMO</span>
              </SmoothScrollLink>
            </div>
          </div>
        </div>
      ) : null}

      <section className={`relative w-full overflow-hidden bg-[var(--bg-primary)] ${isCompactLayout ? '' : 'lg:h-[860px]'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#0A0A0F] to-[#0F0F1A] opacity-80" />

        <div className={`relative z-10 flex w-full max-w-[560px] flex-col gap-5 px-4 py-12 sm:px-6 sm:py-16 ${isCompactLayout ? '' : 'lg:absolute lg:left-[80px] lg:top-[100px] lg:w-[500px] lg:gap-7 lg:px-0 lg:py-0'}`}>
          <div className={`flex items-center gap-2 ${isCompactLayout ? '' : 'lg:hidden'}`}>
            <span className="h-2 w-2 rounded-full bg-[#00FF88]"></span>
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.22em] text-[#A7F3D0]">Agent-ready prediction market intel</span>
          </div>

          <h1 className="font-jetbrains text-[34px] font-normal leading-[1.02] tracking-[-2px] text-[var(--text-primary)] sm:text-[42px] lg:text-[52px]">
            Trade the <br />[Tweets]
          </h1>

          <p className="max-w-[27rem] font-jetbrains text-[14px] leading-[1.65] text-[var(--text-secondary)] sm:text-[15px] sm:leading-[1.7]">
            In the future, your agents scroll and trade for you.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-[var(--text-primary)] px-8 py-[14px] text-center transition-opacity hover:opacity-90"
              >
                <span className="font-jetbrains text-xs font-bold text-[var(--bg-primary)]">
                  {isCompactLayout ? 'Install' : showInstallCode ? 'Hide Setup' : 'Install'}
                </span>
              </button>
              <SmoothScrollLink targetId="see-the-difference" className="border border-[var(--border-lighter)] bg-[var(--overlay-light)] px-8 py-[14px] text-center transition-colors hover:bg-[var(--overlay-lighter)]">
                <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">See Demo</span>
              </SmoothScrollLink>
            </div>
            <span className="font-jetbrains text-[11px] font-normal text-[var(--text-tertiary)]">
              Free • No Rate Limits • REST API + Agent SDK
            </span>
          </div>

          <div className={`flex flex-wrap gap-2 ${isCompactLayout ? '' : 'lg:hidden'}`}>
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              900+ markets live
            </span>
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              71 tracked accounts
            </span>
            <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-2 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#C4CCD8]">
              7 api endpoints
            </span>
          </div>

          <div className={`grid grid-cols-2 gap-3 ${isCompactLayout ? '' : 'lg:hidden'}`}>
            <div className="border border-[#FFFFFF15] bg-[#0A0A0A]/70 px-4 py-3 backdrop-blur-md">
              <span className="block font-jetbrains text-[10px] font-medium text-[#666]">LIVE MARKETS</span>
              <span className="block font-jetbrains text-sm font-bold text-white">659</span>
            </div>
            <div className="border border-[#FFFFFF15] bg-[#0A0A0A]/70 px-4 py-3 backdrop-blur-md">
              <span className="block font-jetbrains text-[10px] font-medium text-[#666]">TRACKED ACCOUNTS</span>
              <span className="block font-jetbrains text-sm font-bold text-white">71 sources</span>
            </div>
          </div>

          <div
            ref={installSectionRef}
            className={`rounded-[28px] border border-[#FFFFFF14] bg-[#060A12]/88 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-5 ${isCompactLayout ? '' : 'lg:hidden'}`}
          >
            <div>
              <h2 className="font-grotesk text-[24px] font-semibold leading-none text-white sm:text-[26px]">
                Install Musashi
              </h2>
            </div>
            <p className="mt-4 font-jetbrains text-[13px] leading-[1.7] text-[var(--text-secondary)]">
              Clone the repo, install dependencies, then run <code className="font-jetbrains text-white">npm run agent</code>.
            </p>

            <div className="mt-5 space-y-3 border-t border-[#FFFFFF10] pt-5">
              {mobileInstallSteps.map((step) => (
                <div key={step.label} className="rounded-2xl border border-[#FFFFFF10] bg-[#03070D] px-4 py-3">
                  <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">{step.label}</div>
                  <code className="mt-2 block whitespace-pre-wrap font-jetbrains text-[12px] leading-5 text-white">
                    {step.value}
                  </code>
                </div>
              ))}

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="/ai" className="border border-[#FFFFFF18] bg-[#FFFFFF08] px-4 py-3 text-center transition-colors hover:bg-[#FFFFFF10]">
                  <span className="font-jetbrains text-[11px] font-bold text-white">Open API Docs</span>
                </a>
                <a href="/install" className="border border-[#FFFFFF18] bg-transparent px-4 py-3 text-center transition-colors hover:bg-[#FFFFFF08]">
                  <span className="font-jetbrains text-[11px] font-bold text-white">Install Page</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={isCompactLayout ? 'hidden' : 'hidden lg:block'}>
          <InstallCodeReveal showCode={showInstallCode} />
        </div>
      </section>

      <div id="see-the-difference">
        <TerminalDemo compactLayout={isCompactLayout} />
      </div>

      <section className="flex w-full flex-col items-center gap-12 bg-[var(--bg-primary)] px-4 py-16 sm:px-6 lg:px-[120px] lg:py-[80px]">
        <h2 className="font-grotesk text-[32px] font-bold tracking-[-1px] text-[var(--text-primary)] text-center md:text-[42px]">
          Built for Trading Bots
        </h2>

        <div className="grid w-full max-w-[1100px] grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 fill-[#00FF88]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8l-5-5zM5 19V5h10v4h4v10H5z"/>
              </svg>
              <h3 className="font-grotesk text-xl font-semibold text-[var(--text-primary)]">
                Automated Feed System
              </h3>
            </div>
            <p className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]">
              Monitors 71 high-signal Twitter accounts across 8 categories and matches tweets to markets every 2 minutes.
            </p>
            <div className="flex flex-col gap-2">
              <span className="font-jetbrains text-xs text-[var(--text-tertiary)]">Categories tracked:</span>
              <div className="flex flex-wrap gap-2">
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">CRYPTO</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">POLITICS</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">ECONOMICS</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">TECH</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">SPORTS</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">GEOPOLITICS</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">FINANCE</span>
                <span className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-2 py-1 font-jetbrains text-[10px] text-[var(--text-secondary)]">BREAKING NEWS</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 fill-[#00FF88]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              <h3 className="font-grotesk text-xl font-semibold text-[var(--text-primary)]">
                Trading Signals
              </h3>
            </div>
            <p className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]">
              AI-powered sentiment analysis classifies each tweet as bullish, bearish, or neutral with confidence scores, direction, edge, and urgency.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-4 py-3">
                <span className="font-jetbrains text-xs font-bold text-[#00FF88]">BULLISH</span>
                <div className="mt-1 font-jetbrains text-[10px] text-[var(--text-tertiary)]">Long signal</div>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-4 py-3">
                <span className="font-jetbrains text-xs font-bold text-[#FF4444]">BEARISH</span>
                <div className="mt-1 font-jetbrains text-[10px] text-[var(--text-tertiary)]">Short signal</div>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-4 py-3">
                <span className="font-jetbrains text-xs font-bold text-[#9CA3AF]">NEUTRAL</span>
                <div className="mt-1 font-jetbrains text-[10px] text-[var(--text-tertiary)]">Hold position</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 fill-[#00FF88]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
              <h3 className="font-grotesk text-xl font-semibold text-[var(--text-primary)]">
                Arbitrage Detection
              </h3>
            </div>
            <p className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]">
              Cross-platform price discrepancy detection between Polymarket and Kalshi with filters for spread, confidence, and category.
            </p>
            <div className="flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--overlay-lighter)] p-3">
              <span className="font-jetbrains text-xs text-[var(--text-secondary)]">Example: Polymarket 63% → Kalshi 70% =</span>
              <span className="font-jetbrains text-xs font-bold text-[#00FF88]">7% spread</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 fill-[#00FF88]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 13h2v8H3v-8zm4-8h2v16H7V5zm4 4h2v12h-2V9zm4-4h2v16h-2V5zm4 7h2v9h-2v-9z"/>
              </svg>
              <h3 className="font-grotesk text-xl font-semibold text-[var(--text-primary)]">
                Market Movers
              </h3>
            </div>
            <p className="font-jetbrains text-sm leading-[1.8] text-[var(--text-secondary)]">
              Tracks major price changes using stored price history and real-time polling to surface 1 hour and 24 hour movement.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-3 py-2">
                <span className="font-jetbrains text-[10px] text-[var(--text-tertiary)]">1H CHANGE</span>
                <span className="ml-2 font-jetbrains text-sm font-bold text-[#00FF88]">+12%</span>
              </div>
              <div className="border border-[var(--border-primary)] bg-[var(--overlay-lighter)] px-3 py-2">
                <span className="font-jetbrains text-[10px] text-[var(--text-tertiary)]">24H CHANGE</span>
                <span className="ml-2 font-jetbrains text-sm font-bold text-[#FF4444]">-8%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      <section className="flex w-full min-h-[360px] border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-20 sm:px-6 lg:min-h-[500px] lg:px-[120px] lg:py-[120px]">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-10">
          <h2 className="font-grotesk text-[42px] font-bold leading-[1.1] tracking-[-2px] text-[var(--text-primary)] text-center sm:text-[56px] lg:text-[72px]">
            Built for AI agents
          </h2>

          <a href="/ai" className="mx-auto bg-[var(--text-primary)] px-8 py-4 transition-opacity hover:opacity-90 sm:px-12 sm:py-5">
            <span className="font-jetbrains text-xs font-bold text-[var(--bg-primary)] sm:text-sm">START BUILDING — FREE</span>
          </a>
        </div>
      </section>

      <footer className="flex w-full flex-col gap-6 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-12 sm:px-6 lg:px-[120px]">
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">
              MUSASHI
            </span>
            <span className="max-w-[400px] font-jetbrains text-xs leading-relaxed text-[var(--text-tertiary)]">
              AI intelligence service for trading bots. Automated feed API with sentiment analysis and trading signals. Chrome extension for monitoring.
            </span>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <div className="flex flex-col gap-3">
              <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)]">
                Product
              </span>
              <nav className="flex flex-col gap-2">
                <a href="/mission" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">Mission</a>
                <a href="/ai" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">API Docs</a>
                <a href="/pricing" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">Pricing</a>
                <a href="/privacy" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">Privacy</a>
              </nav>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)]">
                Community
              </span>
              <nav className="flex flex-col gap-2">
                <a href="https://twitter.com/musashimarket" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">Twitter</a>
                <a href="https://github.com/VittorioC13/musashi-bot" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">GitHub</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-[var(--border-primary)]" />

        <div className="flex w-full flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span className="font-jetbrains text-[11px] font-normal text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} Musashi
          </span>
          <span className="font-jetbrains text-[11px] font-normal text-[var(--text-tertiary)]">
            Built for agents. Powered by prediction markets.
          </span>
        </div>
      </footer>
    </div>
  );
}
