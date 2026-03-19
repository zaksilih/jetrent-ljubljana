import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Browser auth client for client components (login, session checks)
export function createAuthBrowser() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
