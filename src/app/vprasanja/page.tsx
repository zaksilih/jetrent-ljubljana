'use client'

import Link from 'next/link'
import { Search, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { faqItems, type FAQItem } from '@/data/faq'

export default function VprasanjaPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? faqItems.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems

  return (
    <div className="page-padding-top">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="heading-2 text-gray-900 mb-4">
              Pogosta vprašanja
            </h1>
            <p className="text-lg text-gray-600">
              Odgovori na najpogostejša vprašanja o najemu jet skija.
            </p>
          </div>
        </div>
      </section>

      {/* Search & FAQs */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Search */}
            <div className="relative mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Išči po vprašanjih..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
            </div>

            {/* FAQ Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-0">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left text-gray-900">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Ni najdenih vprašanj za &quot;{searchQuery}&quot;
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Počisti iskanje
                  </button>
                </div>
              )}
            </div>

            {/* FAQ Count */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Prikazanih {filteredFAQs.length} od {faqItems.length} vprašanj
            </p>
          </div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="section-padding-sm bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-3 text-gray-900 mb-4">
              Niste našli odgovora?
            </h2>
            <p className="text-gray-600 mb-6">
              Pošljite nam vprašanje in z veseljem vam odgovorimo.
            </p>
            <Button asChild variant="cta" size="lg">
              <Link href="/kontakt">Kontaktirajte nas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
