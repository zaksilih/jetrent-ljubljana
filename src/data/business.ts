// Business information - easy to edit in one place
export const businessInfo = {
  name: 'Jet4You',
  tagline: 'Najem jet skija za vaš dopust',
  
  // Contact placeholders - replace with real values
  contact: {
    email: 'info@jet4you.si',
    phone: '+386 40 123 456',
    address: 'Ljubljana, Slovenija',
    pickupLocation: 'Okolica Ljubljane (po dogovoru)',
  },
  
  // Social media placeholders
  social: {
    instagram: 'https://instagram.com/jet4you',
    facebook: 'https://facebook.com/jet4you',
  },
  
  // SEO defaults
  seo: {
    siteName: 'Jet4You',
    defaultTitle: 'Najem Jet Skija | Jet4You',
    defaultDescription: 'Ugoden najem jet skija Sea-Doo Spark za tedenski dopust na Hrvaškem. Prevzem v Ljubljani, prikolica vključena. Rezervirajte zdaj!',
    keywords: ['najem jet ski', 'jet ski Ljubljana', 'sea-doo najem', 'jet ski Hrvaška', 'najem plovila'],
  },
  
  // Product info
  product: {
    model: 'Sea-Doo Spark 2UP 90HP',
    year: 2016,
    engine: 'Rotax 900 ACE',
    horsepower: 90,
    fuelType: 'Bencin 95 (neosvinčen)',
    fuelCapacity: 30, // litrov
    fuelConsumption: '8–12 L/h',
    weight: 185, // kg (suha teža)
    length: 287, // cm
    width: 119, // cm
    capacity: 2, // oseb
    topSpeed: 80, // km/h (približno)
    features: [
      'Kompakten in lahek za vožnjo',
      'Enostaven za uporabo',
      'Ekonomičen na gorivo',
      'Idealen za 1-2 osebi',
    ],
    images: [
      '/images/1.jpg',
      '/images/2.png',
      '/images/3.jpg',
      '/images/4.jpg',
      '/images/5.jpg',
      '/images/6.jpg',
      '/images/7.jpg',
      '/images/8.jpg',
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
