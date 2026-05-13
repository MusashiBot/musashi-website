'use client'

import { useState } from 'react'

type Props = {
  label?: string
  prompt: string
}

export default function CopyPromptBlock({ label = 'Prompt', prompt }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // older browsers can manually select
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-jetbrains text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-jetbrains text-[11px] font-bold uppercase tracking-[0.18em] text-[#00FF88] transition-opacity hover:opacity-70"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <pre className="max-h-[460px] overflow-y-auto whitespace-pre-wrap bg-[var(--bg-secondary)] p-6 font-jetbrains text-[12px] leading-[1.85] text-white sm:p-7">
          {prompt}
        </pre>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />
      </div>
    </div>
  )
}
