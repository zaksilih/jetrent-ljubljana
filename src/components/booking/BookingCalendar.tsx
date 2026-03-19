'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { sl } from 'date-fns/locale'
import {
  addMonths,
  format,
  isBefore,
  startOfDay,
  eachDayOfInterval,
  parseISO,
  isWithinInterval,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSupabase } from '@/lib/supabase'
import type { AvailabilityData } from '@/lib/booking'
import { bookingContent } from '@/data/booking'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  onSelect: (range: { start: Date; end: Date }) => void
  initialRange?: { start: Date; end: Date } | null
}

export default function BookingCalendar({ onSelect, initialRange }: BookingCalendarProps) {
  const content = bookingContent.calendar
  const [range, setRange] = useState<DateRange | undefined>(
    initialRange ? { from: initialRange.start, to: initialRange.end } : undefined
  )
  const [availability, setAvailability] = useState<AvailabilityData>({
    booked: [],
    pending: [],
    blocked: [],
  })
  const [loading, setLoading] = useState(true)

  // Fetch availability data from Supabase
  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true)
      try {
        const today = startOfDay(new Date())
        const futureLimit = format(addMonths(today, 6), 'yyyy-MM-dd')
        const todayStr = format(today, 'yyyy-MM-dd')

        // Fetch bookings that overlap with our visible range
        const sb = getSupabase()
        const [bookingsRes, blockedRes] = await Promise.all([
          sb
            .from('bookings')
            .select('start_date, end_date, status')
            .in('status', ['confirmed', 'pending_payment'])
            .gte('end_date', todayStr)
            .lte('start_date', futureLimit),
          sb
            .from('blocked_dates')
            .select('start_date, end_date')
            .gte('end_date', todayStr)
            .lte('start_date', futureLimit),
        ])

        const booked: AvailabilityData['booked'] = []
        const pending: AvailabilityData['pending'] = []

        if (bookingsRes.data) {
          for (const b of bookingsRes.data) {
            const range = { start: b.start_date, end: b.end_date }
            if (b.status === 'confirmed') booked.push(range)
            else pending.push(range)
          }
        }

        const blocked = (blockedRes.data || []).map((b) => ({
          start: b.start_date,
          end: b.end_date,
        }))

        setAvailability({ booked, pending, blocked })
      } catch (err) {
        console.error('Failed to fetch availability:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [])

  // Build sets of disabled/colored days
  const today = startOfDay(new Date())

  function daysFromRanges(ranges: { start: string; end: string }[]): Date[] {
    const days: Date[] = []
    for (const r of ranges) {
      const start = parseISO(r.start)
      const end = parseISO(r.end)
      // end date is exclusive (checkout day) — include all days the jetski is in use
      const interval = eachDayOfInterval({
        start,
        end: new Date(end.getTime() - 86400000), // up to end - 1 day
      })
      days.push(...interval)
    }
    return days
  }

  const bookedDays = daysFromRanges(availability.booked)
  const pendingDays = daysFromRanges(availability.pending)
  const blockedDays = daysFromRanges(availability.blocked)
  const allUnavailable = [...bookedDays, ...pendingDays, ...blockedDays]

  // Check if selected range has overlap
  const rangeHasConflict =
    range?.from && range?.to
      ? allUnavailable.some((d) =>
          isWithinInterval(d, { start: range.from!, end: new Date(range.to!.getTime() - 86400000) })
        )
      : false

  const canProceed = range?.from && range?.to && !rangeHasConflict

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300" />
          {content.legend.available}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-red-100 border border-red-300" />
          {content.legend.booked}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300" />
          {content.legend.pending}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-gray-200 border border-gray-300" />
          {content.legend.blocked}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-primary-500 border border-primary-600" />
          {content.legend.selected}
        </span>
      </div>

      {/* Calendar */}
      <div className="flex justify-center">
        {loading ? (
          <div className="py-20 text-gray-400">Nalaganje...</div>
        ) : (
          <DayPicker
            mode="range"
            locale={sl}
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            disabled={[
              { before: today },
              ...allUnavailable.map((d) => d),
            ]}
            modifiers={{
              booked: bookedDays,
              pending: pendingDays,
              blocked: blockedDays,
            }}
            modifiersClassNames={{
              booked: 'rdp-day--booked',
              pending: 'rdp-day--pending',
              blocked: 'rdp-day--blocked',
            }}
            fromMonth={today}
            toMonth={addMonths(today, 6)}
            className="rdp-booking"
          />
        )}
      </div>

      {/* Validation feedback */}
      {rangeHasConflict && (
        <div className="text-center">
          <Badge variant="destructive">Izbrani datumi se prekrivajo z obstoječo rezervacijo</Badge>
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-center">
        <Button
          variant="cta"
          size="lg"
          disabled={!canProceed}
          onClick={() => {
            if (range?.from && range?.to) {
              onSelect({ start: range.from, end: range.to })
            }
          }}
        >
          {content.next}
        </Button>
      </div>
    </div>
  )
}
