import { Waves } from 'lucide-react'

export default function Loading() {
  return (
    <div className="page-padding-top min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Waves className="w-12 h-12 text-primary-500 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 text-sm">Nalagam...</p>
      </div>
    </div>
  )
}
