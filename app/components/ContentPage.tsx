import JsonLd from './JsonLd'
import Header from './Header'
import SiteFooter from './SiteFooter'

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

      <Header />

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

      <SiteFooter />
    </div>
  )
}
