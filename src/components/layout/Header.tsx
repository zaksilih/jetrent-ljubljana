'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mainNavigation } from '@/data/navigation'
import { businessInfo } from '@/data/business'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Waves className="h-7 w-7" />
            <span className="hidden sm:inline">{businessInfo.name}</span>
            <span className="sm:hidden">JetRent</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700'
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button asChild variant="cta">
              <Link href="/kontakt">Povpraševanje</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-100 transition-colors"
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
            mobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
            {mainNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button asChild variant="cta" className="w-full">
                <Link href="/kontakt">Pošlji povpraševanje</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
