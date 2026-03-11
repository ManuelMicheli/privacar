import type { Metadata } from 'next'
import { Outfit, IBM_Plex_Mono, Spectral } from 'next/font/google'
import './globals.css'
import { LayoutShell } from '@/components/layout/LayoutShell'
import { CustomToaster } from '@/components/ui/Toast'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spectral',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Privacar Rho | Compravendita Auto tra Privati a Rho',
    template: '%s | Privacar Rho',
  },
  description:
    'Privacar Rho: la tua agenzia di compravendita auto tra privati a Rho (MI). Vetture selezionate, garantite e finanziabili. Compra e vendi in sicurezza.',
  keywords: [
    'auto usate rho',
    'compravendita auto privati',
    'privacar rho',
    'auto garantite milano',
    'vendita auto tra privati',
  ],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Privacar Rho',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${outfit.variable} ${ibmPlexMono.variable} ${spectral.variable}`}>
      <body className="font-body text-text-primary antialiased">
        <LayoutShell>{children}</LayoutShell>
        <CustomToaster />
      </body>
    </html>
  )
}
