import type { PageObjectResponse } from '@notionhq/client'

export function extractTitle(
  properties: PageObjectResponse['properties'],
  key: string
): string {
  const prop = properties[key]
  if (prop?.type !== 'title') return ''
  return prop.title.map((b) => b.plain_text).join('')
}

export function extractRichText(
  properties: PageObjectResponse['properties'],
  key: string
): string {
  const prop = properties[key]
  if (prop?.type !== 'rich_text') return ''
  return prop.rich_text.map((b) => b.plain_text).join('')
}

export function extractMultiSelect(
  properties: PageObjectResponse['properties'],
  key: string
): string[] {
  const prop = properties[key]
  if (prop?.type !== 'multi_select') return []
  return prop.multi_select.map((option) => option.name)
}

export function extractDate(
  properties: PageObjectResponse['properties'],
  key: string
): { start: string; end: string | null } | null {
  const prop = properties[key]
  if (prop?.type !== 'date') return null
  if (!prop.date) return null
  return {
    start: prop.date.start,
    end: prop.date.end ?? null,
  }
}
