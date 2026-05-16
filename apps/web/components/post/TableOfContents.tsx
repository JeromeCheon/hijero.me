'use client'

import { useEffect, useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'

import type { Heading } from '@/lib/posts/extractHeadings'

interface TableOfContentsProps {
  headings: Heading[]
}

// 포스트 본문 헤딩 기반 목차 컴포넌트 — xl 이상 우측 sticky 배치
export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    // IntersectionObserver로 현재 화면에 보이는 섹션 감지
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        // 뷰포트 상단 20% 지난 후부터 감지, 하단 70% 이전까지
        rootMargin: '-20% 0% -70% 0%',
      }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="목차"
      className="sticky top-8 hidden max-h-[calc(100vh-4rem)] w-56 shrink-0 self-start overflow-y-auto xl:block"
    >
      <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        목차
      </p>
      <ul className="space-y-1.5 text-sm">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cn(
                'block truncate rounded py-0.5 transition-colors hover:text-foreground',
                level === 3 && 'pl-4',
                activeId === id
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
