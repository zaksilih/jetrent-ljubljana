import { homeContent } from '@/data/content'

export function HowItWorks() {
  const { howItWorks } = homeContent

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            {howItWorks.title}
          </h2>
          <p className="text-lg text-gray-600">
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line (hidden on mobile) */}
                {index < howItWorks.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-100" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-5">
                    {step.step}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
