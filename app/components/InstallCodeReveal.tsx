'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

interface InstallCodeRevealProps {
  showCode: boolean;
}

type Platform = 'unix' | 'windows';
type PackageManager = 'npm' | 'pnpm';
type Section = 'install' | 'api-call';

interface CodeRow {
  blocks: Array<{
    comment: string;
    code: string | string[];
  }>;
}

interface EndpointCard {
  method: 'GET' | 'POST';
  title: string;
  purpose: string;
  parameters: string[];
  example: string;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  unix: 'macOS/Linux',
  windows: 'Windows',
};

const PACKAGE_LABELS: Record<PackageManager, string> = {
  npm: 'npm',
  pnpm: 'pnpm',
};

const SECTION_LABELS: Record<Section, string> = {
  install: 'Install',
  'api-call': 'API Call',
};

function getInstallRows(packageManager: PackageManager): CodeRow[] {
  const installCommand = packageManager === 'npm' ? 'npm install' : 'pnpm install';
  const agentRunCommand = packageManager === 'npm' ? 'npm run agent' : 'pnpm agent';
  const agentBuildCommand = packageManager === 'npm' ? 'npm run agent:build' : 'pnpm agent:build';
  const agentStartCommand = packageManager === 'npm' ? 'npm run agent:start' : 'pnpm agent:start';

  return [
    {
      blocks: [
        {
          comment: 'Clone the Musashi repository.',
          code: 'git clone https://github.com/VittorioC13/Musashi.git',
        },
      ],
    },
    {
      blocks: [
        {
          comment: 'Open the project folder.',
          code: 'cd Musashi',
        },
      ],
    },
    {
      blocks: [
        {
          comment: `Install dependencies.`,
          code: installCommand,
        },
      ],
    },
    {
      blocks: [
        {
          comment: `Run the agent.`,
          code: agentRunCommand,
        },
        {
          comment: `Optional: build first, then start.`,
          code: [agentBuildCommand, agentStartCommand],
        },
      ],
    },
  ];
}

function getEndpointCards(platform: Platform): EndpointCard[] {
  const curlBin = platform === 'windows' ? 'curl.exe' : 'curl';
  const baseUrl = 'https://musashi-api.vercel.app';
  const analyzeExample =
    platform === 'windows'
      ? 'curl.exe -X POST "https://musashi-api.vercel.app/api/analyze-text" `\n  -H "Content-Type: application/json" `\n  -d "{\\"text\\":\\"Fed announces rate cut\\",\\"minConfidence\\":0.3,\\"maxResults\\":5}"'
      : `curl -X POST "https://musashi-api.vercel.app/api/analyze-text" \\\n  -H "Content-Type: application/json" \\\n  -d '{"text":"Fed announces rate cut","minConfidence":0.3,"maxResults":5}'`;

  return [
    {
      method: 'GET',
      title: 'GET /api/health',
      purpose: 'Check API health and upstream service status.',
      parameters: ['None'],
      example: `${curlBin} "${baseUrl}/api/health"`,
    },
    {
      method: 'POST',
      title: 'POST /api/analyze-text',
      purpose: 'Analyze text and return matched markets, sentiment, and suggested action.',
      parameters: [
        'text (string, required)',
        'minConfidence (number, optional, default: 0.3)',
        'maxResults (number, optional, default: 5)',
      ],
      example: analyzeExample,
    },
    {
      method: 'GET',
      title: 'GET /api/markets/arbitrage',
      purpose: 'Fetch live cross-platform arbitrage opportunities.',
      parameters: [
        'minSpread (number, optional, default: 0.03)',
        'minConfidence (number, optional, default: 0.5)',
        'limit (number, optional, default: 20, max: 100)',
        'category (string, optional)',
      ],
      example: `${curlBin} "${baseUrl}/api/markets/arbitrage?minSpread=0.03&minConfidence=0.5&limit=10"`,
    },
    {
      method: 'GET',
      title: 'GET /api/markets/movers',
      purpose: 'Fetch markets with significant price changes.',
      parameters: [
        'timeframe (string, optional: 1h | 6h | 24h)',
        'minChange (number, optional, default: 0.05)',
        'limit (number, optional, default: 20, max: 100)',
        'category (string, optional)',
      ],
      example: `${curlBin} "${baseUrl}/api/markets/movers?timeframe=1h&minChange=0.05&limit=10"`,
    },
    {
      method: 'GET',
      title: 'GET /api/feed',
      purpose: 'Retrieve recent analyzed feed items for agents.',
      parameters: [
        'limit (number, optional)',
        'category (string, optional)',
        'minUrgency (string, optional)',
        'since (string, optional, ISO timestamp)',
        'cursor (string, optional)',
      ],
      example: `${curlBin} "${baseUrl}/api/feed?limit=10&category=crypto&minUrgency=high"`,
    },
    {
      method: 'GET',
      title: 'GET /api/feed/stats',
      purpose: 'Retrieve aggregate feed statistics for dashboards and monitoring.',
      parameters: ['None'],
      example: `${curlBin} "${baseUrl}/api/feed/stats"`,
    },
    {
      method: 'GET',
      title: 'GET /api/feed/accounts',
      purpose: 'Retrieve tracked source accounts for the feed.',
      parameters: ['None'],
      example: `${curlBin} "${baseUrl}/api/feed/accounts"`,
    },
  ];
}

export default function InstallCodeReveal({ showCode }: InstallCodeRevealProps) {
  const [platform, setPlatform] = useState<Platform>('unix');
  const [packageManager, setPackageManager] = useState<PackageManager>('npm');
  const [section, setSection] = useState<Section>('install');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const installRows = useMemo(() => getInstallRows(packageManager), [packageManager]);
  const endpointCards = useMemo(() => getEndpointCards(platform), [platform]);
  const getEndpoints = useMemo(() => endpointCards.filter((card) => card.method === 'GET'), [endpointCards]);
  const postEndpoints = useMemo(() => endpointCards.filter((card) => card.method === 'POST'), [endpointCards]);

  useEffect(() => {
    if (!copiedKey) return;

    const timeout = window.setTimeout(() => setCopiedKey(null), 1400);
    return () => window.clearTimeout(timeout);
  }, [copiedKey]);

  async function copyCode(code: string, key: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedKey(key);
    } catch {
      setCopiedKey(null);
    }
  }

  return (
    <div className="absolute right-0 top-0 h-[860px] w-[860px] max-[1200px]:relative max-[1200px]:h-auto max-[1200px]:w-full">
      <div
        className={`absolute inset-0 transition-all duration-700 max-[1200px]:relative max-[1200px]:min-h-[620px] ${showCode ? 'pointer-events-none scale-[0.985] opacity-0 blur-sm' : 'opacity-100'
          }`}
      >
        <div className="relative h-full w-full overflow-hidden bg-black">
          <Image
            src="/images/generated-1771830449125.png"
            alt="Miyamoto Musashi"
            fill
            className="object-cover object-right opacity-65"
            priority
            unoptimized
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(180deg,rgba(10,10,15,0.04),rgba(10,10,15,0.82))]" />

          <div className="absolute left-[60px] top-[88px] max-w-[340px] border border-[#FFFFFF18] bg-[#0A0A0A]/84 px-5 py-4 backdrop-blur-xl transition-transform duration-700 hover:-translate-y-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00FF88]" />
              <span className="font-jetbrains text-[10px] uppercase tracking-[0.24em] text-[#A7F3D0]">Musashi API</span>
            </div>
            <p className="font-grotesk text-[22px] font-semibold leading-tight text-white">A cleaner quick start for customer onboarding.</p>
          </div>

          <div className="absolute left-[92px] top-[252px] border border-[#FFFFFF18] bg-[#0A0A0A]/88 px-4 py-3 backdrop-blur-md transition-all duration-700 hover:-translate-y-1">
            <span className="font-jetbrains text-[9px] text-[#6B7280]">DIRECT ACCESS</span>
            <div className="mt-1 font-jetbrains text-xs text-white">Templates first, endpoints second</div>
          </div>

          <div className="absolute right-[96px] top-[122px] border border-[#00FF88]/20 bg-[#06140E]/90 px-4 py-3 backdrop-blur-md transition-all duration-700 hover:translate-y-1">
            <span className="font-jetbrains text-[10px] text-[#86EFAC]">Live API</span>
            <div className="mt-1 font-jetbrains text-2xl font-bold text-white">24/7</div>
          </div>

          <div className="absolute bottom-[168px] left-[118px] border border-[#FFFFFF15] bg-[#0A0A0A]/88 px-4 py-3 backdrop-blur-md transition-all duration-700 hover:-translate-y-1">
            <span className="font-jetbrains text-[10px] text-[#6B7280]">FOR CUSTOMERS</span>
            <div className="mt-1 font-jetbrains text-xs font-semibold text-white">Repo install or direct REST calls</div>
          </div>

          <div className="absolute bottom-[120px] right-[116px] border border-[#F59E0B]/20 bg-[#17120A]/88 px-4 py-3 backdrop-blur-md transition-all duration-700 hover:translate-y-1">
            <span className="font-jetbrains text-[10px] text-[#FDE68A]">OUTPUT</span>
            <div className="mt-1 font-jetbrains text-sm font-bold text-white">Signals in minutes</div>
          </div>
        </div>
      </div>

      <div
        className={`absolute inset-0 transition-all duration-700 max-[1200px]:relative ${showCode ? 'opacity-100' : 'pointer-events-none translate-x-8 opacity-0'
          }`}
      >
        <div className="relative h-full w-full overflow-hidden border-l border-[#FFFFFF12] bg-[linear-gradient(180deg,#090B12_0%,#0B1017_100%)] p-8 max-[1200px]:min-h-[720px] max-[1200px]:border-l-0 max-[1200px]:border-t max-[1200px]:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_30%)]" />

          <div className="relative flex h-full flex-col gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFFFFF14] bg-[#FFFFFF06] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-[#00FF88]" />
                <span className="font-jetbrains text-[10px] uppercase tracking-[0.24em] text-[#C4F8DE]">API Quick Start</span>
              </div>
              <h3 className="font-grotesk text-[40px] font-bold tracking-[-0.05em] text-white">Connect Agents to Musashi API</h3>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-[#FFFFFF12] bg-[#060A12]/92 shadow-[0_28px_120px_rgba(0,0,0,0.42)]">
              <div className="flex flex-wrap items-center gap-3 border-b border-[#FFFFFF0F] px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
                <div className="ml-2 flex flex-wrap items-center gap-3">
                  <div className="flex rounded-full border border-[#FFFFFF12] bg-[#060A12] p-1">
                    {(['install', 'api-call'] as Section[]).map((item) => {
                      const isActive = item === section;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSection(item)}
                          className={`rounded-full px-4 py-2 font-jetbrains text-[12px] font-medium transition-all duration-300 ${isActive
                            ? 'bg-white text-[#0A0A0F] shadow-[0_10px_30px_rgba(255,255,255,0.08)]'
                            : 'text-[#8C99AD] hover:text-white'
                            }`}
                        >
                          {SECTION_LABELS[item]}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex rounded-full border border-[#FFFFFF12] bg-[#060A12] p-1">
                    {(['unix', 'windows'] as Platform[]).map((item) => {
                      const isActive = item === platform;

                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPlatform(item)}
                          className={`rounded-full px-4 py-2 font-jetbrains text-[12px] font-medium transition-all duration-300 ${isActive
                            ? 'bg-[#00FF88]/14 text-white shadow-[0_0_18px_rgba(0,255,136,0.16)]'
                            : 'text-[#8C99AD] hover:text-white'
                            }`}
                        >
                          {PLATFORM_LABELS[item]}
                        </button>
                      );
                    })}
                  </div>

                  {section === 'install' ? (
                    <div className="flex rounded-full border border-[#FFFFFF12] bg-[#060A12] p-1">
                      {(['npm', 'pnpm'] as PackageManager[]).map((item) => {
                        const isActive = item === packageManager;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setPackageManager(item)}
                            className={`rounded-full px-4 py-2 font-jetbrains text-[12px] font-medium transition-all duration-300 ${isActive
                              ? 'bg-[#F59E0B]/14 text-white shadow-[0_0_18px_rgba(245,158,11,0.12)]'
                              : 'text-[#8C99AD] hover:text-white'
                              }`}
                          >
                            {PACKAGE_LABELS[item]}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              {section === 'install' ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 [scrollbar-color:#273244_transparent] [scrollbar-width:thin]">
                  <div className="space-y-2">
                    {installRows.map((row, index) => {
                      const rowKey = `install-${index}`;

                      return (
                        <div
                          key={rowKey}
                          className="rounded-[22px] border border-[#FFFFFF08] bg-[linear-gradient(180deg,#05080E_0%,#04070C_100%)] px-4 py-2.5 transition-all duration-300 hover:border-[#FFFFFF16] hover:bg-[linear-gradient(180deg,#07101A_0%,#050912_100%)]"
                        >
                          <div className="space-y-1.5">
                            {row.blocks.map((block, blockIndex) => {
                              const blockKey = `${rowKey}-${blockIndex}`;

                              return (
                                <div key={blockKey} className={blockIndex > 0 ? 'pt-0.5' : ''}>
                                  <div className="mb-1.5 font-jetbrains text-[11px] leading-5 text-[#7B889D]">{block.comment}</div>
                                  {(() => {
                                    const commands = Array.isArray(block.code) ? block.code : [block.code];

                                    return (
                                      <div className="space-y-1 rounded-2xl border border-[#FFFFFF08] bg-[#03070D] px-4 py-2">
                                        {commands.map((command, commandIndex) => {
                                          const commandKey = `${blockKey}-command-${commandIndex}`;

                                          return (
                                            <div key={commandKey} className="flex items-center gap-3">
                                              <span className="font-jetbrains text-[13px] text-[#E5E7EB]">$</span>
                                              <code className="flex-1 overflow-x-auto whitespace-pre-wrap font-jetbrains text-[13px] leading-6 text-[#E5E7EB]">
                                                {command}
                                              </code>
                                              <button
                                                type="button"
                                                onClick={() => copyCode(command, commandKey)}
                                                className="rounded-xl border border-[#FFFFFF12] bg-[#FFFFFF06] px-3 py-2 font-jetbrains text-[11px] font-semibold text-white transition-all duration-300 hover:border-[#FFFFFF20] hover:bg-[#FFFFFF10]"
                                              >
                                                {copiedKey === commandKey ? 'Copied' : 'Copy'}
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  })()}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-4 rounded-[24px] border border-[#FFFFFF08] bg-[linear-gradient(180deg,#05080E_0%,#04070C_100%)] px-4 py-4">

                    <div className="space-y-3">
                      {[getEndpoints[0], postEndpoints[0]].filter(Boolean).map((card, index) => {
                        const cardKey = `endpoint-${index}`;
                        const commandLabel = card!.method === 'GET' ? 'quick health check' : 'analyze text';

                        return (
                          <div key={cardKey} className="rounded-[20px] border border-[#FFFFFF08] bg-[#03070D] px-4 py-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">{commandLabel}</div>
                              <span
                                className={`rounded-full border px-2.5 py-1 font-jetbrains text-[10px] font-semibold ${card!.method === 'GET'
                                  ? 'border-[#00FF88]/18 bg-[#00FF88]/10 text-[#A7F3D0]'
                                  : 'border-[#F59E0B]/18 bg-[#F59E0B]/10 text-[#FDE68A]'
                                  }`}
                              >
                                {card!.method}
                              </span>
                            </div>

                            <div className="mt-1.5 flex items-start gap-2 rounded-[18px] border border-[#FFFFFF08] bg-[#02050A] px-3 py-2">
                              <span className="pt-[2px] font-jetbrains text-[12px] leading-5 text-[#E5E7EB]">$</span>
                              <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap font-jetbrains text-[12px] leading-5 text-[#E5E7EB]">
                                <code>{card!.example}</code>
                              </pre>
                              <button
                                type="button"
                                onClick={() => copyCode(card!.example, cardKey)}
                                className="self-start rounded-xl border border-[#FFFFFF12] bg-[#FFFFFF06] px-2.5 py-1.5 font-jetbrains text-[10.5px] font-semibold text-white transition-all duration-300 hover:border-[#FFFFFF20] hover:bg-[#FFFFFF10]"
                              >
                                {copiedKey === cardKey ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-[20px] border border-[#FFFFFF08] bg-[#03070D]">
                      <div className="border-b border-[#FFFFFF08] px-4 py-4">
                        <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">Production API & Staging API</div>
                        <div className="mt-2 font-jetbrains text-[13px] font-semibold text-white">
                          https://musashi-api.vercel.app
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="border-b border-[#FFFFFF08]">
                              <th className="px-4 py-3 text-left font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">Method</th>
                              <th className="px-4 py-3 text-left font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">API Call</th>
                              <th className="px-4 py-3 text-left font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">Parameter</th>
                              <th className="px-4 py-3 text-left font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#6E7D93]">Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {endpointCards.map((card, index) => {
                              const rowKey = `endpoint-table-${index}`;

                              return (
                                <tr key={rowKey} className="border-b border-[#FFFFFF06] align-top last:border-b-0">
                                  <td className="px-4 py-3">
                                    <span
                                      className={`inline-flex rounded-full border px-2.5 py-1 font-jetbrains text-[10px] font-semibold ${card.method === 'GET'
                                        ? 'border-[#00FF88]/18 bg-[#00FF88]/10 text-[#A7F3D0]'
                                        : 'border-[#F59E0B]/18 bg-[#F59E0B]/10 text-[#FDE68A]'
                                        }`}
                                    >
                                      {card.method}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 font-jetbrains text-[11.5px] leading-5 text-white">{card.title.replace(`${card.method} `, '')}</td>
                                  <td className="px-4 py-3 font-jetbrains text-[11px] leading-5 text-[#C4CCD8]">
                                    {card.parameters.map((parameter) => (
                                      <div key={`${rowKey}-${parameter}`}>{parameter}</div>
                                    ))}
                                  </td>
                                  <td className="px-4 py-3 font-jetbrains text-[11px] leading-5 text-[#C4CCD8]">{card.purpose}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>


                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
