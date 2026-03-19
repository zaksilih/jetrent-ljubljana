'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  DollarSign,
  Ship,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createAuthBrowser } from '@/lib/supabase/auth-browser'
import { AdminContext } from './admin-context'
import { cn } from '@/lib/utils'

// ── Sidebar navigation items ─────────────────────────────────

const navItems = [
  { href: '/admin/dashboard', label: 'Nadzorna plošča', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Rezervacije', icon: ClipboardList },
  { href: '/admin/calendar', label: 'Koledar', icon: CalendarDays },
  { href: '/admin/pricing', label: 'Cenik', icon: DollarSign },
  { href: '/admin/jetskis', label: 'Jet skiji', icon: Ship },
]

// ── Layout ───────────────────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const isLoginPage = pathname === '/admin/login'

  // Always call hooks in the same order regardless of route
  useEffect(() => {
    if (isLoginPage) return
    const supabase = createAuthBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || null)
    })
  }, [isLoginPage])

  const handleSignOut = useCallback(async () => {
    const supabase = createAuthBrowser()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }, [router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <AdminContext.Provider value={{ userEmail, signOut: handleSignOut }}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white flex flex-col transition-transform duration-200 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Branding */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
            <Image src="/logo.png" alt="Jet4You" width={36} height={36} className="w-9 h-9" />
            <div>
              <div className="font-bold text-sm leading-none">Jet4You</div>
              <div className="text-[11px] text-gray-400 mt-0.5">Admin panel</div>
            </div>
            <button
              className="ml-auto lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User + sign out */}
          <div className="border-t border-gray-800 px-4 py-4 space-y-3">
            {userEmail && (
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Odjava
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:ml-64">
          {/* Top bar (mobile) */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between px-4 h-14">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-semibold text-gray-900 text-sm">Jet4You Admin</span>
              <div className="w-6" />
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
