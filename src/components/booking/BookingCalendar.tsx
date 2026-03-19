'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { sl } from 'date-fns/locale'
import {
  addMonths,
  format,
  startOfDay,
  eachDayOfInterval,
  parseISO,
  isWithinInterval,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSupabase } from '@/lib/supabase'
import {
  validateBookingDates,
  defaultBookingRules,
  type AvailabilityData,
  type BookingRules,
} from '@/lib/booking'
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
  const [bookingRules, setBookingRules] = useState<BookingRules>(defaultBookingRules)
  const [loading, setLoading] = useState(true)

  // Fetch availability data and booking rules
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const today = startOfDay(new Date())
        const futureLimit = format(addMonths(today, 6), 'yyyy-MM-dd')
        const todayStr = format(today, 'yyyy-MM-dd')

        const sb = getSupabase()
        const [bookingsRes, blockedRes, rulesRes] = await Promise.all([
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
          fetch('/api/booking-rules').then((r) => r.json()).catch(() => null),
        ])

        const booked: AvailabilityData['booked'] = []
        const pending: AvailabilityData['pending'] = []

        if (bookingsRes.data) {
          for (const b of bookingsRes.data) {
            const r = { start: b.start_date, end: b.end_date }
            if (b.status === 'confirmed') booked.push(r)
            else pending.push(r)
          }
        }

        const blocked = (blockedRes.data || []).map((b) => ({
          start: b.start_date,
          end: b.end_date,
        }))

        setAvailability({ booked, pending, blocked })

        if (rulesRes?.rules) {
          setBookingRules(rulesRes.rules)
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Build sets of disabled/colored days
  const today = startOfDay(new Date())

  function daysFromRanges(ranges: { start: string; end: string }[]): Date[] {
    const days: Date[] = []
    for (const r of ranges) {
      const start = parseISO(r.start)
      const end = parseISO(r.end)
      const interval = eachDayOfInterval({
        start,
        end: new Date(end.getTime() - 86400000),
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
    range?.from && range?.to && range.from.getTime() !== range.to.getTime()
      ? allUnavailable.some((d) =>
          isWithinInterval(d, { start: range.from!, end: new Date(range.to!.getTime() - 86400000) })
        )
      : false

  // Validate against booking rules
  // Handle same-day selection (from === to) as a single-day booking
  const effectiveEnd = range?.from && range?.to && range.from.getTime() === range.to.getTime()
    ? range.to  // same day = 1-day booking, pass same date to validator
    : range?.to

  const ruleError =
    range?.from && effectiveEnd
      ? validateBookingDates(range.from, effectiveEnd, bookingRules)
      : null

  const canProceed = range?.from && effectiveEnd && !rangeHasConflict && !ruleError

  // Build a helper message showing allowed booking types
  const rulesHint = (() => {
    const parts: string[] = []
    const dayName: Record<number, string> = {
      0: 'nedelje', 1: 'ponedeljka', 2: 'torka', 3: 'srede',
      4: 'četrtka', 5: 'petka', 6: 'sobote',
    }

    // Main rule: minimum days
    if (bookingRules.minDays > 1) {
      let main = `Minimalno ${bookingRules.minDays} dni`
      if (bookingRules.requiredStartDay !== null) {
        main += ` (začetek: ${dayName[bookingRules.requiredStartDay]})`
      }
      parts.push(main)
    }

    // Weekend exception
    if (bookingRules.weekendEnabled) {
      const starts = bookingRules.weekendStartDays.map((d) => dayName[d]).join('/')
      const durs = bookingRules.weekendDurations.join('–')
      parts.push(`Vikend: ${durs} dni (začetek ${starts})`)
    }

    // Single day
    if (bookingRules.singleDayEnabled) {
      parts.push('Enodnevni: 1 dan')
    }

    return parts.length > 0 ? parts.join(' · ') : null
  })()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      {/* Booking rules hint */}
      {rulesHint && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2.5 text-center text-sm text-primary-800">
          {rulesHint}
        </div>
      )}

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

      {ruleError && !rangeHasConflict && (
        <div className="text-center">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-4 py-1.5">
            {ruleError}
          </Badge>
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-center">
        <Button
          variant="cta"
          size="lg"
          disabled={!canProceed}
          onClick={() => {
            if (range?.from && effectiveEnd) {
              onSelect({ start: range.from, end: effectiveEnd })
            }
          }}
        >
          {content.next}
        </Button>
      </div>
    </div>
  )
}
