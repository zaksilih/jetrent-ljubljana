import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="page-padding-top min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Stran ni najdena
          </h2>
          <p className="text-gray-600 mb-8">
            Stran, ki jo iščete, ne obstaja ali je bila premaknjena.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="cta">
              <Link href="/" className="gap-2">
                <Home className="w-4 h-4" />
                Domov
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/kontakt" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kontakt
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
