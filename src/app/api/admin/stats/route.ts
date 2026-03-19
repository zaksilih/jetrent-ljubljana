import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/supabase/auth'

/**
 * GET /api/admin/stats
 *
 * Returns dashboard summary statistics.
 */
export async function GET() {
  const user = await verifyAdmin()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()

  // Run all queries in parallel
  const [
    pendingRes,
    confirmedRes,
    upcomingRes,
    revenueRes,
    recentBookingsRes,
  ] = await Promise.all([
    // Count pending bookings
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending_payment'),

    // Count confirmed bookings
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'confirmed'),

    // Count upcoming rentals (confirmed, start_date in the future)
    supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .gte('start_date', new Date().toISOString().split('T')[0]),

    // Total revenue (confirmed + completed bookings)
    supabase
      .from('bookings')
      .select('total_price')
      .in('status', ['confirmed', 'completed']),

    // Last 5 bookings
    supabase
      .from('bookings')
      .select(`
        id, reference, start_date, end_date, total_price, status, created_at,
        customers(first_name, last_name),
        jetskis(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const totalRevenue = (revenueRes.data || []).reduce(
    (sum, b) => sum + Number(b.total_price),
    0
  )

  return NextResponse.json({
    stats: {
      pending: pendingRes.count || 0,
      confirmed: confirmedRes.count || 0,
      upcoming: upcomingRes.count || 0,
      totalRevenue,
    },
    recentBookings: recentBookingsRes.data || [],
  })
}
