'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

export function MapEmbed() {
  const [iframeError, setIframeError] = useState(false)

  if (iframeError) {
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-bg-alt">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <MapPin className="h-10 w-10" />
          <p className="text-sm">Mappa non disponibile</p>
          <a
            href="https://maps.google.com/?q=Via+Madonna+23+20017+Rho+MI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline hover:text-primary-light"
          >
            Apri su Google Maps
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl">
      <iframe
        title="Privacar Rho — Mappa"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.5!2d9.039!3d45.529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMxJzQ0LjQiTiA5wrAwMiczMy42IkU!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
        className="aspect-[16/9] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onError={() => setIframeError(true)}
      />
    </div>
  )
}
