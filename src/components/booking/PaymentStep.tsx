'use client'

import { useState } from 'react'
import { CreditCard, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { bookingContent } from '@/data/booking'
import { formatEUR, bankDetails } from '@/lib/booking'
import type { PriceBreakdown } from '@/lib/booking'

interface PaymentStepProps {
  price: PriceBreakdown
  reference: string
  onConfirm: () => Promise<void>
}

export default function PaymentStep({ price, reference, onConfirm }: PaymentStepProps) {
  const content = bookingContent.payment
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setSubmitting(true)
    setError(null)
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prišlo je do napake.')
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Method */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-900">{content.method}</h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            <h4 className="font-medium text-gray-900 mb-3">{content.instructions}</h4>
            <div className="flex justify-between">
              <span className="text-gray-500">{content.accountHolder}</span>
              <span className="font-medium text-gray-900">{bankDetails.accountHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{content.bank}</span>
              <span className="font-medium text-gray-900">{bankDetails.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{content.iban}</span>
              <span className="font-mono font-medium text-gray-900">{bankDetails.iban}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{content.swift}</span>
              <span className="font-mono font-medium text-gray-900">{bankDetails.swift}</span>
            </div>
            {reference && (
              <div className="flex justify-between">
                <span className="text-gray-500">{content.reference}</span>
                <span className="font-mono font-semibold text-gray-900">{reference}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">{content.amount}</span>
                <span className="text-lg font-bold text-primary-600">{formatEUR(price.depositAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deadline warning */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{content.deadline}</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Confirm */}
        <div className="flex justify-center pt-2">
          <Button
            variant="cta"
            size="xl"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? content.processing : content.confirm}
          </Button>
        </div>
      </div>
    </div>
  )
}
