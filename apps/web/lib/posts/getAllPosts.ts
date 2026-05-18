// Server Component에서만 import할 것 — 'use server' 없이 서버 전용 파일
// 이 파일은 Node.js fs 모듈을 사용하므로 Client Component에서 import 불가
import { cache } from 'react'
import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import readingTime from 'reading-time'

import { frontmatterSchema } from './types'
import type { Post } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'posts')

// 동일 요청 내 locale별 디스크 읽기를 1회로 제한 (generateMetadata, Page, RelatedPosts 중복 방지)
const readAllPosts = cache(function readAllPostsRaw(locale: string): Post[] {
  const localeDir = path.join(CONTENT_DIR, locale)

  if (!fs.existsSync(localeDir)) {
    return []
  }

  const files = fs
    .readdirSync(localeDir)
    .filter((file) => file.endsWith('.mdx'))

  const posts: Post[] = []

  for (const file of files) {
    const filePath = path.join(localeDir, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    // Zod 스키마로 frontmatter 검증
    const parsed = frontmatterSchema.safeParse(data)
    if (!parsed.success) {
      console.warn(
        `[getAllPosts] frontmatter 검증 실패: ${file}`,
        parsed.error.flatten().fieldErrors
      )
      continue
    }

    const fm = parsed.data

    // reading-time: stats.minutes는 소수점 포함 → Math.ceil로 올림
    const stats = readingTime(content)
    const readingTimeMin = Math.ceil(stats.minutes)

    posts.push({
      ...fm,
      readingTime: readingTimeMin,
      locale,
      content,
    })
  }

  return posts
})

export function getAllPosts(
  locale: string,
  category?: 'tech' | 'life'
): Post[] {
  const posts = readAllPosts(locale)

  // category 필터링
  const filtered =
    category != null ? posts.filter((p) => p.category === category) : posts

  // publishedAt 기준 최신순 정렬
  return filtered.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
