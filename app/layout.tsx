import type { Metadata, Viewport } from 'next'
import { DM_Mono, DM_Sans, Instrument_Serif } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono', display: 'swap' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Elonverse — Predictions from Earth to Mars',
  description:
    "Follow the markets behind Elon Musk's missions, machines, moonshots and cultural orbit. Prediction markets, perpetuals, and the next promises to price.",
  openGraph: {
    title: 'Elonverse — Predictions from Earth to Mars',
    description: "Prediction markets, perpetuals, and the next promises to price across Elon Musk's orbit.",
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#141719',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
