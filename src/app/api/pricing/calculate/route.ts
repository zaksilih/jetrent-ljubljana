import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { calculatePriceWithRules } from '@/lib/booking'
import { parseISO, differenceInDays } from 'date-fns'

/**
 * GET /api/pricing/calculate?start=YYYY-MM-DD&end=YYYY-MM-DD&jetskiId=xxx&deliveryKm=0
 *
 * Public endpoint — calculates booking price using pricing rules from DB.
 * Falls back to the jet ski's default daily prices if no rules match.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')
  const jetskiId = searchParams.get('jetskiId')
  const deliveryKm = parseFloat(searchParams.get('deliveryKm') || '0')

  if (!start || !end || !jetskiId) {
    return NextResponse.json(
      { error: 'Missing start, end, or jetskiId parameter' },
      { status: 400 }
    )
  }

  const startDate = parseISO(start)
  const endDate = parseISO(end)

  if (differenceInDays(endDate, startDate) < 1) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Fetch jet ski
  const { data: jetski, error: jsError } = await supabase
    .from('jetskis')
    .select('daily_price_low, daily_price_high, daily_price_short')
    .eq('id', jetskiId)
    .eq('is_active', true)
    .single()

  if (jsError || !jetski) {
    return NextResponse.json({ error: 'Jet ski not found' }, { status: 404 })
  }

  // Fetch active pricing rules that overlap with the booking range
  const { data: rules } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', end)
    .gte('end_date', start)
    .order('priority', { ascending: false })

  const result = calculatePriceWithRules(
    startDate,
    endDate,
    {
      low: Number(jetski.daily_price_low),
      high: Number(jetski.daily_price_high),
      short: Number(jetski.daily_price_short),
    },
    rules || [],
    deliveryKm
  )

  // Return PriceBreakdown with rateSegments (strip verbose dailyRates array)
  const { dailyRates: _dr, ...price } = result

  return NextResponse.json({ price })
}
