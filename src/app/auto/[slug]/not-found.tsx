import Link from 'next/link'
import { CarFront, ArrowLeft, MessageCircle } from 'lucide-react'

export default function VehicleNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-bg-alt">
        <CarFront className="h-10 w-10 text-text-muted" />
      </div>

      <h1 className="font-heading text-3xl font-bold text-text-primary">
        Veicolo non trovato
      </h1>

      <p className="mt-3 text-lg text-text-secondary">
        Il veicolo che cerchi potrebbe essere stato venduto o rimosso.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/auto"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna al Parco Auto
        </Link>

        <Link
          href="/contatti"
          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Contattaci
        </Link>
      </div>
    </div>
  )
}
