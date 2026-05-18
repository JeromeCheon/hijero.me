'use client'

import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { Link, usePathname } from '@/i18n/navigation'
import { navItems, socialLinks } from '@/config/nav'
import { cn } from '@workspace/ui/lib/utils'

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
          href="#"
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
