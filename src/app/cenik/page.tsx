import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Star, Info, CalendarClock, Car, FileCheck, MapPin, Coins, ShieldCheck, Fuel } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { pricingTiers } from '@/data/pricing'
import { pricingContent } from '@/data/content'

const importantNotes = [
  {
    icon: CalendarClock,
    text: 'Prednost pri rezervaciji imajo tedenski in dvotedenski najemi.',
  },
  {
    icon: Car,
    text: 'Stranka mora imeti vozilo s kljuko za vleko prikolice.',
  },
  {
    icon: FileCheck,
    text: 'Stranka mora imeti veljavno dovoljenje za voditelja čolna.',
  },
  {
    icon: MapPin,
    text: 'Prevzem in vračilo potekata po dogovoru v okolici Ljubljane.',
  },
  {
    icon: Coins,
    text: 'Ob prevzemu je obvezna kavcija v višini 500 €.',
  },
  {
    icon: ShieldCheck,
    text: 'Kavcija se vrne v celoti ob vrnitvi nepoškodovanega plovila.',
  },
  {
    icon: Fuel,
    text: 'Cene ne vključujejo goriva – stranka vrne z istim nivojem goriva.',
  },
]

export const metadata: Metadata = {
  title: 'Cenik najema jet skija',
  description: 'Pregledne cene najema jet skija Sea-Doo Spark. Nizka sezona od 60€/dan, visoka sezona od 80€/dan. Prikolica vključena.',
}

export default function CenikPage() {
  const { hero } = pricingContent

  return (
    <div className="page-padding-top">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              {hero.badge}
            </Badge>
            <h1 className="heading-2 text-gray-900 mb-4">
              {hero.title}
            </h1>
            <p className="text-lg text-gray-600">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.id}
                highlight={tier.isRecommended}
                className={`relative flex flex-col card-hover ${
                  tier.isRecommended ? 'lg:scale-[1.02]' : ''
                }`}
              >
                {/* Recommended badge */}
                {tier.isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="px-4 py-1 gap-1 shadow-md">
                      <Star className="w-3 h-3" />
                      Priporočeno
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{tier.title}</CardTitle>
                  {tier.period && (
                    <p className="text-xs text-gray-500 mt-1">{tier.period}</p>
                  )}
                  <CardDescription className="mt-2">
                    {tier.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.pricePerDay} €
                    </span>
                    <span className="text-gray-500 ml-1">/dan</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Note */}
                  {tier.note && (
                    <p className="mt-4 text-xs text-gray-500 italic">
                      {tier.note}
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    variant={tier.isRecommended ? 'cta' : 'secondary'}
                    className="w-full"
                  >
                    <Link href="/rezervacija">Pošlji povpraševanje</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pomembne informacije */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 py-16 lg:py-20">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAyIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-40" />
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-3xl" />

          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Pomembne informacije
              </h2>
              <p className="text-primary-200 text-lg">
                Za nemoteno in varno izkušnjo, preberite spodnje pogoje.
              </p>
            </div>

            {/* Grid of info cards */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {importantNotes.slice(0, 6).map((note, index) => {
                const Icon = note.icon
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary-700/60 to-primary-700/40 border border-primary-600/30 backdrop-blur-sm px-5 py-4 transition-colors hover:from-primary-700/80 hover:to-primary-700/60"
                  >
                    <div className="w-11 h-11 rounded-lg bg-primary-500/20 border border-primary-400/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-300" />
                    </div>
                    <span className="text-sm text-primary-100 leading-snug">
                      {note.text}
                    </span>
                  </div>
                )
              })}
              {/* Last item spans full width */}
              {importantNotes.length > 6 && (() => {
                const lastNote = importantNotes[6]
                const Icon = lastNote.icon
                return (
                  <div
                    className="sm:col-span-2 flex items-center gap-4 rounded-xl bg-gradient-to-r from-primary-700/60 to-primary-700/40 border border-primary-600/30 backdrop-blur-sm px-5 py-4 transition-colors hover:from-primary-700/80 hover:to-primary-700/60"
                  >
                    <div className="w-11 h-11 rounded-lg bg-primary-500/20 border border-primary-400/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-300" />
                    </div>
                    <span className="text-sm text-primary-100 leading-snug">
                      {lastNote.text}
                    </span>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-sm bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="heading-3 mb-4">
              Imate vprašanja o cenah?
            </h2>
            <p className="text-primary-100 mb-6">
              Pošljite nam povpraševanje in z veseljem vam pripravimo ponudbo za vaš termin.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <Link href="/rezervacija">Pošlji povpraševanje</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
