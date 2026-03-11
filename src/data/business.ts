// Business information - easy to edit in one place
export const businessInfo = {
  name: 'JetRent Ljubljana',
  tagline: 'Najem jet skija za vaš dopust',
  
  // Contact placeholders - replace with real values
  contact: {
    email: 'info@jetrent-ljubljana.si',
    phone: '+386 40 123 456',
    address: 'Ljubljana, Slovenija',
    pickupLocation: 'Okolica Ljubljane (po dogovoru)',
  },
  
  // Social media placeholders
  social: {
    instagram: 'https://instagram.com/jetrent-ljubljana',
    facebook: 'https://facebook.com/jetrent-ljubljana',
  },
  
  // SEO defaults
  seo: {
    siteName: 'JetRent Ljubljana',
    defaultTitle: 'Najem Jet Skija | JetRent Ljubljana',
    defaultDescription: 'Ugoden najem jet skija Sea-Doo Spark za tedenski dopust na Hrvaškem. Prevzem v Ljubljani, prikolica vključena. Rezervirajte zdaj!',
    keywords: ['najem jet ski', 'jet ski Ljubljana', 'sea-doo najem', 'jet ski Hrvaška', 'najem plovila'],
  },
  
  // Product info
  product: {
    model: 'Sea-Doo Spark 2UP',
    year: 2023,
    features: [
      'Kompakten in lahek za vožnjo',
      'Enostaven za uporabo',
      'Ekonomičen na gorivo',
      'Idealen za 1-2 osebi',
    ],
  },
  
  // Rental requirements
  requirements: {
    minAge: 18,
    license: 'Vozniško dovoljenje B kategorije',
    deposit: 500, // EUR
    depositNote: 'Kavcija se vrne ob nepoškodovanem vračilu',
  },
  
  // Business rules
  rules: {
    preferredRentalDays: [7, 14],
    minRentalDays: 1,
    pickupTime: 'Po dogovoru',
    returnTime: 'Po dogovoru',
  },
}

export type BusinessInfo = typeof businessInfo
