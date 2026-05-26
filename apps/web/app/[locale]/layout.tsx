import type { Metadata } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import '@workspace/ui/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { RailNav } from '@/components/nav/RailNav'
import { CommandPalette } from '@/components/search/CommandPalette'
import { MobileHeader } from '@/components/nav/MobileHeader'
import { PinnedGNB } from '@/components/nav/PinnedGNB'
import { cn } from '@workspace/ui/lib/utils'
import { routing } from '@/i18n/routing'
import { Analytics } from '@vercel/analytics/next'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hijero.me'
  return {
    metadataBase: new URL(siteUrl),
    title: { default: 'hijero.me', template: '%s | hijero.me' },
    description:
      locale === 'ko'
        ? '풀스택 개발자 Jerome의 개발 블로그'
        : "Jerome's full-stack developer blog",
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        ko: `${siteUrl}/ko`,
        en: `${siteUrl}/en`,
        'x-default': `${siteUrl}/ko`,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      alternateLocale: locale === 'ko' ? ['en_US'] : ['ko_KR'],
      siteName: 'hijero.me',
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        spaceGrotesk.variable
      )}
    >
      <body className="bg-background text-foreground">
        <Analytics />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <CommandPalette />
            <div className="flex min-h-svh">
              <aside
                aria-label="Main navigation"
                className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-20 lg:shrink-0 lg:flex-col"
              >
                <RailNav />
              </aside>
              <div className="flex min-w-0 flex-1 flex-col lg:pl-20">
                <header className="sticky top-0 z-40 lg:hidden">
                  <MobileHeader />
                </header>
                <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
              <div className="hidden lg:block">
                {/* PinnedGNB은 데스크톱에서만 표시 (모바일은 MobileHeader에 통합) */}
                <PinnedGNB />
              </div>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
