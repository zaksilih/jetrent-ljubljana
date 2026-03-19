import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * GET /api/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
 *
 * Returns jet skis available for the given date range,
 * excluding those with conflicting bookings or blocked dates.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing start or end query parameter' },
      { status: 400 }
    )
  }

  const supabase = createServerClient()

  // 1. Get all active jet skis
  const { data: allJetSkis, error: jsError } = await supabase
    .from('jetskis')
    .select('*')
    .eq('is_active', true)

  if (jsError) {
    return NextResponse.json({ error: jsError.message }, { status: 500 })
  }

  // 2. Get bookings that overlap [start, end)
  const { data: conflictingBookings } = await supabase
    .from('bookings')
    .select('jetski_id')
    .in('status', ['confirmed', 'pending_payment'])
    .lt('start_date', end)
    .gt('end_date', start)

  // 3. Get blocked dates that overlap [start, end)
  const { data: conflictingBlocks } = await supabase
    .from('blocked_dates')
    .select('jetski_id')
    .lt('start_date', end)
    .gt('end_date', start)

  const unavailableIds = new Set([
    ...(conflictingBookings || []).map((b) => b.jetski_id),
    ...(conflictingBlocks || []).map((b) => b.jetski_id),
  ])

  const available = (allJetSkis || []).filter((js) => !unavailableIds.has(js.id))

  return NextResponse.json({ jetskis: available })
}
