import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/email
 *
 * Placeholder for sending transactional emails.
 * In production, integrate with Resend, SendGrid, or Supabase Edge Functions.
 *
 * For now, logs the email data to the server console.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // TODO: Integrate with an email service (e.g., Resend, SendGrid)
    // For now, log to console
    console.log('📧 Email notification:', {
      type: body.type,
      to: body.email,
      reference: body.reference,
      bookingId: body.bookingId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
