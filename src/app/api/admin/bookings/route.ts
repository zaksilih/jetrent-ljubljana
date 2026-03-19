import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/supabase/auth'

/**
 * GET /api/admin/bookings
 *
 * Returns all bookings with customer and jetski info.
 * Protected by Supabase Auth.
 */
export async function GET() {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers(first_name, last_name, email, phone, country),
      jetskis(name, slug),
      payments(amount, status, payment_type)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ bookings: data })
}

/**
 * PATCH /api/admin/bookings
 *
 * Update booking status.
 * Body: { bookingId: string, status: BookingStatus, adminNotes?: string }
 */
export async function PATCH(req: NextRequest) {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { bookingId, status, adminNotes } = body

  if (!bookingId || !status) {
    return NextResponse.json({ error: 'Missing bookingId or status' }, { status: 400 })
  }

  const validStatuses = ['pending_payment', 'confirmed', 'cancelled', 'expired', 'completed']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = createServerClient()

  const updateData: Record<string, unknown> = { status }
  if (adminNotes !== undefined) updateData.admin_notes = adminNotes

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
