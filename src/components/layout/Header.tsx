'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavigation } from '@/data/navigation'
import { businessInfo } from '@/data/business'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Pages with dark hero that need light header text when not scrolled
  const isDarkHero = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // When on a dark hero page and not scrolled, use light colors
  const isLight = isDarkHero && !scrolled && !mobileMenuOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || mobileMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              'flex items-center gap-2 font-bold text-xl transition-colors',
              isLight
                ? 'text-white hover:text-primary-200'
                : 'text-primary-600 hover:text-primary-700'
            )}
          >
            <Image src="/logo.png" alt={businessInfo.name} width={44} height={44} className="h-11 w-11 object-contain" />
            <span className="hidden sm:inline">{businessInfo.name}</span>
            <span className="sm:hidden">Jet4You</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium uppercase tracking-wide transition-colors',
                  isLight
                    ? pathname === item.href
                      ? 'text-white'
                      : 'text-primary-200 hover:text-white'
                    : pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button asChild variant="cta">
              <Link href="/rezervacija">Rezervacija</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={cn(
              'lg:hidden inline-flex items-center justify-center p-2 rounded-lg transition-colors',
              isLight
                ? 'text-white hover:text-primary-200 hover:bg-white/10'
                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          )}
        >
          <div className={cn(
            'flex flex-col gap-2 pt-4 border-t',
            isLight ? 'border-white/10' : 'border-gray-100'
          )}>
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-base font-medium uppercase tracking-wide transition-colors',
                  isLight
                    ? pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-primary-200 hover:bg-white/10 hover:text-white'
                    : pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild variant="cta" className="w-full">
                <Link href="/rezervacija">Rezervacija</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
