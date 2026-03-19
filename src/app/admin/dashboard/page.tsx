'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Clock,
  CheckCircle2,
  CalendarClock,
  Euro,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatEUR } from '@/lib/booking'
import type { BookingStatus } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface Stats {
  pending: number
  confirmed: number
  upcoming: number
  totalRevenue: number
}

interface RecentBooking {
  id: string
  reference: string
  start_date: string
  end_date: string
  total_price: number
  status: BookingStatus
  created_at: string
  customers: { first_name: string; last_name: string } | null
  jetskis: { name: string } | null
}

const statusColors: Record<BookingStatus, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500',
  completed: 'bg-blue-100 text-blue-700',
}

const statusLabels: Record<BookingStatus, string> = {
  pending_payment: 'Čaka na plačilo',
  confirmed: 'Potrjeno',
  cancelled: 'Preklicano',
  expired: 'Poteklo',
  completed: 'Zaključeno',
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) return
        const data = await res.json()
        setStats(data.stats)
        setRecentBookings(data.recentBookings || [])
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  const widgets = [
    {
      label: 'Čaka na plačilo',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
      href: '/admin/bookings?status=pending_payment',
    },
    {
      label: 'Potrjene rezervacije',
      value: stats?.confirmed || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
      href: '/admin/bookings?status=confirmed',
    },
    {
      label: 'Prihajajoči najemi',
      value: stats?.upcoming || 0,
      icon: CalendarClock,
      color: 'text-primary-600 bg-primary-50',
      href: '/admin/bookings?status=confirmed',
    },
    {
      label: 'Skupni prihodek',
      value: formatEUR(stats?.totalRevenue || 0),
      icon: Euro,
      color: 'text-violet-600 bg-violet-50',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nadzorna plošča</h1>
        <p className="text-sm text-gray-500 mt-1">Pregled stanja rezervacij in prihodkov</p>
      </div>

      {/* Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w) => (
          <div
            key={w.label}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{w.label}</span>
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', w.color)}>
                <w.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{w.value}</p>
            {w.href && (
              <Link
                href={w.href}
                className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-flex items-center gap-1"
              >
                Prikaži vse <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Zadnje rezervacije</h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            Vse rezervacije <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentBookings.length === 0 && (
            <p className="text-center text-gray-400 py-10 text-sm">Ni rezervacij.</p>
          )}
          {recentBookings.map((b) => (
            <div
              key={b.id}
              className="px-5 py-3.5 flex items-center gap-4 text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="font-mono font-semibold text-gray-900 w-32 flex-shrink-0">
                {b.reference}
              </span>
              <span className="text-gray-600 truncate flex-1">
                {b.customers
                  ? `${b.customers.first_name} ${b.customers.last_name}`
                  : '—'}
              </span>
              <span className="text-gray-400 hidden sm:block flex-shrink-0">
                {b.jetskis?.name || '—'}
              </span>
              <Badge
                variant="outline"
                className={cn('text-xs flex-shrink-0 border-0', statusColors[b.status])}
              >
                {statusLabels[b.status]}
              </Badge>
              <span className="font-medium text-gray-900 flex-shrink-0 w-20 text-right">
                {formatEUR(Number(b.total_price))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
