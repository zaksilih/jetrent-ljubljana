import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pogosta vprašanja',
  description: 'Odgovori na najpogostejša vprašanja o najemu jet skija Sea-Doo Spark. Vse kar morate vedeti pred rezervacijo.',
}

export default function VprasanjaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
