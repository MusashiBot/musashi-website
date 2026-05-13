'use client'

import { useState } from 'react'

type Props = {
  code: string
}

export default function CopyableCodeBlock({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="group relative max-w-[640px]">
      <pre className="overflow-x-auto whitespace-pre bg-[var(--bg-secondary)] px-5 py-3.5 font-jetbrains text-[12.5px] leading-[1.85] text-white">
        {code}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy command"
        className="absolute right-2 top-2 border border-transparent px-2 py-1 font-jetbrains text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] opacity-0 transition-all hover:text-[#00FF88] focus:opacity-100 group-hover:opacity-100"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
