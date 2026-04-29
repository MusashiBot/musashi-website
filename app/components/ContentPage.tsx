import JsonLd from './JsonLd'

export type FaqEntry = { q: string; a: string }

export default function ContentPage({
  h1,
  answer,
  children,
  faqs,
  schemas = [],
}: {
  h1: string
  answer: string
  children: React.ReactNode
  faqs: FaqEntry[]
  schemas?: object[]
}) {
  return (
    <div className="flex flex-col w-full bg-[var(--bg-primary)] min-h-screen">
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}

      <header className="flex items-center justify-between w-full px-6 py-4 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] lg:px-[80px]">
        <a href="/" className="font-jetbrains text-[var(--text-primary)] text-[22px] font-bold tracking-[1px]">
          MUSASHI
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/mission" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">MISSION</a>
          <a href="/ai" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">API</a>
          <a href="/pricing" className="font-jetbrains text-[var(--text-secondary)] text-xs font-medium hover:text-[var(--text-primary)] transition-colors">PRICING</a>
        </nav>
        <a href="/install" className="px-5 py-[10px] border border-[#FFFFFF40] bg-transparent hover:bg-[var(--overlay-light)] transition-colors">
          <span className="font-jetbrains text-[var(--text-primary)] text-xs font-bold">Install</span>
        </a>
      </header>

      <main className="flex flex-col items-center w-full px-6 py-12 lg:px-[120px] lg:py-[60px]">
        <article className="w-full max-w-[860px]">
          <h1 className="font-grotesk text-[var(--text-primary)] text-[36px] font-bold tracking-[-1px] leading-[1.15] mb-6 lg:text-[48px]">
            {h1}
          </h1>

          <p className="font-jetbrains text-[var(--text-secondary)] text-[15px] leading-[1.75] mb-10 border-l-2 border-[#00FF88] pl-4 max-w-[640px]">
            {answer}
          </p>

          <div className="prose-content flex flex-col gap-10">
            {children}
          </div>

          {faqs.length > 0 && (
            <section className="mt-16 pt-10 border-t border-[var(--border-primary)]">
              <h2 className="font-grotesk text-[var(--text-primary)] text-[28px] font-bold mb-8">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-6">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                    <h3 className="font-grotesk text-[var(--text-primary)] text-[17px] font-semibold mb-3">{q}</h3>
                    <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] leading-[1.75]">{a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <footer className="flex w-full flex-col gap-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-10 lg:px-[120px]">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <a href="/" className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">MUSASHI</a>
          <nav className="flex gap-6">
            <a href="/mission" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Mission</a>
            <a href="/ai" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">API Docs</a>
            <a href="/pricing" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="/privacy" className="font-jetbrains text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Privacy</a>
          </nav>
        </div>
        <span className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} Musashi — Built for agents. Powered by prediction markets.
        </span>
      </footer>
    </div>
  )
}
