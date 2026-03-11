import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Politika zasebnosti',
  description: 'Politika zasebnosti spletne strani JetRent Ljubljana.',
}

export default function ZasebnostPage() {
  return (
    <div className="page-padding-top">
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Nazaj na domov
              </Link>
            </Button>

            <h1 className="heading-2 text-gray-900 mb-8">Politika zasebnosti</h1>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Ta stran je rezervirana za politiko zasebnosti. Vsebino bo
                potrebno dopolniti pred javno objavo.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-yellow-800 font-medium mb-2">
                  Opomba za lastnika
                </p>
                <p className="text-yellow-700 text-sm">
                  Pred javno objavo spletne strani je potrebno pripraviti politiko
                  zasebnosti v skladu z GDPR zakonodajo. Priporočamo posvet s
                  pravnim strokovnjakom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
