import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeContent } from '@/data/content'
import { businessInfo } from '@/data/business'

export function ContactCTA() {
  const { contactCTA } = homeContent

  return (
    <section className="section-padding-sm bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Content */}
          <h2 className="heading-3 mb-4">
            {contactCTA.title}
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            {contactCTA.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50 shadow-lg"
            >
              <Link href="/kontakt" className="gap-2">
                {contactCTA.ctaText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <a href={`tel:${businessInfo.contact.phone}`} className="gap-2">
                <Phone className="w-5 h-5" />
                {businessInfo.contact.phone}
              </a>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-primary-200">
            <span>✓ Hiter odziv</span>
            <span>✓ Brez skritih stroškov</span>
            <span>✓ Prikolica vključena</span>
          </div>
        </div>
      </div>
    </section>
  )
}
