'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { bookingContent } from '@/data/booking'
import { formatEUR, getSeasonForDate, getDailyRate } from '@/lib/booking'
import { eachDayOfInterval, addDays } from 'date-fns'
import type { JetSki } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface JetSkiSelectorProps {
  jetskis: JetSki[]
  dateRange: { start: Date; end: Date }
  selected: JetSki | null
  onSelect: (jetski: JetSki) => void
}

export default function JetSkiSelector({
  jetskis,
  dateRange,
  selected,
  onSelect,
}: JetSkiSelectorProps) {
  const content = bookingContent.jetskiSelector

  if (jetskis.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500 mt-4">{content.noAvailable}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {jetskis.map((js) => {
          const isSelected = selected?.id === js.id
          const prices = {
            low: Number(js.daily_price_low),
            high: Number(js.daily_price_high),
            short: Number(js.daily_price_short),
          }

          // Compute unique rates across all days in the range
          const rentalDays = eachDayOfInterval({
            start: dateRange.start,
            end: addDays(dateRange.end, -1),
          })
          const ratesArr = rentalDays.map((d) => getDailyRate(getSeasonForDate(d, d.getFullYear()), prices))
          const uniqueRates = Array.from(new Set(ratesArr))
          const minRate = Math.min(...uniqueRates)
          const maxRate = Math.max(...uniqueRates)
          const isMixed = uniqueRates.length > 1

          return (
            <div
              key={js.id}
              className={cn(
                'relative rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer group',
                isSelected
                  ? 'border-primary-500 shadow-lg shadow-primary-100'
                  : 'border-gray-100 hover:border-primary-200 hover:shadow-md'
              )}
              onClick={() => onSelect(js)}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={js.image_url}
                  alt={js.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{js.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{js.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    {isMixed ? (
                      <>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatEUR(minRate)} – {formatEUR(maxRate)}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">{content.perDay}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-primary-600">
                          {formatEUR(minRate)}
                        </span>
                        <span className="text-sm text-gray-400 ml-1">{content.perDay}</span>
                      </>
                    )}
                  </div>

                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect(js)
                    }}
                  >
                    {isSelected ? content.selected : content.select}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
