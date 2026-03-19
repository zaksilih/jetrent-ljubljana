import { differenceInDays, format, isWithinInterval, parseISO, addDays } from 'date-fns'
import { seasons } from '@/data/pricing'

// ── Pricing calculation ──────────────────────────────────────

export interface PriceBreakdown {
  numDays: number
  dailyRate: number
  rentalTotal: number
  deliveryKm: number
  deliveryFee: number
  totalPrice: number
  depositAmount: number      // 20% upfront
  securityDeposit: number    // 500 EUR in cash
  remainingAmount: number    // totalPrice - depositAmount
}

const DELIVERY_RATE_PER_KM = 0.7
const SECURITY_DEPOSIT = 500
const DEPOSIT_PERCENTAGE = 0.2

/**
 * Determine which season a date falls into.
 * High season: June 25 – August 20
 * Low season: May 1 – June 24 & August 21 – September 30
 * Off-season (short-term rate): everything else
 */
export function getSeasonForDate(date: Date, year: number): 'high' | 'low' | 'short' {
  const highStart = parseISO(`${year}-${seasons.highSeason.start}`)
  const highEnd = parseISO(`${year}-${seasons.highSeason.end}`)

  if (isWithinInterval(date, { start: highStart, end: highEnd })) {
    return 'high'
  }

  const lowSpringStart = parseISO(`${year}-${seasons.lowSeason.spring.start}`)
  const lowSpringEnd = parseISO(`${year}-${seasons.lowSeason.spring.end}`)
  const lowAutumnStart = parseISO(`${year}-${seasons.lowSeason.autumn.start}`)
  const lowAutumnEnd = parseISO(`${year}-${seasons.lowSeason.autumn.end}`)

  if (
    isWithinInterval(date, { start: lowSpringStart, end: lowSpringEnd }) ||
    isWithinInterval(date, { start: lowAutumnStart, end: lowAutumnEnd })
  ) {
    return 'low'
  }

  return 'short'
}

/**
 * Get the daily rate for a jet ski given the season.
 */
export function getDailyRate(
  season: 'high' | 'low' | 'short',
  prices: { low: number; high: number; short: number }
): number {
  switch (season) {
    case 'high': return prices.high
    case 'low': return prices.low
    case 'short': return prices.short
  }
}

/**
 * Calculate complete price breakdown for a booking.
 * Uses the season of the START date for the whole rental.
 */
export function calculatePrice(
  startDate: Date,
  endDate: Date,
  prices: { low: number; high: number; short: number },
  deliveryKm = 0
): PriceBreakdown {
  const numDays = differenceInDays(endDate, startDate)
  const season = getSeasonForDate(startDate, startDate.getFullYear())
  const dailyRate = getDailyRate(season, prices)
  const rentalTotal = numDays * dailyRate
  const deliveryFee = Math.round(deliveryKm * DELIVERY_RATE_PER_KM * 100) / 100
  const totalPrice = rentalTotal + deliveryFee
  const depositAmount = Math.ceil(rentalTotal * DEPOSIT_PERCENTAGE)
  const remainingAmount = totalPrice - depositAmount

  return {
    numDays,
    dailyRate,
    rentalTotal,
    deliveryKm,
    deliveryFee,
    totalPrice,
    depositAmount,
    securityDeposit: SECURITY_DEPOSIT,
    remainingAmount,
  }
}

// ── Per-day pricing with rules ───────────────────────────────

export interface DailyPricing {
  date: string      // YYYY-MM-DD
  rate: number      // price for that day
  source: string    // rule name or 'default'
}

export interface PricingRuleRow {
  id: string
  name: string
  rule_type: string
  start_date: string
  end_date: string
  price_per_day: number
  priority: number
  is_active: boolean
}

/**
 * Calculate price using pricing rules from the database.
 * For each day in the range, finds the highest-priority active rule
 * that covers that date. Falls back to the jet ski's default seasonal price.
 */
export function calculatePriceWithRules(
  startDate: Date,
  endDate: Date,
  defaultPrices: { low: number; high: number; short: number },
  rules: PricingRuleRow[],
  deliveryKm = 0
): PriceBreakdown & { dailyRates: DailyPricing[] } {
  const numDays = differenceInDays(endDate, startDate)
  const dailyRates: DailyPricing[] = []

  let rentalTotal = 0

  for (let i = 0; i < numDays; i++) {
    const day = addDays(startDate, i)
    const dayStr = format(day, 'yyyy-MM-dd')

    // Find matching rule with highest priority
    let matchedRule: PricingRuleRow | null = null
    for (const rule of rules) {
      if (!rule.is_active) continue
      if (dayStr >= rule.start_date && dayStr <= rule.end_date) {
        if (!matchedRule || rule.priority > matchedRule.priority) {
          matchedRule = rule
        }
      }
    }

    let rate: number
    let source: string

    if (matchedRule) {
      rate = Number(matchedRule.price_per_day)
      source = matchedRule.name
    } else {
      // Fall back to default seasonal pricing
      const season = getSeasonForDate(day, day.getFullYear())
      rate = getDailyRate(season, defaultPrices)
      source = 'default'
    }

    dailyRates.push({ date: dayStr, rate, source })
    rentalTotal += rate
  }

  const avgDailyRate = numDays > 0 ? Math.round((rentalTotal / numDays) * 100) / 100 : 0
  const deliveryFee = Math.round(deliveryKm * DELIVERY_RATE_PER_KM * 100) / 100
  const totalPrice = rentalTotal + deliveryFee
  const depositAmount = Math.ceil(rentalTotal * DEPOSIT_PERCENTAGE)
  const remainingAmount = totalPrice - depositAmount

  return {
    numDays,
    dailyRate: avgDailyRate,
    dailyRates,
    rentalTotal,
    deliveryKm,
    deliveryFee,
    totalPrice,
    depositAmount,
    securityDeposit: SECURITY_DEPOSIT,
    remainingAmount,
  }
}

// ── Availability helpers ─────────────────────────────────────

export interface DateRange {
  start: string  // ISO date string YYYY-MM-DD
  end: string
}

export interface AvailabilityData {
  booked: DateRange[]       // confirmed bookings
  pending: DateRange[]      // pending_payment bookings
  blocked: DateRange[]      // maintenance / manual blocks
}

/**
 * Check whether a candidate range overlaps any existing range.
 */
export function hasOverlap(
  start: Date,
  end: Date,
  ranges: DateRange[]
): boolean {
  return ranges.some(range => {
    const rStart = parseISO(range.start)
    const rEnd = parseISO(range.end)
    return start < rEnd && end > rStart
  })
}

// ── Booking reference ────────────────────────────────────────

export function formatReference(ref: string): string {
  return ref.toUpperCase()
}

// ── Validation ───────────────────────────────────────────────

export interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  message?: string
  pickupLocation?: string
  deliveryKm?: number
}

export interface CustomerFormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  country?: string
}

export function validateCustomerForm(data: CustomerFormData): CustomerFormErrors {
  const errors: CustomerFormErrors = {}

  if (!data.firstName.trim()) errors.firstName = 'Ime je obvezno'
  if (!data.lastName.trim()) errors.lastName = 'Priimek je obvezan'
  if (!data.email.trim()) {
    errors.email = 'E-pošta je obvezna'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Neveljavna e-pošta'
  }
  if (!data.phone.trim()) {
    errors.phone = 'Telefon je obvezan'
  } else if (!/^\+?[\d\s()-]{7,20}$/.test(data.phone)) {
    errors.phone = 'Neveljavna telefonska številka'
  }
  if (!data.country.trim()) errors.country = 'Država je obvezna'

  return errors
}

// ── Bank transfer info ───────────────────────────────────────

export const bankDetails = {
  accountHolder: 'Jet4You d.o.o.',
  bank: 'NLB d.d.',
  iban: 'SI56 0000 0000 0000 000', // Replace with real IBAN
  swift: 'LJBASI2X',
  purpose: 'Polog za najem jet skija',
}

// ── Format helpers ───────────────────────────────────────────

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat('sl-SI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return new Intl.DateTimeFormat('sl-SI', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/** Format a Date to YYYY-MM-DD in **local** time (avoids UTC shift from toISOString). */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}
