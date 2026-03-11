import type { Metadata } from 'next'
import { ServiziContent } from './ServiziContent'

export const metadata: Metadata = {
  title: 'Servizi',
  description:
    'Scopri i servizi Privacar Rho: finanziamento su misura e garanzia meccanica per la tua auto usata.',
}

export default function ServiziPage() {
  return <ServiziContent />
}
