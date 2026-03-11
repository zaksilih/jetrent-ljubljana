import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'

export function Hero() {
  const { hero } = homeContent

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMDZhY2Q2IiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-50" />
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-padding-top pb-16 lg:pb-24">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {hero.badge}
            </Badge>

            {/* Main Heading */}
            <h1 className="heading-1 text-gray-900 mb-6">
              <span className="gradient-text">{hero.title}</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed text-balance">
              {hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild variant="cta" size="xl">
                <Link href="/kontakt" className="gap-2">
                  {hero.primaryCTA}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="xl">
                <Link href="/cenik">
                  {hero.secondaryCTA}
                </Link>
              </Button>
            </div>

            {/* Trust indicator */}
            <p className="mt-10 text-sm text-gray-500">
              Sea-Doo Spark 2UP • Prikolica vključena • Prevzem Ljubljana
            </p>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-12 lg:mt-16 relative">
            <div className="aspect-[16/9] lg:aspect-[21/9] bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
              {/* Placeholder for hero image */}
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-300/50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-primary-700 font-medium">
                  Dodajte sliko Sea-Doo Spark jet skija
                </p>
                <p className="text-primary-600/70 text-sm mt-1">
                  Priporočena velikost: 1920 x 800 px
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-400/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
