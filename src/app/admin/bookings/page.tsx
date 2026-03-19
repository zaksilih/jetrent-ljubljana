'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatEUR } from '@/lib/booking'
import type { BookingStatus } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface BookingRow {
  id: string
  reference: string
  start_date: string
  end_date: string
  num_days: number
  daily_rate: number
  total_price: number
  deposit_amount: number
  delivery_fee: number
  security_deposit: number
  status: BookingStatus
  pickup_location: string | null
  customer_message: string | null
  admin_notes: string | null
  created_at: string
  customers: {
    first_name: string
    last_name: string
    email: string
    phone: string
    country: string
  }
  jetskis: {
    name: string
    slug: string
  }
  payments: {
    amount: number
    status: string
    payment_type: string
  }[]
}

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  pending_payment: { label: 'Čaka na plačilo', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Potrjeno', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Preklicano', color: 'bg-red-100 text-red-700 border-red-200' },
  expired: { label: 'Poteklo', color: 'bg-gray-100 text-gray-500 border-gray-200' },
  completed: { label: 'Zaključeno', color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

const allStatuses: BookingStatus[] = [
  'pending_payment',
  'confirmed',
  'cancelled',
  'expired',
  'completed',
]

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('status') as BookingStatus | null

  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(
    initialFilter || 'all'
  )

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings')
      if (!res.ok) return
      const data = await res.json()
      setBookings(data.bookings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Update booking status
  async function updateStatus(bookingId: string, status: BookingStatus) {
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      })
      fetchBookings()
    } catch (err) {
      console.error(err)
    }
  }

  // Filter bookings
  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const name = `${b.customers?.first_name} ${b.customers?.last_name}`.toLowerCase()
      const matches =
        b.reference.toLowerCase().includes(q) ||
        name.includes(q) ||
        b.customers?.email?.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rezervacije</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} od {bookings.length} rezervacij
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchBookings}
          disabled={loading}
        >
          <RefreshCw className={cn('w-4 h-4 mr-1.5', loading && 'animate-spin')} />
          Osveži
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Išči po referenci, imenu ali e-pošti..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <button
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              statusFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            onClick={() => setStatusFilter('all')}
          >
            Vse
          </button>
          {allStatuses.map((s) => (
            <button
              key={s}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                statusFilter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              onClick={() => setStatusFilter(s)}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Table header */}
        <div className="hidden lg:grid grid-cols-[130px_1fr_1fr_120px_120px_100px_90px_40px] gap-3 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
          <span>Referenca</span>
          <span>Stranka</span>
          <span>Jet ski</span>
          <span>Začetek</span>
          <span>Konec</span>
          <span className="text-right">Cena</span>
          <span>Status</span>
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          {loading && bookings.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">Nalaganje...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">Ni rezultatov.</div>
          )}
          {filtered.map((b) => {
            const isExpanded = expandedId === b.id
            return (
              <div key={b.id}>
                {/* Summary row */}
                <button
                  className="w-full px-5 py-3.5 text-left hover:bg-gray-50 transition-colors lg:grid lg:grid-cols-[130px_1fr_1fr_120px_120px_100px_90px_40px] lg:gap-3 lg:items-center flex flex-wrap items-center gap-2"
                  onClick={() => setExpandedId(isExpanded ? null : b.id)}
                >
                  <span className="font-mono font-semibold text-sm text-gray-900">
                    {b.reference}
                  </span>
                  <span className="text-sm text-gray-600 truncate">
                    {b.customers?.first_name} {b.customers?.last_name}
                    <span className="text-gray-400 ml-1.5 hidden xl:inline">
                      {b.customers?.email}
                    </span>
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    {b.jetskis?.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(b.start_date), 'dd.MM.yyyy')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(b.end_date), 'dd.MM.yyyy')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 text-right">
                    {formatEUR(Number(b.total_price))}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn('text-[11px] border-0', statusConfig[b.status].color)}
                  >
                    {statusConfig[b.status].label}
                  </Badge>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4 text-sm bg-gray-50/50">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Stranka</p>
                        <p className="font-medium">
                          {b.customers?.first_name} {b.customers?.last_name}
                        </p>
                        <p className="text-gray-500">{b.customers?.email}</p>
                        <p className="text-gray-500">{b.customers?.phone}</p>
                        <p className="text-gray-500">{b.customers?.country}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Podrobnosti</p>
                        <p>Jet ski: <span className="font-medium">{b.jetskis?.name}</span></p>
                        <p>Dni: {b.num_days}</p>
                        <p>Dnevna cena: {formatEUR(Number(b.daily_rate))}</p>
                        {Number(b.delivery_fee) > 0 && (
                          <p>Dostava: {formatEUR(Number(b.delivery_fee))}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Plačilo</p>
                        <p>Skupaj: <span className="font-semibold">{formatEUR(Number(b.total_price))}</span></p>
                        <p>Polog: {formatEUR(Number(b.deposit_amount))}</p>
                        <p>Kavcija: {formatEUR(Number(b.security_deposit))}</p>
                        <p className="text-gray-400 mt-1">
                          Ustvarjeno: {format(parseISO(b.created_at), 'dd.MM.yyyy HH:mm')}
                        </p>
                      </div>
                    </div>

                    {b.pickup_location && (
                      <p><span className="text-gray-400">Prevzem:</span> {b.pickup_location}</p>
                    )}
                    {b.customer_message && (
                      <p><span className="text-gray-400">Sporočilo:</span> {b.customer_message}</p>
                    )}
                    {b.admin_notes && (
                      <p><span className="text-gray-400">Admin opomba:</span> {b.admin_notes}</p>
                    )}

                    {/* Status actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-400 self-center mr-1">
                        Spremeni status:
                      </span>
                      {allStatuses.map((s) => (
                        <Button
                          key={s}
                          variant={b.status === s ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs h-8"
                          disabled={b.status === s}
                          onClick={() => updateStatus(b.id, s)}
                        >
                          {statusConfig[s].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
