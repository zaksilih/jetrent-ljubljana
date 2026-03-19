import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'
import { footerNavigation } from '@/data/navigation'
import { businessInfo } from '@/data/business'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="flex items-center gap-2 font-bold text-xl text-white hover:text-primary-400 transition-colors"
            >
              <Image src="/logo.png" alt={businessInfo.name} width={44} height={44} className="h-11 w-11 object-contain" />
              <span>{businessInfo.name}</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Najem jet skija Sea-Doo Spark za vaš popoln dopust na Hrvaškem. 
              Prevzem v Ljubljani, prikolica vključena.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href={businessInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={businessInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigacija</h3>
            <ul className="space-y-3">
              {footerNavigation.main.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pravno</h3>
            <ul className="space-y-3">
              {footerNavigation.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${businessInfo.contact.email}`}
                  className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors"
                >
                  <Mail className="h-4 w-4 text-primary-400" />
                  {businessInfo.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${businessInfo.contact.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-primary-400 transition-colors"
                >
                  <Phone className="h-4 w-4 text-primary-400" />
                  {businessInfo.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5" />
                <span>{businessInfo.contact.pickupLocation}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} {businessInfo.name}. Vse pravice pridržane.
          </p>
          <p className="text-xs text-gray-600">
            Sea-Doo Spark 2UP • Ljubljana, Slovenija
          </p>
        </div>
      </div>
    </footer>
  )
}
