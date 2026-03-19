'use client'

import { useState } from 'react'
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { bookingContent } from '@/data/booking'
import { formatEUR, formatDate } from '@/lib/booking'
import type { PriceBreakdown } from '@/lib/booking'
import type { JetSki } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface BookingSummaryProps {
  dateRange: { start: Date; end: Date }
  jetski: JetSki
  price: PriceBreakdown
  onNext: () => void
}

export default function BookingSummary({
  dateRange,
  jetski,
  price,
  onNext,
}: BookingSummaryProps) {
  const content = bookingContent.summary
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Top summary */}
          <div className="p-6 space-y-4">
            {/* Dates */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary-500 shrink-0" />
              <div>
                <p className="text-sm text-gray-500">{content.dates}</p>
                <p className="font-medium text-gray-900">
                  {formatDate(dateRange.start)} — {formatDate(dateRange.end)}
                  <span className="text-gray-400 ml-2">({price.numDays} {content.days})</span>
                </p>
              </div>
            </div>

            {/* Jet ski */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <span className="text-lg">🚤</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{content.jetski}</p>
                <p className="font-medium text-gray-900">{jetski.name}</p>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">{content.total}</span>
                <span className="text-2xl font-bold text-primary-600">{formatEUR(price.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Expandable details */}
          <button
            className="w-full px-6 py-3 bg-gray-50 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors border-t border-gray-100"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? content.hideDetails : content.showDetails}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="px-6 pb-6 space-y-3 text-sm animate-in slide-in-from-top-2 duration-200">
              {/* Rental breakdown */}
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {content.rental}: {price.numDays} {content.days} × {formatEUR(price.dailyRate)}
                </span>
                <span className="font-medium text-gray-900">{formatEUR(price.rentalTotal)}</span>
              </div>

              {/* Delivery */}
              {price.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    {content.deliveryNote}: {price.deliveryKm} km × 0,70 €
                  </span>
                  <span className="font-medium text-gray-900">{formatEUR(price.deliveryFee)}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 space-y-2">
                {/* 20% deposit */}
                <div className="flex justify-between">
                  <span className="text-gray-500">{content.depositRequired}</span>
                  <span className="font-semibold text-primary-600">{formatEUR(price.depositAmount)}</span>
                </div>

                {/* Remaining */}
                <div className="flex justify-between">
                  <span className="text-gray-500">{content.remaining}</span>
                  <span className="font-medium text-gray-900">{formatEUR(price.remainingAmount)}</span>
                </div>

                {/* Security deposit */}
                <div className="flex justify-between">
                  <span className="text-gray-500">{content.securityDeposit}</span>
                  <span className="font-medium text-gray-900">{formatEUR(price.securityDeposit)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next */}
        <div className="flex justify-center mt-8">
          <Button variant="cta" size="lg" onClick={onNext}>
            {content.next}
          </Button>
        </div>
      </div>
    </div>
  )
}
