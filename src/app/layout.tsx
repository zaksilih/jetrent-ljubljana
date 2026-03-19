import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteShell } from '@/components/layout/SiteShell'
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
  metadataBase: new URL('https://jet4you.si'),
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
    <html lang="sl" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
