'use client'

import { useState } from 'react'

type Props = {
  title: string
  prompt: string
}

export default function MasterPromptCard({ title, prompt }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // older browsers can manually select via the View prompt drawer
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5">
          <span className="font-grotesk text-[15px] font-semibold tracking-[-0.2px] text-[var(--text-primary)] sm:text-[17px]">
            {title}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-2 font-jetbrains text-[11.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors hover:border-[#00FF88]/40 hover:text-[#A7F3D0]"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied' : 'Copy prompt'}
          </button>
        </div>
      </div>

      <details className="group">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-jetbrains text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]">
          <span className="inline group-open:hidden">View prompt</span>
          <span className="hidden group-open:inline">Hide prompt</span>
          <span className="text-[10px] transition-transform group-open:rotate-90">▸</span>
        </summary>
        <pre className="mt-3 max-h-[440px] overflow-y-auto whitespace-pre-wrap bg-[var(--bg-secondary)] p-5 font-jetbrains text-[12px] leading-[1.85] text-[var(--text-secondary)] sm:p-6">
          {prompt}
        </pre>
      </details>
    </div>
  )
}
