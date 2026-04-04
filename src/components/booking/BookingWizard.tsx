'use client'

import { useState, useCallback } from 'react'
import { Check } from 'lucide-react'
import {
  BookingCalendar,
  JetSkiSelector,
  BookingSummary,
  CustomerForm,
  PaymentStep,
  BookingConfirmation,
} from '@/components/booking'
import { formatDateISO, type PriceBreakdown, type CustomerFormData } from '@/lib/booking'
import type { JetSki } from '@/lib/supabase'
import { bookingContent } from '@/data/booking'
import { cn } from '@/lib/utils'

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6

export default function BookingWizard() {
  const [step, setStep] = useState<WizardStep>(1)
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null)
  const [availableJetSkis, setAvailableJetSkis] = useState<JetSki[]>([])
  const [selectedJetSki, setSelectedJetSki] = useState<JetSki | null>(null)
  const [price, setPrice] = useState<PriceBreakdown | null>(null)
  const [customerData, setCustomerData] = useState<CustomerFormData | null>(null)
  const [bookingReference, setBookingReference] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Step 1 → 2: Dates selected, fetch available jet skis
  const handleDateSelect = useCallback(async (range: { start: Date; end: Date }) => {
    setDateRange(range)
    setLoading(true)

    try {
      const startStr = formatDateISO(range.start)
      const endStr = formatDateISO(range.end)

      const res = await fetch(
        `/api/availability?start=${startStr}&end=${endStr}`
      )
      const data = await res.json()

      if (data.jetskis) {
        setAvailableJetSkis(data.jetskis)
      }
    } catch (err) {
      console.error('Failed to fetch available jet skis:', err)
    } finally {
      setLoading(false)
      setStep(2)
    }
  }, [])

  // Step 2 → 3: Jet ski selected, calculate price via API
  const handleJetSkiSelect = useCallback(
    async (jetski: JetSki) => {
      setSelectedJetSki(jetski)
      if (dateRange) {
        try {
          const startStr = formatDateISO(dateRange.start)
          const endStr = formatDateISO(dateRange.end)
          const res = await fetch(
            `/api/pricing/calculate?start=${startStr}&end=${endStr}&jetskiId=${jetski.id}`
          )
          if (res.ok) {
            const data = await res.json()
            setPrice(data.price)
          }
        } catch (err) {
          console.error('Failed to calculate price:', err)
        }
      }
      setStep(3)
    },
    [dateRange]
  )

  // Step 4: Customer form submitted, recalculate with delivery
  const handleCustomerSubmit = useCallback(
    async (data: CustomerFormData) => {
      setCustomerData(data)
      if (dateRange && selectedJetSki) {
        try {
          const startStr = formatDateISO(dateRange.start)
          const endStr = formatDateISO(dateRange.end)
          const km = data.deliveryKm || 0
          const res = await fetch(
            `/api/pricing/calculate?start=${startStr}&end=${endStr}&jetskiId=${selectedJetSki.id}&deliveryKm=${km}`
          )
          if (res.ok) {
            const d = await res.json()
            setPrice(d.price)
          }
        } catch (err) {
          console.error('Failed to recalculate price:', err)
        }
      }
      setStep(5)
    },
    [dateRange, selectedJetSki]
  )

  // Step 5 → 6: Confirm booking via API
  const handleConfirmBooking = useCallback(async () => {
    if (!dateRange || !selectedJetSki || !customerData || !price) {
      throw new Error('Manjkajo podatki za rezervacijo.')
    }

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jetskiId: selectedJetSki.id,
        startDate: formatDateISO(dateRange.start),
        endDate: formatDateISO(dateRange.end),
        customer: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          country: customerData.country,
        },
        pickupLocation: customerData.pickupLocation || null,
        customerMessage: customerData.message || null,
        deliveryKm: customerData.deliveryKm || 0,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Napaka pri ustvarjanju rezervacije.')
    }

    const result = await res.json()
    setBookingReference(result.reference)
    setStep(6)
  }, [dateRange, selectedJetSki, customerData, price])

  const steps = bookingContent.steps

  return (
    <div className="space-y-10">
      {/* Step indicator */}
      {step < 6 && (
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all',
                    s.number < step
                      ? 'bg-primary-500 text-white'
                      : s.number === step
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {s.number < step ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : s.number}
                </div>
                <span
                  className={cn(
                    'text-[9px] sm:text-xs mt-1 font-medium',
                    s.number <= step ? 'text-primary-600' : 'text-gray-400'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {s.number < steps.length && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-1 sm:mx-2 rounded-full mb-5 min-w-2',
                    s.number < step ? 'bg-primary-400' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step content */}
      {step === 1 && (
        <BookingCalendar
          onSelect={handleDateSelect}
          initialRange={dateRange}
        />
      )}

      {step === 2 && dateRange && (
        loading ? (
          <div className="text-center py-12 text-gray-400">Nalaganje...</div>
        ) : (
          <JetSkiSelector
            jetskis={availableJetSkis}
            dateRange={dateRange}
            selected={selectedJetSki}
            onSelect={handleJetSkiSelect}
          />
        )
      )}

      {step === 3 && dateRange && selectedJetSki && price && (
        <BookingSummary
          dateRange={dateRange}
          jetski={selectedJetSki}
          price={price}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <CustomerForm
          initialData={customerData || undefined}
          onSubmit={handleCustomerSubmit}
        />
      )}

      {step === 5 && price && (
        <PaymentStep
          price={price}
          onConfirm={handleConfirmBooking}
        />
      )}

      {step === 6 && dateRange && selectedJetSki && price && (
        <BookingConfirmation
          reference={bookingReference}
          dateRange={dateRange}
          jetski={selectedJetSki}
          price={price}
        />
      )}

      {/* Back button for steps 2-5 */}
      {step > 1 && step < 6 && (
        <div className="flex justify-center">
          <button
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setStep((s) => (s - 1) as WizardStep)}
          >
            ← Nazaj
          </button>
        </div>
      )}
    </div>
  )
}
