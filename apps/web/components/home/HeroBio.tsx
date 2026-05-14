import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { BadgeCheck } from 'lucide-react'
import { HeroBioActions } from './HeroBioActions'

export async function HeroBio() {
  const t = await getTranslations('Hero')

  const buyMeACoffeeUrl = process.env.NEXT_PUBLIC_BUY_ME_COFFEE_URL ?? '#'
  const calChatUrl = process.env.NEXT_PUBLIC_CAL_CHAT_URL ?? '#'

  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      <div className="relative h-48">
        <Image src="/cover.png" alt="Cover" fill />
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative z-10 -mt-12 h-24 w-24 shrink-0">
            <Image
              src="/avatar.png"
              alt={t('name')}
              width={96}
              height={96}
              className="h-full w-full rounded-full border-background object-cover"
            />
            <span
              aria-label="Verified"
              className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#1D9BF0] text-white"
            >
              <BadgeCheck className="size-4" />
            </span>
          </div>
          <div className="flex-1 sm:pb-1">
            <h1 className="text-2xl font-bold tracking-tight">{t('name')}</h1>
            <p className="mt-0.5 text-muted-foreground">{t('job')}</p>
          </div>
          <HeroBioActions
            buyMeACoffeeUrl={buyMeACoffeeUrl}
            calChatUrl={calChatUrl}
            coffeeChatLabel={t('coffeeChatLabel')}
            viewDetailLabel={t('viewDetail')}
          />
        </div>

        {/* Experience */}
        <div className="mt-5">
          <p className="text-sm font-medium">{t('about')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('experienceLabel')}
          </p>
        </div>
      </div>
    </section>
  )
}
