import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Server-only admin client — bypasses RLS, used in API routes and server actions
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase env vars. Copy .env.local.example → .env.local and fill in your project credentials.'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}
