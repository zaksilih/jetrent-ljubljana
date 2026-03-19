import { MapPin, Truck, FileCheck, TrendingDown, Zap, ShieldCheck, LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { homeContent } from '@/data/content'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Truck,
  FileCheck,
  TrendingDown,
  Zap,
  ShieldCheck,
}

export function Benefits() {
  const { benefits } = homeContent

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-60" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <Badge variant="secondary" className="mb-4">
            {benefits.label}
          </Badge>
          <h2 className="heading-2 text-gray-900 mb-4">
            {benefits.title}
          </h2>
          <p className="text-lg text-gray-500">
            {benefits.subtitle}
          </p>
        </div>

        {/* Benefits Grid — 3×2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.items.map((item, index) => {
            const Icon = iconMap[item.icon] || ShieldCheck
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-7 lg:p-8 border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 flex items-center justify-center mb-5 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
