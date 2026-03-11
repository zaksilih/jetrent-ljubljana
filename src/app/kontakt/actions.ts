'use server'

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

/**
 * Server action to handle inquiry form submission.
 * 
 * Currently logs the data. In production, this would:
 * 1. Save to Supabase database
 * 2. Send confirmation email
 * 3. Notify business owner
 * 
 * TODO: Connect to Supabase when ready:
 * - Create 'inquiries' table
 * - Use supabase client to insert data
 * - Add email notification service
 */
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
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Log the inquiry (in production, save to database)
    console.log('=== Nova poizvedba ===')
    console.log('Ime:', data.name)
    console.log('E-pošta:', data.email)
    console.log('Telefon:', data.phone)
    console.log('Termin:', `${data.dateFrom} - ${data.dateTo}`)
    console.log('Destinacija:', data.destination || 'Ni navedeno')
    console.log('Kljuka:', data.hasTowHitch === 'yes' ? 'Da' : 'Ne')
    console.log('Sporočilo:', data.message || 'Ni sporočila')
    console.log('======================')

    /* 
    // SUPABASE INTEGRATION (uncomment when ready):
    
    import { createClient } from '@supabase/supabase-js'
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { error } = await supabase.from('inquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      date_from: data.dateFrom,
      date_to: data.dateTo,
      destination: data.destination,
      has_tow_hitch: data.hasTowHitch === 'yes',
      message: data.message,
      created_at: new Date().toISOString(),
    })
    
    if (error) throw error
    */

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
