'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isToday,
} from 'date-fns'
import { sl } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  CalendarOff,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatEUR } from '@/lib/booking'
import type { BookingStatus } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface BookingEvent {
  id: string
  reference: string
  start_date: string
  end_date: string
  total_price: number
  status: BookingStatus
  customers: { first_name: string; last_name: string } | null
  jetskis: { name: string } | null
}

interface BlockedDateEvent {
  id: string
  start_date: string
  end_date: string
  reason: string
  jetskis: { name: string } | null
}

const statusColors: Record<BookingStatus, string> = {
  pending_payment: 'bg-amber-400',
  confirmed: 'bg-red-400',
  cancelled: 'bg-gray-300',
  expired: 'bg-gray-300',
  completed: 'bg-blue-400',
}

const statusLabels: Record<BookingStatus, string> = {
  pending_payment: 'Čaka na plačilo',
  confirmed: 'Potrjeno',
  cancelled: 'Preklicano',
  expired: 'Poteklo',
  completed: 'Zaključeno',
}

const weekDays = ['PON', 'TOR', 'SRE', 'ČET', 'PET', 'SOB', 'NED']

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<BookingEvent[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDateEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [showBlockForm, setShowBlockForm] = useState(false)

  // Block form state
  const [blockForm, setBlockForm] = useState({
    jetskiId: '',
    startDate: '',
    endDate: '',
    reason: 'Vzdrževanje',
  })
  const [jetskis, setJetskis] = useState<{ id: string; name: string }[]>([])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [bookingsRes, blockedRes, jetskisRes] = await Promise.all([
        fetch('/api/admin/bookings'),
        fetch('/api/admin/blocked-dates'),
        fetch('/api/admin/jetskis'),
      ])

      if (bookingsRes.ok) {
        const data = await bookingsRes.json()
        setBookings(data.bookings || [])
      }
      if (blockedRes.ok) {
        const data = await blockedRes.json()
        setBlockedDates(data.blockedDates || [])
      }
      if (jetskisRes.ok) {
        const data = await jetskisRes.json()
        setJetskis(
          (data.jetskis || []).map((js: { id: string; name: string }) => ({
            id: js.id,
            name: js.name,
          }))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Start weekday (Monday = 0)
  const startDow = (getDay(monthStart) + 6) % 7

  // Check what events fall on a given day
  function getEventsForDay(day: Date) {
    const activeBookings = bookings.filter((b) => {
      if (b.status === 'cancelled' || b.status === 'expired') return false
      const start = parseISO(b.start_date)
      const end = parseISO(b.end_date)
      // end is exclusive checkout day
      return day >= start && day < end
    })

    const blocks = blockedDates.filter((bd) => {
      const start = parseISO(bd.start_date)
      const end = parseISO(bd.end_date)
      return isWithinInterval(day, { start, end })
    })

    return { bookings: activeBookings, blocks }
  }

  // Day detail sidebar
  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return null
    return getEventsForDay(selectedDay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, bookings, blockedDates])

  // Block dates
  async function handleBlockDates(e: React.FormEvent) {
    e.preventDefault()
    if (!blockForm.jetskiId || !blockForm.startDate || !blockForm.endDate) return

    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jetskiId: blockForm.jetskiId,
          startDate: blockForm.startDate,
          endDate: blockForm.endDate,
          reason: blockForm.reason,
        }),
      })
      if (res.ok) {
        setBlockForm({ jetskiId: jetskis[0]?.id || '', startDate: '', endDate: '', reason: 'Vzdrževanje' })
        setShowBlockForm(false)
        fetchData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Unblock dates
  async function handleUnblock(id: string) {
    try {
      await fetch(`/api/admin/blocked-dates?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Koledar</h1>
          <p className="text-sm text-gray-500 mt-1">Pregled zasedenosti in blokiranih datumov</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBlockForm(!showBlockForm)}
        >
          {showBlockForm ? (
            <><X className="w-4 h-4 mr-1.5" /> Prekliči</>
          ) : (
            <><CalendarOff className="w-4 h-4 mr-1.5" /> Blokiraj datume</>
          )}
        </Button>
      </div>

      {/* Block dates form */}
      {showBlockForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Blokiraj datume</h3>
          <form onSubmit={handleBlockDates} className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Jet ski</Label>
              <select
                className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
                value={blockForm.jetskiId}
                onChange={(e) => setBlockForm((f) => ({ ...f, jetskiId: e.target.value }))}
                required
              >
                <option value="">Izberi...</option>
                {jetskis.map((js) => (
                  <option key={js.id} value={js.id}>{js.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Začetek</Label>
              <Input
                type="date"
                className="w-40"
                value={blockForm.startDate}
                onChange={(e) => setBlockForm((f) => ({ ...f, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Konec</Label>
              <Input
                type="date"
                className="w-40"
                value={blockForm.endDate}
                onChange={(e) => setBlockForm((f) => ({ ...f, endDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Razlog</Label>
              <Input
                className="w-48"
                value={blockForm.reason}
                onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>
            <Button type="submit" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Blokiraj
            </Button>
          </form>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300" /> Prosto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" /> Čaka na plačilo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-400" /> Potrjeno
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-400" /> Blokirano
        </span>
      </div>

      <div className="flex gap-6">
        {/* Calendar grid */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-gray-900 capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: sl })}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 py-2 uppercase"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells for offset */}
            {Array.from({ length: startDow }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border-b border-r border-gray-100 bg-gray-50/50" />
            ))}

            {days.map((day) => {
              const events = getEventsForDay(day)
              const hasBookings = events.bookings.length > 0
              const hasBlocks = events.blocks.length > 0
              const isSelected = selectedDay && isSameDay(day, selectedDay)
              const today = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  className={cn(
                    'h-24 border-b border-r border-gray-100 p-1.5 text-left transition-colors relative',
                    isSelected ? 'bg-primary-50 ring-2 ring-primary-400 ring-inset' : 'hover:bg-gray-50',
                    !hasBookings && !hasBlocks && 'bg-emerald-50/30',
                  )}
                  onClick={() => setSelectedDay(day)}
                >
                  <span
                    className={cn(
                      'text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full',
                      today && 'bg-primary-600 text-white',
                      !today && 'text-gray-700'
                    )}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Event indicators */}
                  <div className="mt-0.5 space-y-0.5">
                    {events.bookings.slice(0, 2).map((b) => (
                      <div
                        key={b.id}
                        className={cn(
                          'text-[10px] leading-tight text-white px-1.5 py-0.5 rounded truncate',
                          statusColors[b.status]
                        )}
                      >
                        {b.customers
                          ? `${b.customers.first_name} ${b.customers.last_name.charAt(0)}.`
                          : b.reference}
                      </div>
                    ))}
                    {events.bookings.length > 2 && (
                      <div className="text-[10px] text-gray-400 px-1">
                        +{events.bookings.length - 2} več
                      </div>
                    )}
                    {hasBlocks && (
                      <div className="text-[10px] text-white px-1.5 py-0.5 rounded bg-gray-400 truncate">
                        Blokirano
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Day detail sidebar */}
        {selectedDay && (
          <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5 self-start sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {format(selectedDay, 'd. MMMM yyyy', { locale: sl })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedDayEvents?.bookings.length === 0 &&
              selectedDayEvents?.blocks.length === 0 && (
                <p className="text-sm text-gray-400">Ni dogodkov za ta dan.</p>
              )}

            {/* Bookings on this day */}
            {selectedDayEvents?.bookings.map((b) => (
              <div
                key={b.id}
                className="border border-gray-100 rounded-lg p-3 mb-2 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-semibold text-xs">{b.reference}</span>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] border-0 text-white', statusColors[b.status])}
                  >
                    {statusLabels[b.status]}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {b.customers
                    ? `${b.customers.first_name} ${b.customers.last_name}`
                    : '—'}
                </p>
                <p className="text-gray-400 text-xs">
                  {b.jetskis?.name} · {formatEUR(Number(b.total_price))}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {format(parseISO(b.start_date), 'dd.MM')} – {format(parseISO(b.end_date), 'dd.MM.yyyy')}
                </p>
              </div>
            ))}

            {/* Blocked dates on this day */}
            {selectedDayEvents?.blocks.map((bd) => (
              <div
                key={bd.id}
                className="border border-gray-100 rounded-lg p-3 mb-2 text-sm bg-gray-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">Blokirano</span>
                  <button
                    onClick={() => handleUnblock(bd.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Odstrani
                  </button>
                </div>
                <p className="text-gray-500 text-xs">{bd.reason}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {bd.jetskis?.name}
                  {' · '}
                  {format(parseISO(bd.start_date), 'dd.MM')} – {format(parseISO(bd.end_date), 'dd.MM.yyyy')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
