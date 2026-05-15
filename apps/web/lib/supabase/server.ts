import { createClient as _createClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

/**
 * Server Component / Route Handler 전용 Supabase 클라이언트.
 * view count는 public 데이터이므로 anon key로 충분하다.
 * Client Component에서는 client.ts를 사용한다.
 */
export const createClient = () =>
  _createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
