'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { FileText, Hash } from 'lucide-react'

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

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SearchIndexItem[]>([])
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Search')

  // 색인 로드
  useEffect(() => {
    fetch(`/search-index.${locale}.json`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [locale])

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === '/' && !open) {
        const target = e.target as HTMLElement
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        )
          return
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open])

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-search', handler)
    return () => window.removeEventListener('open-search', handler)
  }, [])

  function filterResults(
    query: string,
    items: SearchIndexItem[]
  ): SearchIndexItem[] {
    if (!query) return []

    const lower = query.toLowerCase()
    const res = items.filter((i) => {
      const title = i.title?.toLowerCase() || ''
      const desc = i.description?.toLowerCase() || ''
      const tags = i.tags?.map((tag) => tag.toLowerCase()) || []
      return (
        title.includes(lower) ||
        desc.includes(lower) ||
        tags.some((tag) => tag.includes(lower))
      )
    })

    res.sort((a, b) => {
      if (a.type === 'page' && b.type === 'post') return -1
      if (a.type === 'post' && b.type === 'page') return 1
      return 0
    })

    return res
  }

  const filtered = filterResults(query, items)
  const posts = filtered.filter((i) => i.type === 'post')
  const pages = filtered.filter((i) => i.type === 'page')

  function handleSelect(url: string) {
    setOpen(false)
    setQuery('')
    router.push(url)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput
          placeholder={t('placeholder')}
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>{t('noResults')}</CommandEmpty>
          {pages.length > 0 && (
            <CommandGroup heading={t('pages')}>
              {pages.map((item) => (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <Hash className="mr-2 size-4 shrink-0 text-muted-foreground" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {posts.length > 0 && (
            <CommandGroup heading={t('posts')}>
              {posts.map((item) => (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(item.url)}
                >
                  <FileText className="mr-2 size-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm">{item.title}</span>
                    {item.description && (
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
