import Link from 'next/link'
import { ArrowRight, Check, Star, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'
import { pricingTiers } from '@/data/pricing'

export function PricingPreview() {
  const { pricingPreview } = homeContent
  const previewTiers = pricingTiers

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <Badge variant="secondary" className="mb-4">
            {pricingPreview.label}
          </Badge>
          <h2 className="heading-2 text-gray-900 mb-4">
            {pricingPreview.title}
          </h2>
          <p className="text-lg text-gray-500">
            {pricingPreview.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {previewTiers.map((tier) => (
            <Card
              key={tier.id}
              highlight={tier.isRecommended}
              className={`relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                tier.isRecommended
                  ? 'lg:scale-[1.03] bg-gradient-to-b from-white to-primary-50/30'
                  : ''
              }`}
            >
              {/* Recommended badge */}
              {tier.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1 gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    Najbolj priljubljen
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{tier.title}</CardTitle>
                {tier.period && (
                  <p className="text-xs text-gray-400 mt-1">{tier.period}</p>
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
                  <span className="text-gray-400 ml-1">/dan</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button asChild variant={tier.isRecommended ? 'cta' : 'secondary'} className="w-full">
                  <Link href="/rezervacija">Povpraševanje</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Urgency note */}
        {pricingPreview.urgencyNote && (
          <p className="text-center mt-10 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-3 px-6 max-w-lg mx-auto">
            {pricingPreview.urgencyNote}
          </p>
        )}

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Button asChild variant="link" className="gap-2 text-primary-600">
            <Link href="/cenik">
              {pricingPreview.ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
