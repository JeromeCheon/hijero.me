import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import matter from 'gray-matter'

type SearchIndexItem = {
  type: 'post' | 'page'
  slug: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  publishedAt?: string
  url: string
  locale: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const WEB_ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(WEB_ROOT, 'content', 'posts')
const PUBLIC_DIR = path.join(WEB_ROOT, 'public')

const LOCALES = ['ko', 'en'] as const
type Locale = (typeof LOCALES)[number]

const NAV_ITEMS: Record<Locale, SearchIndexItem[]> = {
  ko: [
    {
      type: 'page',
      slug: 'home',
      title: '홈',
      url: '/ko/',
      locale: 'ko',
    },
    {
      type: 'page',
      slug: 'tech',
      title: 'Tech',
      url: '/ko/tech',
      locale: 'ko',
    },
    {
      type: 'page',
      slug: 'life',
      title: 'Life',
      url: '/ko/life',
      locale: 'ko',
    },
    {
      type: 'page',
      slug: 'resume',
      title: '이력서',
      url: '/ko/resume',
      locale: 'ko',
    },
  ],
  en: [
    {
      type: 'page',
      slug: 'home',
      title: 'Home',
      url: '/en/',
      locale: 'en',
    },
    {
      type: 'page',
      slug: 'tech',
      title: 'Tech',
      url: '/en/tech',
      locale: 'en',
    },
    {
      type: 'page',
      slug: 'life',
      title: 'Life',
      url: '/en/life',
      locale: 'en',
    },
    {
      type: 'page',
      slug: 'resume',
      title: 'Resume',
      url: '/en/resume',
      locale: 'en',
    },
  ],
}

function buildIndexForLocale(locale: Locale): SearchIndexItem[] {
  const localeDir = path.join(CONTENT_DIR, locale)
  const items: SearchIndexItem[] = []

  if (fs.existsSync(localeDir)) {
    const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.mdx'))

    for (const file of files) {
      const filePath = path.join(localeDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)

      const slug =
        (data.slug as string | undefined) ?? file.replace(/\.mdx$/, '')
      const category = data.category as string | undefined
      const url =
        category === 'tech' || category === 'life'
          ? `/${locale}/${category}/${slug}`
          : `/${locale}/tech/${slug}`

      items.push({
        type: 'post',
        slug,
        title: (data.title as string | undefined) ?? slug,
        description: data.description as string | undefined,
        category,
        tags: (data.tags as string[] | undefined) ?? [],
        publishedAt: data.publishedAt as string | undefined,
        url,
        locale,
      })
    }
  }

  return [...items, ...NAV_ITEMS[locale]]
}

function main(): void {
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  }

  for (const locale of LOCALES) {
    const items = buildIndexForLocale(locale)
    const outputPath = path.join(PUBLIC_DIR, `search-index.${locale}.json`)
    fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8')
    console.log(`[build-search-index] ${outputPath} — ${items.length} items`)
  }
}

main()
