'use client'

import Link from 'next/link'
import { ArrowRight, MessageCircleQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
          <div className="text-center mb-12 lg:mb-16">
            <Badge variant="secondary" className="mb-4">
              <MessageCircleQuestion className="w-3.5 h-3.5 mr-1.5" />
              {faqPreview.label}
            </Badge>
            <h2 className="heading-2 text-gray-900 mb-4">
              {faqPreview.title}
            </h2>
            <p className="text-lg text-gray-500">
              {faqPreview.subtitle}
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
            <Accordion type="single" collapsible>
              {featuredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="px-6 lg:px-8">
                  <AccordionTrigger className="text-left text-gray-900 py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* View all CTA */}
          <div className="text-center mt-10">
            <Button asChild variant="link" className="gap-2 text-primary-600">
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
