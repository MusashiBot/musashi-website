import type { Metadata } from 'next'

export const SITE_URL = 'https://musashi.bot'
export const SITE_NAME = 'MUSASHI'
export const SITE_DESCRIPTION =
  'Free prediction market API for trading bots. Track Polymarket and Kalshi prices, arbitrage spreads, and X/Twitter market signals in one feed.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/generated-1771830449125.png`

export type FaqSchemaEntry = {
  q: string
  a: string
}

type CreateMetadataInput = {
  title: Metadata['title']
  description: string
  path: string
  ogTitle?: string
  ogDescription?: string
  type?: 'website' | 'article'
  keywords?: string[]
  noIndex?: boolean
}

type BreadcrumbItem = {
  name: string
  path: string
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function createPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  type = 'website',
  keywords,
  noIndex = false,
}: CreateMetadataInput): Metadata {
  const resolvedOgTitle =
    ogTitle ??
    (typeof title === 'string'
      ? `${title} | ${SITE_NAME}`
      : typeof title === 'object' && title && 'absolute' in title && title.absolute
        ? title.absolute
        : SITE_NAME)
  const resolvedOgDescription = ogDescription ?? description

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url: absoluteUrl(path),
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  }
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  }
}

export function createFaqSchema(faqs: FaqSchemaEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  }
}

export function createPublisherSchema() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  }
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    sameAs: ['https://twitter.com/musashimarket', 'https://github.com/MusashiBot'],
  }
}

export function createSoftwareSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  }
}
