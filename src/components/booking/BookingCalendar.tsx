'use client'

import { useState, useEffect, useMemo } from 'react'
import { sl } from 'date-fns/locale'
import {
  addMonths,
  subMonths,
  format,
  startOfDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  parseISO,
  isWithinInterval,
  isSameDay,
  isSameMonth,
  isBefore,
  isAfter,
  getDay,
  differenceInDays,
} from 'date-fns'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

const WEEKDAY_LABELS = ['PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB', 'NED']

export default function BookingCalendar({ onSelect, initialRange }: BookingCalendarProps) {
  const content = bookingContent.calendar
  const [rangeStart, setRangeStart] = useState<Date | null>(initialRange?.start ?? null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(initialRange?.end ?? null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()))
  const [availability, setAvailability] = useState<AvailabilityData>({
    booked: [],
    pending: [],
    blocked: [],
  })
  const [bookingRules, setBookingRules] = useState<BookingRules>(defaultBookingRules)
  const [loading, setLoading] = useState(true)

  const today = startOfDay(new Date())
  const maxMonth = addMonths(today, 6)

  // Fetch availability data and booking rules
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Build unavailable day sets
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

  const bookedDays = useMemo(() => daysFromRanges(availability.booked), [availability.booked])
  const pendingDays = useMemo(() => daysFromRanges(availability.pending), [availability.pending])
  const blockedDays = useMemo(() => daysFromRanges(availability.blocked), [availability.blocked])
  const allUnavailable = useMemo(
    () => [...bookedDays, ...pendingDays, ...blockedDays],
    [bookedDays, pendingDays, blockedDays]
  )

  function isDayUnavailable(day: Date) {
    return allUnavailable.some((d) => isSameDay(d, day))
  }

  function isDayBooked(day: Date) {
    return bookedDays.some((d) => isSameDay(d, day))
  }

  function isDayPending(day: Date) {
    return pendingDays.some((d) => isSameDay(d, day))
  }

  // Calendar grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // getDay returns 0=Sun. We want Mon=0, so shift.
    const startDow = (getDay(monthStart) + 6) % 7
    const blanks = Array.from({ length: startDow }, () => null)

    return [...blanks, ...allDays]
  }, [currentMonth])

  // Selection logic
  function handleDayClick(day: Date) {
    if (isBefore(day, today) || isDayUnavailable(day)) return

    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Start new selection
      setRangeStart(day)
      setRangeEnd(null)
    } else {
      // Set end date
      if (isBefore(day, rangeStart)) {
        setRangeStart(day)
        setRangeEnd(null)
      } else {
        setRangeEnd(day)
      }
    }
  }

  function isInRange(day: Date) {
    if (!rangeStart) return false
    const end = rangeEnd ?? hoverDate
    if (!end) return false
    const s = isBefore(rangeStart, end) ? rangeStart : end
    const e = isAfter(rangeStart, end) ? rangeStart : end
    return isAfter(day, s) && isBefore(day, e)
  }

  function isRangeStart(day: Date) {
    return rangeStart ? isSameDay(day, rangeStart) : false
  }

  function isRangeEnd(day: Date) {
    const end = rangeEnd ?? hoverDate
    return end ? isSameDay(day, end) : false
  }

  // Conflict check
  const rangeHasConflict = useMemo(() => {
    if (!rangeStart || !rangeEnd || isSameDay(rangeStart, rangeEnd)) return false
    return allUnavailable.some((d) =>
      isWithinInterval(d, { start: rangeStart, end: new Date(rangeEnd.getTime() - 86400000) })
    )
  }, [rangeStart, rangeEnd, allUnavailable])

  // Rule validation
  const effectiveEnd = rangeStart && rangeEnd && isSameDay(rangeStart, rangeEnd)
    ? rangeEnd
    : rangeEnd

  const ruleError = rangeStart && effectiveEnd
    ? validateBookingDates(rangeStart, effectiveEnd, bookingRules)
    : null

  const canProceed = rangeStart && effectiveEnd && !rangeHasConflict && !ruleError

  // Number of selected days for display
  const selectedDays = rangeStart && rangeEnd
    ? isSameDay(rangeStart, rangeEnd)
      ? 1
      : differenceInDays(rangeEnd, rangeStart)
    : null

  // Build rules hint
  const rulesHint = useMemo(() => {
    const parts: string[] = []
    const dayName: Record<number, string> = {
      0: 'nedelje', 1: 'ponedeljka', 2: 'torka', 3: 'srede',
      4: 'četrtka', 5: 'petka', 6: 'sobote',
    }

    if (bookingRules.minDays > 1) {
      let main = `Minimalno ${bookingRules.minDays} dni`
      if (bookingRules.requiredStartDay !== null) {
        main += ` (začetek: ${dayName[bookingRules.requiredStartDay]})`
      }
      parts.push(main)
    }

    if (bookingRules.weekendEnabled) {
      const starts = bookingRules.weekendStartDays.map((d) => dayName[d]).join('/')
      const durs = bookingRules.weekendDurations.join('–')
      parts.push(`Vikend: ${durs} dni (začetek ${starts})`)
    }

    if (bookingRules.singleDayEnabled) {
      parts.push('Enodnevni: 1 dan')
    }

    return parts.length > 0 ? parts.join(' · ') : null
  }, [bookingRules])

  // Navigation
  const canGoPrev = isAfter(currentMonth, startOfMonth(today))
  const canGoNext = isBefore(currentMonth, startOfMonth(maxMonth))

  function prevMonth() {
    if (canGoPrev) setCurrentMonth(subMonths(currentMonth, 1))
  }

  function nextMonth() {
    if (canGoNext) setCurrentMonth(addMonths(currentMonth, 1))
  }

  const monthLabel = format(currentMonth, 'LLLL yyyy', { locale: sl })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-2 text-gray-900 mb-2">{content.title}</h2>
        <p className="text-gray-500">{content.subtitle}</p>
      </div>

      {/* Rules hint */}
      {rulesHint && (
        <div className="max-w-2xl mx-auto bg-primary-50/60 border border-primary-100 rounded-xl px-5 py-3 text-center text-sm text-primary-700 font-medium">
          {rulesHint}
        </div>
      )}

      {/* Main content: Calendar + Map */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">

          {/* Calendar side */}
          <div className="p-4 sm:p-6">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={!canGoPrev}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  canGoPrev
                    ? 'hover:bg-gray-200 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 capitalize">{monthLabel}</h3>
              <button
                onClick={nextMonth}
                disabled={!canGoNext}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  canGoNext
                    ? 'hover:bg-gray-200 text-gray-700'
                    : 'text-gray-300 cursor-not-allowed'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={label}
                  className={cn(
                    'text-center text-[11px] font-semibold tracking-wider py-1.5',
                    i >= 5 ? 'text-primary-500' : 'text-gray-400'
                  )}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`blank-${i}`} className="h-11" />
                }

                const isPast = isBefore(day, today)
                const unavailable = isDayUnavailable(day)
                const booked = isDayBooked(day)
                const pending = isDayPending(day)
                const disabled = isPast || unavailable
                const inMonth = isSameMonth(day, currentMonth)
                const isStart = isRangeStart(day)
                const isEnd = isRangeEnd(day)
                const inRange = isInRange(day)

                return (
                  <div
                    key={day.toISOString()}
                    className="relative h-11"
                  >
                    {/* Range background band */}
                    {(inRange || (isStart && (rangeEnd || hoverDate)) || (isEnd && rangeStart)) && (
                      <div
                        className={cn(
                          'absolute inset-y-0.5 inset-x-0 bg-primary-100/70',
                          isStart && 'rounded-l-lg left-[20%]',
                          isEnd && 'rounded-r-lg right-[20%]',
                        )}
                      />
                    )}

                    <button
                      disabled={disabled}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => {
                        if (rangeStart && !rangeEnd && !disabled) setHoverDate(day)
                      }}
                      onMouseLeave={() => setHoverDate(null)}
                      className={cn(
                        'relative z-10 w-full h-full flex items-center justify-center text-sm font-semibold rounded-lg transition-all',
                        // Default
                        !disabled && !isStart && !isEnd && !inRange && 'text-gray-800 hover:bg-white hover:shadow-md',
                        // Selected (start/end)
                        (isStart || isEnd) && 'bg-primary-600 text-white shadow-md shadow-primary-600/30',
                        // In range
                        inRange && !isStart && !isEnd && 'text-primary-800',
                        // Booked
                        booked && 'text-red-300 line-through cursor-not-allowed',
                        // Pending
                        pending && !booked && 'text-amber-400 cursor-not-allowed',
                        // Blocked / past
                        disabled && !booked && !pending && 'text-gray-300 cursor-not-allowed',
                        // Not current month
                        !inMonth && 'text-gray-300',
                        // Today indicator
                        isSameDay(day, today) && !isStart && !isEnd && 'ring-2 ring-primary-300 ring-inset rounded-lg',
                      )}
                    >
                      {format(day, 'd')}
                      {/* Pending dot */}
                      {pending && !booked && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 mt-4 pt-3 border-t border-gray-200">
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-primary-600" />
                {content.legend.selected}
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-amber-300" />
                {content.legend.pending}
              </span>
              <span className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-full bg-gray-300" />
                {content.legend.available}
              </span>
            </div>
          </div>

          {/* Map + location side */}
          <div className="relative bg-gray-200 min-h-[250px] lg:min-h-0">
            {/* Map embed */}
            <iframe
              title="Lokacija Jet4You"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2767.5!2d14.5281!3d46.0961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47653100b35f8e3b%3A0x0!2sPot+v+hribec+3A%2C+1231+Ljubljana!5e0!3m2!1ssl!2ssi!4v1"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, filter: 'grayscale(60%) contrast(1.1)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen={false}
            />

            {/* Location card overlay */}
            <div className="absolute bottom-4 right-4 left-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Prevzemno mesto</p>
                  <p className="text-[11px] text-gray-500">Pot v hribec 3A, 1231 Ljubljana-Črnuče</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection summary + validation */}
      <div className="max-w-xl mx-auto space-y-3">
        {/* Selected range info */}
        {rangeStart && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Začetek</p>
                <p className="text-sm font-bold text-gray-900">
                  {format(rangeStart, 'd. MMMM yyyy', { locale: sl })}
                </p>
              </div>
              {effectiveEnd && (
                <>
                  <div className="w-8 h-px bg-gray-300" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Konec</p>
                    <p className="text-sm font-bold text-gray-900">
                      {format(effectiveEnd, 'd. MMMM yyyy', { locale: sl })}
                    </p>
                  </div>
                </>
              )}
            </div>
            {selectedDays !== null && (
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{selectedDays}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  {selectedDays === 1 ? 'dan' : selectedDays < 5 ? 'dni' : 'dni'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Validation feedback */}
        {rangeHasConflict && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center text-sm text-red-700 font-medium">
            Izbrani datumi se prekrivajo z obstoječo rezervacijo.
          </div>
        )}

        {ruleError && !rangeHasConflict && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center text-sm text-amber-700 font-medium">
            {ruleError}
          </div>
        )}

        {/* Next button */}
        <div className="flex justify-center pt-1">
          <Button
            variant="cta"
            size="xl"
            disabled={!canProceed}
            onClick={() => {
              if (rangeStart && effectiveEnd) {
                onSelect({ start: rangeStart, end: effectiveEnd })
              }
            }}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {content.next}
          </Button>
        </div>
      </div>
    </div>
  )
}
