import { z } from 'zod'

export type Series = {
  title: string
  slug: string
  order: number
}

export interface Post {
  slug: string
  title: string
  description: string
  category: 'tech' | 'life'
  tags: string[]
  publishedAt: string // ISO 8601 문자열
  readingTime: number // 분 단위 (소수점 올림)
  featured?: boolean
  series?: Series
  locale: string
  content: string
}

// frontmatter 전용 Zod 스키마 (content, locale, readingTime 제외)
export const frontmatterSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(['tech', 'life']),
  tags: z.array(z.string()).default([]),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, 'YYYY-MM-DD 형식이어야 합니다'),
  featured: z.boolean().optional(),
  series: z
    .object({
      title: z.string(),
      slug: z.string(),
      order: z.number(),
    })
    .optional(),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>
