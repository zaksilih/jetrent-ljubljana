import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { businessInfo } from '@/data/business'

const inter = Inter({ 
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: businessInfo.seo.defaultTitle,
    template: `%s | ${businessInfo.seo.siteName}`,
  },
  description: businessInfo.seo.defaultDescription,
  keywords: businessInfo.seo.keywords,
  authors: [{ name: businessInfo.name }],
  creator: businessInfo.name,
  metadataBase: new URL('https://jetrent-ljubljana.si'),
  openGraph: {
    type: 'website',
    locale: 'sl_SI',
    siteName: businessInfo.seo.siteName,
    title: businessInfo.seo.defaultTitle,
    description: businessInfo.seo.defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: businessInfo.seo.defaultTitle,
    description: businessInfo.seo.defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sl" className={inter.variable}>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
