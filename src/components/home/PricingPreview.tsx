import Link from 'next/link'
import { ArrowRight, Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'
import { pricingTiers } from '@/data/pricing'

export function PricingPreview() {
  const { pricingPreview } = homeContent
  // Show only first 3 pricing tiers on homepage
  const previewTiers = pricingTiers.slice(0, 3)

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            {pricingPreview.title}
          </h2>
          <p className="text-lg text-gray-600">
            {pricingPreview.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {previewTiers.map((tier) => (
            <Card
              key={tier.id}
              highlight={tier.isRecommended}
              className={`relative flex flex-col card-hover ${
                tier.isRecommended ? 'lg:scale-105' : ''
              }`}
            >
              {/* Recommended badge */}
              {tier.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-4 py-1 gap-1">
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
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {tier.pricePerDay} €
                  </span>
                  <span className="text-gray-500 ml-1">/dan</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button asChild variant={tier.isRecommended ? 'cta' : 'secondary'} className="w-full">
                  <Link href="/kontakt">Povpraševanje</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-10">
          <Button asChild variant="link" className="gap-2">
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
