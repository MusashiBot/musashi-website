import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

const SITE_URL = 'https://musashi.bot'

const staticRoutes = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/mission', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/ai', priority: 0.9, changeFrequency: 'weekly' as const },
  { url: '/pricing', priority: 0.6, changeFrequency: 'monthly' as const },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/data-license', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/install', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/arb', priority: 0.9, changeFrequency: 'hourly' as const },
  { url: '/blog/how-to-automate-polymarket-trading', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/blog/polymarket-vs-kalshi-arbitrage', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/compare/best-prediction-market-api', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/docs/polymarket-api', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/docs/trading-bot-quickstart', priority: 0.8, changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    lastModified,
    changeFrequency,
    priority,
  }))

  let arbEntries: MetadataRoute.Sitemap = []
  const marketsPath = path.join(process.cwd(), 'data', 'markets.json')
  if (fs.existsSync(marketsPath)) {
    const markets: Array<{ slug: string }> = JSON.parse(fs.readFileSync(marketsPath, 'utf-8'))
    arbEntries = markets.map(({ slug }) => ({
      url: `${SITE_URL}/arb/${slug}`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))
  }

  return [...staticEntries, ...arbEntries]
}
