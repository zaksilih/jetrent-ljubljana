import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Browser client — used in client components (lazy-initialised to avoid
// crashing when env vars aren't available during static page generation)
let _supabase: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing Supabase env vars. Copy .env.local.example → .env.local and fill in your project credentials.'
      )
    }

    _supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}
