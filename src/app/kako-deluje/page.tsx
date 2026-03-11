import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Send,
  CalendarCheck,
  MapPin,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  X,
  LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { howItWorksContent } from '@/data/content'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Kako deluje najem',
  description: 'Enostaven postopek najema jet skija Sea-Doo Spark od povpraševanja do vračila. Korak za korakom.',
}

// Icon mapping for steps
const stepIconMap: Record<string, LucideIcon> = {
  Send,
  CalendarCheck,
  MapPin,
  BookOpen,
  CheckCircle,
}

// Warning type colors
const warningStyles = {
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-800',
    textColor: 'text-yellow-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    textColor: 'text-red-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    textColor: 'text-blue-700',
  },
}

export default function KakoDelujePage() {
  const { hero, steps, checklist, warnings } = howItWorksContent

  return (
    <div className="page-padding-top">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="heading-2 text-gray-900 mb-4">{hero.title}</h1>
            <p className="text-lg text-gray-600">{hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {steps.map((step, index) => {
                const Icon = stepIconMap[step.icon] || CheckCircle
                return (
                  <div
                    key={index}
                    className="relative flex gap-6 pb-8 last:pb-0"
                  >
                    {/* Timeline line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-primary-100" />
                    )}

                    {/* Step number & icon */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold shadow-lg">
                        {step.step}
                      </div>
                      <div className="mt-3 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Checklist Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="heading-3 text-gray-900 mb-4">
                {checklist.title}
              </h2>
              <p className="text-gray-600">{checklist.subtitle}</p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              {checklist.items.map((item, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                          item.required
                            ? 'bg-primary-100'
                            : 'bg-gray-100'
                        )}
                      >
                        {item.required ? (
                          <Check className="w-4 h-4 text-primary-600" />
                        ) : (
                          <Info className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          {item.required && (
                            <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded">
                              Obvezno
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Warnings Section */}
      <section className="section-padding-sm bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="heading-3 text-gray-900 mb-4">
                {warnings.title}
              </h2>
            </div>

            {/* Warning Items */}
            <div className="space-y-4">
              {warnings.items.map((warning, index) => {
                const style = warningStyles[warning.type as keyof typeof warningStyles]
                const WarnIcon = style.icon
                return (
                  <div
                    key={index}
                    className={cn(
                      'rounded-xl border p-5',
                      style.bg,
                      style.border
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <WarnIcon
                        className={cn('w-6 h-6 shrink-0', style.iconColor)}
                      />
                      <div>
                        <h3
                          className={cn(
                            'font-semibold mb-1',
                            style.titleColor
                          )}
                        >
                          {warning.title}
                        </h3>
                        <p className={cn('text-sm', style.textColor)}>
                          {warning.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding-sm bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="heading-3 mb-4">Pripravljeni na najem?</h2>
            <p className="text-primary-100 mb-6">
              Pošljite nam povpraševanje in rezervirajte svoj termin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                <Link href="/kontakt">Pošlji povpraševanje</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/cenik">Poglej cenik</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
