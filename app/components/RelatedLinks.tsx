import Link from 'next/link'

type RelatedLinkItem = {
  href: string
  label: string
}

export default function RelatedLinks({
  title,
  description,
  links,
}: {
  title: string
  description?: string
  links: RelatedLinkItem[]
}) {
  return (
    <section className="border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
      <h2 className="font-grotesk text-[var(--text-primary)] text-[20px] font-bold mb-3">{title}</h2>
      {description ? (
        <p className="font-jetbrains text-[var(--text-secondary)] text-[13px] mb-4">{description}</p>
      ) : null}
      <div className="flex flex-col gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-jetbrains text-[13px] text-[#00FF88] hover:opacity-80"
          >
            → {label}
          </Link>
        ))}
      </div>
    </section>
  )
}
