import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import '@workspace/ui/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { RailNav } from '@/components/nav/RailNav'
import { MobileHeader } from '@/components/nav/MobileHeader'
import { PinnedGNB } from '@/components/nav/PinnedGNB'
import { cn } from '@workspace/ui/lib/utils'
import { routing } from '@/i18n/routing'

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
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex min-h-svh">
              <aside
                aria-label="Main navigation"
                className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-20 lg:shrink-0 lg:flex-col"
              >
                <RailNav />
              </aside>
              <div className="flex min-w-0 flex-1 flex-col lg:pl-20">
                <header className="lg:hidden">
                  <MobileHeader />
                </header>
                <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
                  {children}
                </main>
              </div>
              <PinnedGNB />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
