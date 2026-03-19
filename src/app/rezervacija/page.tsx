import type { Metadata } from 'next'
import { bookingContent } from '@/data/booking'
import BookingWizard from '@/components/booking/BookingWizard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: bookingContent.page.title,
  description: bookingContent.page.description,
}

export default function ReservationPage() {
  return (
    <div className="page-padding-top">
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <BookingWizard />
        </div>
      </section>
    </div>
  )
}
