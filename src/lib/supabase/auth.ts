import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

// ── Server client (route handlers, server actions) ───────────

export function createAuthServer() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll fails in Server Components — middleware handles refresh
          }
        },
      },
    }
  )
}

// ── Admin verification helper ────────────────────────────────

/**
 * Verifies that the request comes from an authenticated admin user.
 * If ADMIN_EMAILS env var is set, checks against the allow-list.
 * Returns the user object or null.
 */
export async function verifyAdmin() {
  const supabase = createAuthServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null

  // Optional allow-list (comma-separated emails in env var)
  const adminEmails = process.env.ADMIN_EMAILS
    ?.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails && adminEmails.length > 0) {
    if (!adminEmails.includes(user.email?.toLowerCase() || '')) {
      return null
    }
  }

  return user
}
