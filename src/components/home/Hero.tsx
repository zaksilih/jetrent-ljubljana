import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'

export function Hero() {
  const { hero } = homeContent

  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster=""
      >
        <source src="/video/hero_video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/80 via-primary-950/60 to-primary-950/80" />

      {/* Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="page-padding-top pb-20 lg:pb-28 min-h-screen flex flex-col justify-center">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Urgency badge */}
            <Badge variant="outline" className="mb-8 px-4 py-2 border-secondary-400/40 text-secondary-300 bg-secondary-400/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-secondary-400" />
              {hero.badge}
            </Badge>

            {/* Main Heading — split line for drama */}
            <h1 className="heading-1 mb-6 leading-[1.1]">
              <span className="text-white drop-shadow-lg">{hero.title}</span>
              <br />
              <span className="bg-gradient-to-r from-secondary-300 via-secondary-400 to-secondary-300 bg-clip-text text-transparent drop-shadow-lg">
                {hero.titleAccent}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed text-balance drop-shadow-sm">
              {hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild variant="cta" size="xl" className="shadow-xl shadow-primary-500/25">
                <Link href="/kontakt" className="gap-2">
                  {hero.primaryCTA}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                className="border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Link href="/cenik">
                  {hero.secondaryCTA}
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {hero.trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
