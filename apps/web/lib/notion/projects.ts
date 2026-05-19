import { cache } from 'react'
import { isFullPageOrDataSource, isFullPage } from '@notionhq/client'
import type { Project } from '@/lib/resume/types'
import { getNotionClient } from './client'
import {
  extractTitle,
  extractRichText,
  extractMultiSelect,
  extractDate,
} from './mappers'
import { fetchBlocksRecursive, blocksToMarkdown } from './blocks'

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const isRateLimit =
        err instanceof Error && err.message.includes('rate_limited')
      if (isRateLimit && attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        )
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

function formatPeriod(
  date: { start: string; end: string | null } | null
): string {
  if (!date) return ''
  const fmt = (s: string) => {
    const d = new Date(s)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`
  }
  return date.end ? `${fmt(date.start)} ~ ${fmt(date.end)}` : fmt(date.start)
}

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    const notion = getNotionClient()
    const dbId = process.env.NOTION_PORTFOLIO_DB_ID

    if (!dbId) return []

    const response = await withRetry(() =>
      notion.dataSources.query({ data_source_id: dbId })
    )

    // isFullPageOrDataSource → isFullPage 체이닝으로 PageObjectResponse로 타입 좁힘
    return response.results
      .filter(isFullPageOrDataSource)
      .filter(isFullPage)
      .sort((a, b) => {
        const aStart = extractDate(a.properties, 'Date')?.start ?? ''
        const bStart = extractDate(b.properties, 'Date')?.start ?? ''
        return bStart.localeCompare(aStart)
      })
      .map((page) => ({
        id: page.id,
        name: extractTitle(page.properties, 'Name'),
        company: extractRichText(page.properties, 'From'),
        description: extractRichText(page.properties, 'Description'),
        tech: extractMultiSelect(page.properties, 'Tags'),
        period: formatPeriod(extractDate(page.properties, 'Date')),
        markdownContent: '',
      }))
  } catch (err) {
    console.error('[notion] getProjects 오류:', err)
    return []
  }
})

export const getProjectById = cache(
  async (id: string): Promise<Project | null> => {
    try {
      const notion = getNotionClient()

      const [page, blocks] = await Promise.all([
        withRetry(() => notion.pages.retrieve({ page_id: id })),
        withRetry(() => fetchBlocksRecursive(notion, id)),
      ])

      if (!isFullPage(page)) return null

      const markdownContent = blocksToMarkdown(blocks)

      return {
        id: page.id,
        name: extractTitle(page.properties, 'Name'),
        company: extractRichText(page.properties, 'From'),
        description: extractRichText(page.properties, 'Description'),
        tech: extractMultiSelect(page.properties, 'Tags'),
        period: formatPeriod(extractDate(page.properties, 'Date')),
        markdownContent,
      }
    } catch (err) {
      console.error('[notion] getProjectById 오류:', err)
      return null
    }
  }
)
