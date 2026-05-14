'use client'

import { SquareCode, Home, NotebookPen, Mail, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@workspace/ui/lib/utils'
import Image from 'next/image'

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

export function RailNav() {
  const pathname = usePathname()
  const t = useTranslations('Nav')

  return (
    <nav
      className="flex h-full flex-col items-center gap-2 py-4"
      aria-label={t('avatarLabel')}
    >
      {/* 로고 */}
      <Link
        href="/"
        className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl font-bold text-primary"
      >
        🖐🏻Hi
      </Link>

      <button
        type="button"
        aria-label={t('search')}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="size-5" />
      </button>

      <div className="my-1 h-px w-10 bg-border" />

      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, icon: Icon, labelKey, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs transition-colors',
                  isActive
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="size-5" />
                <span>{t(labelKey)}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto flex flex-col items-center gap-2">
        {socialLinks.map(({ href, icon: Icon, label }, idx) => (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-110 hover:bg-muted hover:text-foreground focus-visible:scale-110"
          >
            <Icon className="size-4" />
          </a>
        ))}

        <Link
          href="/resume"
          aria-label={t('avatarLabel')}
          className="relative mt-2 block h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:scale-110 hover:ring-primary focus-visible:scale-110"
        >
          <Image
            src="/avatar.png"
            alt={t('avatarLabel')}
            fill
            className="object-cover"
            sizes="40px"
          />
        </Link>
      </div>
    </nav>
  )
}
