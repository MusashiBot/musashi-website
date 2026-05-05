import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { absoluteUrl } from './lib/seo'

type Market = {
  slug: string
  last_updated: string
}

type StaticRoute = {
  url: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  sourcePath?: string
  useMarketDataTimestamp?: boolean
}

const staticRoutes: StaticRoute[] = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly', sourcePath: 'app/page.tsx' },
  { url: '/mission', priority: 0.7, changeFrequency: 'monthly', sourcePath: 'app/mission/page.tsx' },
  { url: '/pricing', priority: 0.6, changeFrequency: 'monthly', sourcePath: 'app/pricing/page.tsx' },
  { url: '/install', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/install/page.tsx' },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly', sourcePath: 'app/privacy/page.tsx' },
  { url: '/data-license', priority: 0.3, changeFrequency: 'yearly', sourcePath: 'app/data-license/page.tsx' },
  { url: '/ai', priority: 0.7, changeFrequency: 'weekly', sourcePath: 'app/ai/page.tsx' },
  { url: '/docs', priority: 0.9, changeFrequency: 'weekly', sourcePath: 'app/docs/page.tsx' },
  { url: '/docs/polymarket-api', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/docs/polymarket-api/page.tsx' },
  { url: '/docs/trading-bot-quickstart', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/docs/trading-bot-quickstart/page.tsx' },
  { url: '/blog', priority: 0.7, changeFrequency: 'weekly', sourcePath: 'app/blog/page.tsx' },
  { url: '/blog/how-to-automate-polymarket-trading', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/blog/how-to-automate-polymarket-trading/page.tsx' },
  { url: '/blog/polymarket-vs-kalshi-arbitrage', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/blog/polymarket-vs-kalshi-arbitrage/page.tsx' },
  { url: '/compare', priority: 0.7, changeFrequency: 'monthly', sourcePath: 'app/compare/page.tsx' },
  { url: '/compare/best-prediction-market-api', priority: 0.8, changeFrequency: 'monthly', sourcePath: 'app/compare/best-prediction-market-api/page.tsx' },
  { url: '/arb', priority: 0.9, changeFrequency: 'hourly', useMarketDataTimestamp: true },
]

function readMarkets() {
  const marketsPath = path.join(process.cwd(), 'data', 'markets.json')
  if (!fs.existsSync(marketsPath)) {
    return { markets: [] as Market[], dataLastModified: new Date() }
  }

  const fileContents = fs.readFileSync(marketsPath, 'utf-8')
  const markets = JSON.parse(fileContents) as Market[]
  const dataLastModified = fs.statSync(marketsPath).mtime
  return { markets, dataLastModified }
}

function getFileLastModified(sourcePath: string) {
  return fs.statSync(path.join(process.cwd(), sourcePath)).mtime
}

function parseDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? fallback : parsed
}

export default function sitemap(): MetadataRoute.Sitemap {
  const { markets, dataLastModified } = readMarkets()
  const latestMarketUpdate = markets.reduce((latest, market) => {
    const next = parseDate(market.last_updated, dataLastModified)
    return next > latest ? next : latest
  }, dataLastModified)

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.url),
    lastModified:
      route.useMarketDataTimestamp
        ? latestMarketUpdate
        : getFileLastModified(route.sourcePath ?? 'app/page.tsx'),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const arbEntries: MetadataRoute.Sitemap = markets.map(({ slug, last_updated }) => ({
    url: absoluteUrl(`/arb/${slug}`),
    lastModified: parseDate(last_updated, latestMarketUpdate),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }))

  return [...staticEntries, ...arbEntries]
}
