import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/supabase/auth'

/**
 * GET /api/admin/blocked-dates
 *
 * Returns all blocked date entries.
 */
export async function GET() {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*, jetskis(name)')
    .order('start_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ blockedDates: data })
}

/**
 * POST /api/admin/blocked-dates
 *
 * Block dates for a jet ski (maintenance, etc.).
 * Body: { jetskiId: string, startDate: string, endDate: string, reason?: string }
 */
export async function POST(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { jetskiId, startDate, endDate, reason } = body

  if (!jetskiId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('blocked_dates')
    .insert({
      jetski_id: jetskiId,
      start_date: startDate,
      end_date: endDate,
      reason: reason || 'Vzdrževanje',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ blockedDate: data })
}

/**
 * DELETE /api/admin/blocked-dates?id=uuid
 *
 * Remove a blocked date entry.
 */
export async function DELETE(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = new URL(req.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { error } = await supabase
    .from('blocked_dates')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
