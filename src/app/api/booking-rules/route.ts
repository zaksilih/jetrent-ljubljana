import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { defaultBookingRules, type BookingRules } from '@/lib/booking'

export const dynamic = 'force-dynamic'

/**
 * GET /api/booking-rules
 *
 * Public endpoint — returns current booking rules for calendar validation.
 */
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'booking_rules')
      .single()

    if (error || !data) {
      return NextResponse.json({ rules: defaultBookingRules })
    }

    return NextResponse.json({ rules: data.value as unknown as BookingRules })
  } catch {
    return NextResponse.json({ rules: defaultBookingRules })
  }
}
