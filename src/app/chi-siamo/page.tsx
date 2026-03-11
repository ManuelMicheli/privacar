import type { Metadata } from 'next'
import { ChiSiamoContent } from './ChiSiamoContent'

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description:
    'Scopri Privacar Rho: la tua agenzia di compravendita auto tra privati a Rho. Il metodo Privacar, la nostra storia e i nostri numeri.',
}

export default function ChiSiamoPage() {
  return <ChiSiamoContent />
}
