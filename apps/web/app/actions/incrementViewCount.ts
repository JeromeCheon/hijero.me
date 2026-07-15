'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { createAdminClient } from '@/lib/supabase/admin'

async function buildFingerprint(
  ip: string,
  ua: string,
  lang: string
): Promise<string> {
  const raw = `${ip}|${ua}|${lang}`
  const encoded = new TextEncoder().encode(raw)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function incrementViewCount(
  locale: string,
  category: string,
  slug: string
): Promise<void> {
  try {
    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const ua = headerList.get('user-agent') ?? ''
    const lang = headerList.get('accept-language') ?? ''

    const fingerprint = await buildFingerprint(ip, ua, lang)

    const supabase = createAdminClient()
    const { data: didIncrement } = await supabase.rpc('increment_post_view', {
      p_slug: slug,
      p_viewer_fingerprint: fingerprint,
    })

    // 정적으로 생성된 포스트 페이지는 조회수가 실제로 증가했을 때만 재생성한다
    if (didIncrement) {
      revalidatePath(`/${locale}/${category}/${slug}`)
    }
  } catch {
    // 조회수 실패가 페이지 렌더링을 막으면 안 됨
  }
}
