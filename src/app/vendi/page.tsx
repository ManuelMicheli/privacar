import type { Metadata } from 'next'
import { VendiContent } from './VendiContent'

export const metadata: Metadata = {
  title: 'Vendi la tua Auto',
  description:
    'Vendi la tua auto con Privacar Rho: valutazione gratuita, servizio fotografico professionale e vendita al miglior prezzo.',
}

export default function VendiPage() {
  return <VendiContent />
}
