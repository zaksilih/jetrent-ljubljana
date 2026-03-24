// Pricing configuration - easy to update seasonally
export interface PricingTier {
  id: string
  title: string
  pricePerDay: number
  description: string
  period?: string
  features: string[]
  isRecommended?: boolean
  note?: string
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'low-season',
    title: 'Nizka sezona',
    pricePerDay: 60,
    period: '1. maj – 24. junij in 21. avg – 30. sept',
    description: 'Idealno za zgodnje poletne ali jesenske počitnice',
    features: [
      'Od 60 €/dan za tedenski najem',
      'Prikolica vključena',
      'Brez gneče na morju',
      'Prilagodljivi termini',
    ],
    isRecommended: false,
  },
  {
    id: 'high-season',
    title: 'Visoka sezona',
    pricePerDay: 80,
    period: '25. junij – 20. avgust',
    description: 'Vrhunec poletja za nepozabne trenutke',
    features: [
      'Od 80 €/dan za tedenski najem',
      'Prikolica vključena',
      'Rezervirajte zgodaj',
      'Najbolj priljubljeni termini',
    ],
    isRecommended: true,
    note: 'Priporočamo rezervacijo vsaj 2 tedna vnaprej',
  },
  {
    id: 'weekend',
    title: 'Vikend najem',
    pricePerDay: 90,
    description: 'Petek popoldan do nedelje popoldan',
    features: [
      '90 €/dan (3 dni)',
      'Skupaj 270 €',
      'Idealno za kratek pobeg',
      'Ob razpoložljivosti',
    ],
    isRecommended: false,
  },
  {
    id: 'short-term',
    title: 'Enodnevni najem',
    pricePerDay: 100,
    description: 'Za krajše dogodivščine in preizkus',
    features: [
      '100 €/dan',
      'Prikolica vključena',
      'Ob razpoložljivosti',
    ],
    isRecommended: false,
    note: 'Prednost imajo tedenski najemi',
  },
]

// Pricing notes displayed below pricing cards
export const pricingNotes = [
  'Tedenski in dvotedenski najemi imajo prednost pri rezervaciji.',
  'Stranka mora imeti vozilo s kljuko za vleko prikolice.',
  'Stranka mora imeti veljavno dovoljenje za voditelja čolna.',
  'Prevzem in vračilo potekata po dogovoru v okolici Ljubljane.',
  'Ob prevzemu je obvezna kavcija v višini 500 €.',
  'Kavcija se vrne v celoti ob vrnitvi nepoškodovanega plovila.',
  'Cene ne vključujejo goriva – stranka vrne z istim nivojem goriva.',
]

// Season dates for reference
export const seasons = {
  lowSeason: {
    spring: { start: '05-01', end: '06-24' },
    autumn: { start: '08-21', end: '09-30' },
  },
  highSeason: {
    start: '06-25',
    end: '08-20',
  },
}
