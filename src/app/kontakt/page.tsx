import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { InquiryForm } from './InquiryForm'
import { businessInfo } from '@/data/business'
import { contactContent } from '@/data/content'

export const metadata: Metadata = {
  title: 'Kontakt in povpraševanje',
  description: 'Pošljite povpraševanje za najem jet skija Sea-Doo Spark. Hitro in enostavno rezervirajte svoj termin.',
}

export default function KontaktPage() {
  const { hero, contactInfo } = contactContent

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

      {/* Form & Contact Info */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Form */}
              <div className="lg:col-span-3">
                <Card className="border-gray-200">
                  <CardContent className="p-6 lg:p-8">
                    <InquiryForm />
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2">
                <div className="sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {contactInfo.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{contactInfo.subtitle}</p>

                  <div className="space-y-4">
                    {/* Email */}
                    <a
                      href={`mailto:${businessInfo.contact.email}`}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <Mail className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">E-pošta</p>
                        <p className="text-primary-600 text-sm">
                          {businessInfo.contact.email}
                        </p>
                      </div>
                    </a>

                    {/* Phone */}
                    <a
                      href={`tel:${businessInfo.contact.phone}`}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                        <Phone className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Telefon</p>
                        <p className="text-primary-600 text-sm">
                          {businessInfo.contact.phone}
                        </p>
                      </div>
                    </a>

                    {/* Location */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Prevzem</p>
                        <p className="text-gray-600 text-sm">
                          {businessInfo.contact.pickupLocation}
                        </p>
                      </div>
                    </div>

                    {/* Response time */}
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Odzivni čas</p>
                        <p className="text-gray-600 text-sm">
                          Običajno odgovorimo v 24 urah
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional note */}
                  <div className="mt-8 p-4 rounded-xl bg-primary-50 border border-primary-100">
                    <p className="text-sm text-primary-800">
                      <strong>Nasvet:</strong> Za hitrejši odziv priporočamo, da v sporočilu
                      navedete želeni termin in destinacijo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
