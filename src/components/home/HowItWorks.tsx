import Link from 'next/link'
import { ArrowRight, Send, CalendarCheck, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'

const stepIcons = [Send, CalendarCheck, MapPin]

export function HowItWorks() {
  const { howItWorks } = homeContent

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <Badge variant="secondary" className="mb-4">
            {howItWorks.label}
          </Badge>
          <h2 className="heading-2 text-gray-900 mb-4">
            {howItWorks.title}
          </h2>
          <p className="text-lg text-gray-500">
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps — premium horizontal timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            {howItWorks.steps.map((step, index) => {
              const Icon = stepIcons[index] || Send
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative z-10 w-24 h-24 rounded-2xl bg-white border-2 border-primary-100 shadow-lg flex flex-col items-center justify-center mb-6 group">
                    <Icon className="w-7 h-7 text-primary-500 mb-1" />
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                      {step.step}. korak
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Inline CTA */}
          <div className="text-center mt-14">
            <Button asChild variant="cta" size="lg">
              <Link href="/rezervacija" className="gap-2">
                Rezervirajte svoj termin
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
