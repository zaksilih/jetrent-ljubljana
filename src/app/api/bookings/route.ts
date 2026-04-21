import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { calculatePriceWithRules } from '@/lib/booking'
import { differenceInDays, parseISO, addHours } from 'date-fns'

/**
 * POST /api/bookings
 *
 * Creates a new booking with status "pending_payment".
 * Expects JSON body:
 * {
 *   jetskiId: string
 *   startDate: "YYYY-MM-DD"
 *   endDate: "YYYY-MM-DD"
 *   customer: { firstName, lastName, email, phone, country }
 *   pickupLocation?: string
 *   customerMessage?: string
 *   deliveryKm?: number
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jetskiId, startDate, endDate, customer, pickupLocation, customerMessage, deliveryKm } = body

    // Validate required fields
    if (!jetskiId || !startDate || !endDate || !customer) {
      return NextResponse.json({ error: 'Manjkajoči podatki.' }, { status: 400 })
    }

    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone || !customer.country) {
      return NextResponse.json({ error: 'Manjkajoči podatki stranke.' }, { status: 400 })
    }

    const start = parseISO(startDate)
    const end = parseISO(endDate)
    const numDays = differenceInDays(end, start)

    if (numDays < 1) {
      return NextResponse.json({ error: 'Neveljavni datumi.' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1. Get jet ski
    const { data: jetski, error: jsError } = await supabase
      .from('jetskis')
      .select('*')
      .eq('id', jetskiId)
      .eq('is_active', true)
      .single()

    if (jsError || !jetski) {
      return NextResponse.json({ error: 'Jet ski ni najden.' }, { status: 404 })
    }

    // 2. Calculate price using pricing rules
    // Fetch active pricing rules for the date range
    const { data: pricingRules } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .lte('start_date', endDate)
      .gte('end_date', startDate)
      .order('priority', { ascending: false })

    const price = calculatePriceWithRules(start, end, {
      low: Number(jetski.daily_price_low),
      high: Number(jetski.daily_price_high),
      short: Number(jetski.daily_price_short),
    }, pricingRules || [], deliveryKm || 0)

    // 3. Create or find customer
    // Check if customer with same email exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer.email.toLowerCase().trim())
      .single()

    let customerId: string

    if (existingCustomer) {
      customerId = existingCustomer.id
      // Update customer info
      await supabase
        .from('customers')
        .update({
          first_name: customer.firstName.trim(),
          last_name: customer.lastName.trim(),
          phone: customer.phone.trim(),
          country: customer.country.trim(),
        })
        .eq('id', customerId)
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          first_name: customer.firstName.trim(),
          last_name: customer.lastName.trim(),
          email: customer.email.toLowerCase().trim(),
          phone: customer.phone.trim(),
          country: customer.country.trim(),
        })
        .select('id')
        .single()

      if (custError || !newCustomer) {
        return NextResponse.json({ error: 'Napaka pri ustvarjanju stranke.' }, { status: 500 })
      }
      customerId = newCustomer.id
    }

    // 4. Create booking (trigger will auto-generate reference & check overlap)
    const expiresAt = addHours(new Date(), 24).toISOString()

    const { data: booking, error: bookError } = await supabase
      .from('bookings')
      .insert({
        jetski_id: jetskiId,
        customer_id: customerId,
        start_date: startDate,
        end_date: endDate,
        num_days: price.numDays,
        daily_rate: price.dailyRate,
        rental_total: price.rentalTotal,
        delivery_km: price.deliveryKm,
        delivery_fee: price.deliveryFee,
        total_price: price.totalPrice,
        deposit_amount: price.depositAmount,
        security_deposit: price.securityDeposit,
        status: 'pending_payment',
        pickup_location: pickupLocation || null,
        customer_message: customerMessage || null,
        expires_at: expiresAt,
      })
      .select('id, reference')
      .single()

    if (bookError) {
      // If it's an overlap error from our DB trigger
      if (bookError.message.includes('overlap')) {
        return NextResponse.json(
          { error: 'Izbrani datumi so že zasedeni. Poskusite druge datume.' },
          { status: 409 }
        )
      }
      console.error('Booking creation error:', bookError)
      return NextResponse.json({ error: 'Napaka pri ustvarjanju rezervacije.' }, { status: 500 })
    }

    // 5. Create pending payment record
    await supabase.from('payments').insert({
      booking_id: booking.id,
      amount: price.depositAmount,
      payment_type: 'deposit',
      payment_method: 'bank_transfer',
      status: 'pending',
      reference_number: booking.reference,
    })

    // 6. Send confirmation email (fire-and-forget)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_created',
          bookingId: booking.id,
          email: customer.email.toLowerCase().trim(),
          reference: booking.reference,
          customerName: `${customer.firstName} ${customer.lastName}`,
          startDate,
          endDate,
          numDays: price.numDays,
          jetskiName: jetski.name,
          totalPrice: price.totalPrice,
          depositAmount: price.depositAmount,
          rateSegments: price.rateSegments,
          deliveryFee: price.deliveryFee,
          deliveryKm: price.deliveryKm,
          securityDeposit: price.securityDeposit,
        }),
      })
    } catch {
      // Email failure shouldn't block booking creation
      console.error('Failed to send confirmation email')
    }

    return NextResponse.json({
      id: booking.id,
      reference: booking.reference,
      status: 'pending_payment',
    })
  } catch (err) {
    console.error('Booking API error:', err)
    return NextResponse.json(
      { error: 'Nepričakovana napaka.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bookings?ref=J4Y-2026-00001
 *
 * Fetch a booking by reference number (public, limited fields).
 */
export async function GET(req: NextRequest) {
  const ref = new URL(req.url).searchParams.get('ref')
  if (!ref) {
    return NextResponse.json({ error: 'Missing ref parameter' }, { status: 400 })
  }

  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, reference, start_date, end_date, num_days,
      daily_rate, rental_total, delivery_fee, total_price,
      deposit_amount, security_deposit, status, created_at,
      jetskis(name, image_url)
    `)
    .eq('reference', ref.toUpperCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Rezervacija ni najdena.' }, { status: 404 })
  }

  return NextResponse.json({ booking: data })
}
