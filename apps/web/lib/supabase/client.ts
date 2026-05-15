'use client'

import { createClient as _createClient } from '@supabase/supabase-js'

import type { Database } from './database.types'

/**
 * Client Component 전용 Supabase 클라이언트.
 * Server Component / Route Handler에서는 server.ts를 사용한다.
 */
export const createClient = () =>
  _createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
