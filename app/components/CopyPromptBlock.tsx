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
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-sm">
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] px-5 py-3">
        <div className="font-jetbrains text-[11px] uppercase tracking-[0.14em] text-[#6E7D93]">
          {label}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="border border-[#00FF88]/40 bg-[#00FF88]/10 px-3 py-1 font-jetbrains text-[11px] font-bold uppercase tracking-[0.12em] text-[#A7F3D0] transition-colors hover:bg-[#00FF88]/20"
        >
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
      </div>
      <pre className="max-h-[520px] overflow-y-auto whitespace-pre-wrap p-5 font-jetbrains text-[12px] leading-[1.7] text-white">
        {prompt}
      </pre>
    </div>
  )
}
