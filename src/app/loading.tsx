import Image from 'next/image'

export default function Loading() {
  return (
    <div className="page-padding-top min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Image src="/logo.png" alt="Jet4You" width={48} height={48} className="w-12 h-12 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 text-sm">Nalagam...</p>
      </div>
    </div>
  )
}
