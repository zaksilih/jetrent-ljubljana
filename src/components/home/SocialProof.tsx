import { Star, Clock, Award } from 'lucide-react'
import { homeContent } from '@/data/content'

const statIcons = [Award, Star, Clock]

export function SocialProof() {
  const { socialProof } = homeContent
  const stats = [socialProof.stat1, socialProof.stat2, socialProof.stat3]

  return (
    <section className="relative -mt-8 z-10 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-6 py-5 lg:px-10 lg:py-6">
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              {stats.map((stat, index) => {
                const Icon = statIcons[index]
                return (
                  <div key={index} className="flex flex-col items-center text-center px-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary-500 hidden sm:block" />
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">{stat.label}</span>
                  </div>
                )
              })}
            </div>
            {socialProof.subtitle && (
              <p className="text-center text-xs text-gray-400 mt-4 px-4">
                {socialProof.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
