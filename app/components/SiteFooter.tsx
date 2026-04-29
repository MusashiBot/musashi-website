import Link from 'next/link'

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

type FooterGroup = {
  title: string
  links: FooterLink[]
}

type SiteFooterProps = {
  variant?: 'compact' | 'extended'
  description?: string
  tagline?: string
  compactLinks?: FooterLink[]
  groups?: FooterGroup[]
  className?: string
}

const DEFAULT_COMPACT_LINKS: FooterLink[] = [
  { label: 'Mission', href: '/mission' },
  { label: 'API Docs', href: '/ai' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Privacy', href: '/privacy' },
]

const DEFAULT_EXTENDED_GROUPS: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Mission', href: '/mission' },
      { label: 'API Docs', href: '/ai' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Twitter', href: 'https://twitter.com/musashimarket', external: true },
      { label: 'GitHub', href: 'https://github.com/VittorioC13/musashi-bot', external: true },
    ],
  },
]

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = 'font-jetbrains text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]'

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  )
}

export default function SiteFooter({
  variant = 'compact',
  description = 'AI intelligence service for trading bots. Automated feed API with sentiment analysis and trading signals. Chrome extension for monitoring.',
  tagline = 'Built for agents. Powered by prediction markets.',
  compactLinks = DEFAULT_COMPACT_LINKS,
  groups = DEFAULT_EXTENDED_GROUPS,
  className = '',
}: SiteFooterProps) {
  if (variant === 'extended') {
    return (
      <footer className={`flex w-full flex-col gap-6 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-12 sm:px-6 lg:px-[120px] ${className}`.trim()}>
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">
              MUSASHI
            </Link>
            <span className="max-w-[400px] font-jetbrains text-xs leading-relaxed text-[var(--text-tertiary)]">
              {description}
            </span>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <span className="font-jetbrains text-[10px] font-bold uppercase tracking-[1.5px] text-[var(--text-muted)]">
                  {group.title}
                </span>
                <nav className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <FooterLinkItem key={`${group.title}-${link.href}`} link={link} />
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[1px] w-full bg-[var(--border-primary)]" />

        <div className="flex w-full flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span className="font-jetbrains text-[11px] font-normal text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} Musashi
          </span>
          <span className="font-jetbrains text-[11px] font-normal text-[var(--text-tertiary)]">
            {tagline}
          </span>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`flex w-full flex-col gap-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-6 py-10 lg:px-[120px] ${className}`.trim()}>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="font-jetbrains text-base font-semibold tracking-[1px] text-[var(--text-primary)]">
          MUSASHI
        </Link>
        <nav className="flex flex-wrap gap-6">
          {compactLinks.map((link) => (
            <FooterLinkItem key={`compact-${link.href}`} link={link} />
          ))}
        </nav>
      </div>
      <span className="font-jetbrains text-[11px] text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Musashi — {tagline}
      </span>
    </footer>
  )
}
