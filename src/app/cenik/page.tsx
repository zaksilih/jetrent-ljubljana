import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Star, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { pricingTiers, pricingNotes } from '@/data/pricing'
import { pricingContent } from '@/data/content'

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
                    <Link href="/kontakt">Pošlji povpraševanje</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Notes */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Pomembne informacije
                  </h3>
                  <ul className="space-y-3">
                    {pricingNotes.map((note, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-primary-500 mt-1">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
              <Link href="/kontakt">Pošlji povpraševanje</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
