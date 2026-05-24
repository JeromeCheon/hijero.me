'use client'

import { useEffect, useState } from 'react'
import { Menu, Sun, Moon, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import Image from 'next/image'

import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { navItems, socialLinks } from '@/config/nav'
import { cn } from '@workspace/ui/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('Nav')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    // pathname 변경(라우터 이벤트)을 React state에 동기화하는 의도적 패턴
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const toggleLocale = () =>
    router.replace(pathname, { locale: locale === 'ko' ? 'en' : 'ko' })

  return (
    <header
      className={cn(
        'flex h-14 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-sm'
      )}
    >
      <Link href="/" aria-label="홈으로 이동">
        <Image
          src="/logo.png"
          alt="hijero"
          width={32}
          height={32}
          className="rounded-full"
        />
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1">
        <button
          type="button"
          aria-label={t('search')}
          onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
          }
          suppressHydrationWarning
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label={t('openMenu')}
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" id="mobile-nav-sheet">
          <SheetHeader>
            <SheetTitle className="sr-only">{t('openMenu')}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-2 pt-4">
            <ul className="flex flex-col gap-1">
              {navItems.map(({ href, icon: Icon, labelKey, exact }) => {
                const isActive = exact
                  ? pathname === href
                  : pathname.startsWith(href)
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                        isActive
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className="size-5 shrink-0" />
                      <span>{t(labelKey)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 flex items-center gap-2 px-3">
              {socialLinks.map(({ href, icon: Icon, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
