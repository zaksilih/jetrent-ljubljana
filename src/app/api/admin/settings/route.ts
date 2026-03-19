import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/supabase/auth'

/**
 * GET /api/admin/settings?key=booking_rules
 *
 * Returns a specific site setting.
 */
export async function GET(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = new URL(req.url).searchParams.get('key')
  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
  }

  return NextResponse.json({ setting: data })
}

/**
 * PUT /api/admin/settings
 *
 * Update a site setting. Body: { key, value }
 */
export async function PUT(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { key, value } = body

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ setting: data })
}
