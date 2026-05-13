'use client';

import { useState } from 'react';
import { type Bot, EDITORS, type Editor } from '../build/prompts';

type Props = {
  bot: Bot;
  variant: 'teaser' | 'full';
};

const EDITOR_ORDER: Editor[] = ['claude-code', 'codex', 'cursor'];

export default function PromptCard({ bot, variant }: Props) {
  const [editor, setEditor] = useState<Editor>('claude-code');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bot.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // noop — older browsers can fall back to manual select
    }
  };

  if (variant === 'teaser') {
    return (
      <div className="flex flex-col gap-4 border border-[#FFFFFF14] bg-[linear-gradient(180deg,#090D14_0%,#05080D_100%)] p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="font-grotesk text-[24px] leading-none text-[#00FF88]">{bot.emoji}</span>
          <h3 className="font-grotesk text-[22px] font-semibold tracking-[-0.3px] text-white">{bot.title}</h3>
        </div>
        <p className="font-jetbrains text-[13px] leading-[1.7] text-[#A8B0BC]">{bot.tagline}</p>

        <div className="flex flex-wrap gap-1">
          {EDITOR_ORDER.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEditor(e)}
              className={`border px-2.5 py-1 font-jetbrains text-[10px] uppercase tracking-[0.12em] transition-colors ${
                editor === e
                  ? 'border-[#00FF88]/40 bg-[#00FF88]/10 text-[#A7F3D0]'
                  : 'border-[#FFFFFF14] bg-[#FFFFFF06] text-[#8FA0B7] hover:bg-[#FFFFFF10]'
              }`}
            >
              {EDITORS[e].label}
            </button>
          ))}
        </div>

        <div className="border border-[#FFFFFF12] bg-[#04070C] p-3">
          <div className="mb-2 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">How to use</div>
          <p className="font-jetbrains text-[11px] leading-[1.7] text-[#C4CCD8]">{EDITORS[editor].how}</p>
        </div>

        <div className="relative border border-[#FFFFFF12] bg-[#04070C] p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">The prompt</div>
            <button
              type="button"
              onClick={handleCopy}
              className="border border-[#FFFFFF20] bg-[#FFFFFF08] px-2.5 py-1 font-jetbrains text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#FFFFFF14]"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="max-h-[180px] overflow-hidden whitespace-pre-wrap font-jetbrains text-[11px] leading-[1.6] text-[#C6CFDC]">
            {bot.prompt.split('\n').slice(0, 8).join('\n') + '\n…'}
          </pre>
        </div>

        <ul className="flex flex-col gap-1.5">
          {bot.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 font-jetbrains text-[11px] text-[#9CA8B8]">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#00FF88]" />
              {b}
            </li>
          ))}
        </ul>

        <a
          href={`/build#${bot.id}`}
          className="mt-auto inline-flex w-fit border border-[#FFFFFF24] bg-transparent px-4 py-2 font-jetbrains text-[11px] font-bold text-white transition-colors hover:bg-[#FFFFFF10]"
        >
          Full walkthrough →
        </a>
      </div>
    );
  }

  return (
    <article id={bot.id} className="scroll-mt-24 border border-[#FFFFFF14] bg-[#0B0F16] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-grotesk text-[28px] leading-none text-[#00FF88]">{bot.emoji}</span>
        <h2 className="font-grotesk text-[30px] font-semibold tracking-[-0.5px] text-white sm:text-[34px]">
          {bot.title}
        </h2>
        <span className="border border-[#FFFFFF14] bg-[#FFFFFF06] px-2 py-1 font-jetbrains text-[10px] uppercase tracking-[0.14em] text-[#8FA0B7]">
          {bot.endpoint}
        </span>
      </div>
      <p className="mt-3 max-w-[760px] font-jetbrains text-[14px] leading-[1.8] text-[#A8B0BC]">{bot.description}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {EDITOR_ORDER.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEditor(e)}
                className={`border px-3 py-1.5 font-jetbrains text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  editor === e
                    ? 'border-[#00FF88]/40 bg-[#00FF88]/10 text-[#A7F3D0]'
                    : 'border-[#FFFFFF14] bg-[#FFFFFF06] text-[#8FA0B7] hover:bg-[#FFFFFF10]'
                }`}
              >
                {EDITORS[e].label}
              </button>
            ))}
          </div>

          <div className="border border-[#FFFFFF12] bg-[#04070C] p-3">
            <div className="mb-1.5 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">How to use</div>
            <p className="font-jetbrains text-[12px] leading-[1.7] text-[#D1D8E2]">{EDITORS[editor].how}</p>
          </div>

          <div className="relative border border-[#FFFFFF12] bg-[#04070C] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Prompt</div>
              <button
                type="button"
                onClick={handleCopy}
                className="border border-[#FFFFFF20] bg-[#FFFFFF08] px-3 py-1 font-jetbrains text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#FFFFFF14]"
              >
                {copied ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
            <pre className="max-h-[420px] overflow-y-auto whitespace-pre-wrap font-jetbrains text-[12px] leading-[1.7] text-[#D9E0EA]">
              {bot.prompt}
            </pre>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
            <div className="mb-2 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">What you&apos;ll get</div>
            <ul className="flex flex-col gap-2">
              {bot.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 font-jetbrains text-[12px] leading-[1.6] text-[#C4CCD8]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#00FF88]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-[#FFFFFF12] bg-[#070B11] p-4">
            <div className="mb-2 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[#7E899B]">Files scaffolded</div>
            <ul className="flex flex-col gap-1.5">
              {bot.files.map((f) => (
                <li key={f} className="font-jetbrains text-[11px] text-[#9CA8B8]">
                  <code className="text-white">{f}</code>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
