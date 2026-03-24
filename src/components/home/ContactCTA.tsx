import Link from 'next/link'
import { ArrowRight, Phone, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { homeContent } from '@/data/content'
import { businessInfo } from '@/data/business'

export function ContactCTA() {
  const { contactCTA } = homeContent

  return (
    <section className="relative overflow-hidden">
      {/* Dark premium background */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-20 lg:py-28">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAyIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-60" />
        {/* Gradient orb */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary-400/5 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              {contactCTA.title}
            </h2>
            <p className="text-primary-200 text-lg sm:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              {contactCTA.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl shadow-black/10 font-semibold"
              >
                <Link href="/rezervacija" className="gap-2">
                  {contactCTA.ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <a href={`tel:${businessInfo.contact.phone}`} className="gap-2">
                  <Phone className="w-5 h-5" />
                  {contactCTA.phone || contactCTA.secondaryCTA}
                </a>
              </Button>
            </div>

            {/* Urgency / trust microcopy */}
            <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {contactCTA.urgencyNote.split(' • ').map((note, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-primary-300">
                  <CheckCircle className="w-4 h-4 text-secondary-400" />
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
