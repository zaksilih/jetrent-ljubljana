'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { homeContent } from '@/data/content'
import { featuredFAQs } from '@/data/faq'

export function FAQPreview() {
  const { faqPreview } = homeContent

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">
              {faqPreview.title}
            </h2>
            <p className="text-lg text-gray-600">
              {faqPreview.subtitle}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <Accordion type="single" collapsible className="space-y-0">
              {featuredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-gray-900">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* View all CTA */}
          <div className="text-center mt-8">
            <Button asChild variant="link" className="gap-2">
              <Link href="/vprasanja">
                {faqPreview.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
