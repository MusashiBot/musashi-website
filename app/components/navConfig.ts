export type NavMatchMode = 'exact' | 'prefix'

export type NavChild = {
  label: string
  href: string
  matchMode?: NavMatchMode
}

export type NavSection = {
  label: string
  href?: string
  matchMode?: NavMatchMode
  children?: NavChild[]
}

export const NAV_CONFIG: NavSection[] = [
  {
    label: 'Product',
    children: [
      { label: 'Mission', href: '/mission', matchMode: 'exact' },
      { label: 'Pricing', href: '/pricing', matchMode: 'exact' },
    ],
  },
  {
    label: 'Developers',
    children: [
      { label: 'Docs Hub', href: '/docs', matchMode: 'prefix' },
      { label: 'API Console', href: '/ai', matchMode: 'exact' },
      { label: 'Trading Bot Quickstart', href: '/docs/trading-bot-quickstart', matchMode: 'exact' },
      { label: 'Polymarket API', href: '/docs/polymarket-api', matchMode: 'exact' },
    ],
  },
  {
    label: 'Markets',
    href: '/arb',
    matchMode: 'prefix',
  },
  {
    label: 'Learn',
    children: [
      { label: 'Blog', href: '/blog', matchMode: 'prefix' },
      { label: 'Automate Polymarket Trading', href: '/blog/how-to-automate-polymarket-trading', matchMode: 'exact' },
      { label: 'Polymarket vs Kalshi Arbitrage', href: '/blog/polymarket-vs-kalshi-arbitrage', matchMode: 'exact' },
      { label: 'Compare', href: '/compare', matchMode: 'prefix' },
      { label: 'Best Prediction Market API', href: '/compare/best-prediction-market-api', matchMode: 'exact' },
    ],
  },
  {
    label: 'Privacy',
    href: '/privacy',
    matchMode: 'exact',
  },
]

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export function isNavHrefActive(pathname: string, href: string, matchMode: NavMatchMode = 'prefix') {
  const normalizedPath = normalizePathname(pathname)
  const normalizedHref = normalizePathname(href)

  if (matchMode === 'exact' || normalizedHref === '/') {
    return normalizedPath === normalizedHref
  }

  return normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`)
}

export function isNavSectionActive(section: NavSection, pathname: string) {
  if (section.href) {
    return isNavHrefActive(pathname, section.href, section.matchMode)
  }

  return section.children?.some((child) => isNavHrefActive(pathname, child.href, child.matchMode)) ?? false
}
