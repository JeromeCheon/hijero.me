'use client'

import { useEffect, useState } from 'react'
import {
  SquareCode,
  Home,
  NotebookPen,
  Mail,
  Menu,
  Sun,
  Moon,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@workspace/ui/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'

// lucide-react v1.14에는 브랜드 아이콘 미포함 — 인라인 SVG로 대체
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const navItems = [
  { href: '/', icon: Home, labelKey: 'home' as const, exact: true },
  { href: '/tech', icon: SquareCode, labelKey: 'tech' as const, exact: false },
  { href: '/life', icon: NotebookPen, labelKey: 'life' as const, exact: false },
]

const socialLinks = [
  {
    href: process.env.NEXT_PUBLIC_GITHUB_URL ?? '#',
    icon: GithubIcon,
    label: 'GitHub',
  },
  {
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? '#',
    icon: LinkedinIcon,
    label: 'LinkedIn',
  },
  {
    href: `mailto:${process.env.NEXT_PUBLIC_EMAIL_URL ?? ''}`,
    icon: Mail,
    label: 'Email',
  },
]

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
      <Link
        href="/"
        className="flex items-center font-bold text-primary"
        aria-label="홈으로 이동"
      >
        🖐🏻Hi
      </Link>

      <div className="flex-1" />

      <div className="flex items-center gap-1 rounded-lg border border-border bg-background/80 p-1">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
          }
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
