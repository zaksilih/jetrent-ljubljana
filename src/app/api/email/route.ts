import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { bankDetails } from '@/lib/booking'
import { format, parseISO } from 'date-fns'
import { sl } from 'date-fns/locale'

function formatDateSl(dateStr: string): string {
  return format(parseISO(dateStr), 'd. MMMM yyyy', { locale: sl })
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat('sl-SI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

interface RateSegment {
  days: number
  rate: number
  label: string
}

function buildBookingEmail(body: {
  reference: string
  customerName: string
  startDate: string
  endDate: string
  numDays: number
  jetskiName: string
  totalPrice: number
  depositAmount: number
  rateSegments?: RateSegment[]
  deliveryFee?: number
  deliveryKm?: number
  securityDeposit?: number
}): string {
  const rentalRows = body.rateSegments && body.rateSegments.length > 1
    ? body.rateSegments.map(s =>
        `<tr><td style="padding:8px 12px;color:#6b7280">Najem: ${s.days} dni × ${formatEUR(s.rate)}</td><td style="padding:8px 12px;text-align:right;font-weight:500">${formatEUR(s.days * s.rate)}</td></tr>`
      ).join('')
    : `<tr><td style="padding:8px 12px;color:#6b7280">Najem: ${body.numDays} dni</td><td style="padding:8px 12px;text-align:right;font-weight:500">${formatEUR(body.totalPrice - (body.deliveryFee || 0))}</td></tr>`

  const deliveryRow = body.deliveryFee && body.deliveryFee > 0
    ? `<tr><td style="padding:8px 12px;color:#6b7280">Dostava: ${body.deliveryKm} km × 0,70 €</td><td style="padding:8px 12px;text-align:right;font-weight:500">${formatEUR(body.deliveryFee)}</td></tr>`
    : ''

  return `
<!DOCTYPE html>
<html lang="sl">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px">
    <!-- Header -->
    <div style="text-align:center;padding:24px 0">
      <h1 style="margin:0;font-size:24px;color:#0e7490">🚤 Jet4You</h1>
    </div>

    <!-- Success banner -->
    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <div style="font-size:32px;margin-bottom:8px">✅</div>
      <h2 style="margin:0 0 4px;font-size:20px;color:#065f46">Rezervacija potrjena!</h2>
      <p style="margin:0;color:#047857;font-size:14px">Vaša rezervacija je bila uspešno oddana.</p>
    </div>

    <!-- Reference -->
    <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:12px;color:#0e7490;text-transform:uppercase;letter-spacing:1px">Referenčna številka</p>
      <p style="margin:0;font-size:24px;font-weight:bold;font-family:monospace;color:#164e63;letter-spacing:2px">${escapeHtml(body.reference)}</p>
      <p style="margin:8px 0 0;font-size:11px;color:#6b7280">Status: Čaka na plačilo</p>
    </div>

    <!-- Booking details -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:24px">
      <div style="padding:16px;border-bottom:1px solid #f3f4f6">
        <h3 style="margin:0;font-size:14px;color:#374151">Podrobnosti rezervacije</h3>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr>
          <td style="padding:12px;color:#6b7280">Termin</td>
          <td style="padding:12px;text-align:right;font-weight:500;color:#111827">${formatDateSl(body.startDate)} — ${formatDateSl(body.endDate)} (${body.numDays} dni)</td>
        </tr>
        <tr>
          <td style="padding:12px;color:#6b7280;border-top:1px solid #f3f4f6">Jet ski</td>
          <td style="padding:12px;text-align:right;font-weight:500;color:#111827;border-top:1px solid #f3f4f6">${escapeHtml(body.jetskiName)}</td>
        </tr>
      </table>
    </div>

    <!-- Price breakdown -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:24px">
      <div style="padding:16px;border-bottom:1px solid #f3f4f6">
        <h3 style="margin:0;font-size:14px;color:#374151">Cena</h3>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rentalRows}
        ${deliveryRow}
        <tr style="border-top:2px solid #e5e7eb">
          <td style="padding:12px;font-weight:600;color:#111827">Skupaj</td>
          <td style="padding:12px;text-align:right;font-weight:700;font-size:18px;color:#0e7490">${formatEUR(body.totalPrice)}</td>
        </tr>
      </table>
    </div>

    <!-- Payment instructions -->
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:24px">
      <div style="padding:16px;border-bottom:1px solid #f3f4f6">
        <h3 style="margin:0;font-size:14px;color:#374151">Navodila za plačilo pologa</h3>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 12px;color:#6b7280">Prejemnik</td><td style="padding:8px 12px;text-align:right;font-weight:500">${escapeHtml(bankDetails.accountHolder)}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">Banka</td><td style="padding:8px 12px;text-align:right;font-weight:500">${escapeHtml(bankDetails.bank)}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">IBAN</td><td style="padding:8px 12px;text-align:right;font-weight:500;font-family:monospace">${bankDetails.iban}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">SWIFT/BIC</td><td style="padding:8px 12px;text-align:right;font-weight:500;font-family:monospace">${bankDetails.swift}</td></tr>
        <tr><td style="padding:8px 12px;color:#6b7280">Namen plačila</td><td style="padding:8px 12px;text-align:right;font-weight:600;font-family:monospace">${escapeHtml(body.reference)}</td></tr>
        <tr style="border-top:2px solid #e5e7eb">
          <td style="padding:12px;font-weight:600;color:#111827">Znesek pologa (20%)</td>
          <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;color:#0e7490">${formatEUR(body.depositAmount)}</td>
        </tr>
      </table>
    </div>

    <!-- Security deposit note -->
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#92400e">⚠️ Pomembno</p>
      <p style="margin:0;font-size:13px;color:#78350f;line-height:1.5">
        Plačilo pologa mora biti prejeto v 24 urah, sicer rezervacija poteče.
        Ob prevzemu je potrebna kavcija v višini ${formatEUR(body.securityDeposit || 500)} v gotovini.
        Preostanek zneska (${formatEUR(body.totalPrice - body.depositAmount)}) je potrebno plačati najkasneje 3 dni pred začetkom najema.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:16px 0;font-size:12px;color:#9ca3af">
      <p style="margin:0">Jet4You · +386 40 698 807 · info@jet4you.com</p>
      <p style="margin:4px 0 0">To sporočilo je bilo avtomatsko poslano ob oddaji rezervacije.</p>
    </div>
  </div>
</body>
</html>`
}

/**
 * POST /api/email
 *
 * Sends transactional booking confirmation emails via Resend.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      console.log('📧 RESEND_API_KEY not set, logging email instead:', {
        type: body.type,
        to: body.email,
        reference: body.reference,
      })
      return NextResponse.json({ sent: false, reason: 'no_api_key' })
    }

    const resend = new Resend(resendKey)
    const notifyEmail = process.env.NOTIFY_EMAIL || 'info@jet4you.com'

    if (body.type === 'booking_created') {
      const html = buildBookingEmail(body)

      // Send to customer
      await resend.emails.send({
        from: 'Jet4You <onboarding@resend.dev>',
        to: body.email,
        subject: `Rezervacija potrjena — ${body.reference}`,
        html,
      })

      // Notify business owner
      await resend.emails.send({
        from: 'Jet4You <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `Nova rezervacija: ${body.reference} — ${body.customerName}`,
        html,
      })
    }

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('Email API error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
