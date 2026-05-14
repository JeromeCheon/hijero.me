'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { cn } from '@workspace/ui/lib/utils'

export function PinnedGNB() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const { resolvedTheme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === 'ko' ? 'en' : 'ko' })

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-1 rounded-xl border border-border bg-background/80 p-1 shadow-sm backdrop-blur-sm'
      )}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={
          resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
        }
        className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {!mounted ? (
          <span className="h-4 w-4" aria-hidden />
        ) : resolvedTheme === 'dark' ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>
      <button
        type="button"
        onClick={toggleLocale}
        aria-label={locale === 'ko' ? '영어로 전환' : '한국어로 전환'}
        className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {locale === 'ko' ? (
          <span className="size-4">EN</span>
        ) : (
          <span className="size-4">KO</span>
        )}
      </button>
    </div>
  )
}
