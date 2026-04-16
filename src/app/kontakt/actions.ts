'use server'

import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase/server'

// Types for form data
export interface InquiryFormData {
  name: string
  email: string
  phone: string
  dateFrom: string
  dateTo: string
  destination: string
  hasTowHitch: 'yes' | 'no' | ''
  message: string
}

export interface InquiryFormState {
  success: boolean
  message: string
  errors?: Partial<Record<keyof InquiryFormData, string>>
}

// Validation helper
function validateFormData(data: InquiryFormData): InquiryFormState['errors'] {
  const errors: InquiryFormState['errors'] = {}

  if (!data.name || data.name.length < 2) {
    errors.name = 'Ime in priimek sta obvezna'
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Vpišite veljavni e-poštni naslov'
  }

  if (!data.phone || data.phone.length < 6) {
    errors.phone = 'Vpišite telefonsko številko'
  }

  if (!data.dateFrom) {
    errors.dateFrom = 'Izberite začetni datum'
  }

  if (!data.dateTo) {
    errors.dateTo = 'Izberite končni datum'
  }

  if (data.dateFrom && data.dateTo && new Date(data.dateFrom) >= new Date(data.dateTo)) {
    errors.dateTo = 'Končni datum mora biti po začetnem'
  }

  if (!data.hasTowHitch) {
    errors.hasTowHitch = 'Izberite odgovor'
  }

  return Object.keys(errors).length > 0 ? errors : undefined
}

export async function submitInquiry(
  _prevState: InquiryFormState | null,
  formData: FormData
): Promise<InquiryFormState> {
  // Parse form data
  const data: InquiryFormData = {
    name: formData.get('name') as string || '',
    email: formData.get('email') as string || '',
    phone: formData.get('phone') as string || '',
    dateFrom: formData.get('dateFrom') as string || '',
    dateTo: formData.get('dateTo') as string || '',
    destination: formData.get('destination') as string || '',
    hasTowHitch: formData.get('hasTowHitch') as 'yes' | 'no' | '' || '',
    message: formData.get('message') as string || '',
  }

  // Validate
  const errors = validateFormData(data)
  if (errors) {
    return {
      success: false,
      message: 'Prosimo, popravite napake v obrazcu.',
      errors,
    }
  }

  try {
    // 1. Save to Supabase
    const supabase = createServerClient()
    const { error: dbError } = await supabase.from('inquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      date_from: data.dateFrom || null,
      date_to: data.dateTo || null,
      destination: data.destination || null,
      has_tow_hitch: data.hasTowHitch === 'yes' ? true : data.hasTowHitch === 'no' ? false : null,
      message: data.message || null,
    })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      throw new Error('Database error')
    }

    // 2. Send email notification
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      const notifyEmail = process.env.NOTIFY_EMAIL || 'info@jet4you.com'

      await resend.emails.send({
        from: 'Jet4You <onboarding@resend.dev>',
        to: notifyEmail,
        subject: `Novo povpraševanje: ${data.name}`,
        html: `
          <h2>Novo povpraševanje s kontaktnega obrazca</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px;font-weight:bold">Ime:</td><td style="padding:8px">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">E-pošta:</td><td style="padding:8px">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Telefon:</td><td style="padding:8px">${escapeHtml(data.phone)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Termin:</td><td style="padding:8px">${escapeHtml(data.dateFrom)} – ${escapeHtml(data.dateTo)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Destinacija:</td><td style="padding:8px">${escapeHtml(data.destination || 'Ni navedeno')}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Kljuka:</td><td style="padding:8px">${data.hasTowHitch === 'yes' ? 'Da' : 'Ne'}</td></tr>
            ${data.message ? `<tr><td style="padding:8px;font-weight:bold">Sporočilo:</td><td style="padding:8px">${escapeHtml(data.message)}</td></tr>` : ''}
          </table>
        `,
      }).catch((emailErr) => {
        // Don't fail the whole submission if email fails
        console.error('Resend email error:', emailErr)
      })
    }

    return {
      success: true,
      message: 'Hvala za vaše povpraševanje! Odgovorili vam bomo v najkrajšem možnem času.',
    }
  } catch (error) {
    console.error('Error submitting inquiry:', error)
    return {
      success: false,
      message: 'Prišlo je do napake. Prosimo, poskusite ponovno ali nas kontaktirajte po telefonu.',
    }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
