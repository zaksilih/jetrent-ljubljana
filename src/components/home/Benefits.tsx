import { MapPin, Truck, Waves, Percent, LucideIcon } from 'lucide-react'
import { homeContent } from '@/data/content'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  MapPin,
  Truck,
  Waves,
  Percent,
}

export function Benefits() {
  const { benefits } = homeContent

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            {benefits.title}
          </h2>
          <p className="text-lg text-gray-600">
            {benefits.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.items.map((item, index) => {
            const Icon = iconMap[item.icon] || Waves
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-5 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
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
