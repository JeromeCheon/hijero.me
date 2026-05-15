'use server'

import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'

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

export async function incrementViewCount(slug: string): Promise<void> {
  try {
    const headerList = await headers()
    const ip =
      headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const ua = headerList.get('user-agent') ?? ''
    const lang = headerList.get('accept-language') ?? ''

    const fingerprint = await buildFingerprint(ip, ua, lang)

    const supabase = createClient()
    await supabase.rpc('increment_post_view', {
      p_slug: slug,
      p_viewer_fingerprint: fingerprint,
    })
  } catch {
    // 조회수 실패가 페이지 렌더링을 막으면 안 됨
  }
}
