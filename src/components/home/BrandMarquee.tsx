'use client'

import Image from 'next/image'

const brands = [
  { src: '/images/abarth-0x48.webp', alt: 'Abarth' },
  { src: '/images/alfa_romeo-0x48.webp', alt: 'Alfa Romeo' },
  { src: '/images/citroen-0x48.webp', alt: 'Citro\u00ebn' },
  { src: '/images/dodge-1-0x48.webp', alt: 'Dodge' },
  { src: '/images/dr-0x48.webp', alt: 'DR' },
  { src: '/images/ds-0x48.webp', alt: 'DS' },
  { src: '/images/fiat-1-0x48.webp', alt: 'Fiat' },
  { src: '/images/jeep-0x48.webp', alt: 'Jeep' },
  { src: '/images/kia-0x48.webp', alt: 'Kia' },
  { src: '/images/mg-0x48.webp', alt: 'MG' },
  { src: '/images/nissan.webp', alt: 'Nissan' },
  { src: '/images/opel-0x48.webp', alt: 'Opel' },
  { src: '/images/peugeot-0x48.webp', alt: 'Peugeot' },
  { src: '/images/porsche-0x48.webp', alt: 'Porsche' },
  { src: '/images/changan-0x48.webp', alt: 'Changan' },
  { src: '/images/marchi-vettoriali-37-0x48.webp', alt: 'Renault' },
]

export function BrandMarquee() {
  return (
    <section className="relative overflow-hidden bg-white py-10">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

      {/* Marquee track */}
      <div className="flex">
        {/* We render the list twice — CSS animation scrolls the first copy out
            while the duplicate seamlessly fills in from the right. */}
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 animate-marquee items-center gap-14"
            aria-hidden={copy === 1}
          >
            {brands.map((brand) => (
              <div
                key={`${copy}-${brand.alt}`}
                className="relative flex h-12 w-28 shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0 hover:scale-110"
              >
                <Image
                  src={brand.src}
                  alt={brand.alt}
                  fill
                  className="object-contain opacity-60 transition-opacity duration-300 hover:opacity-100"
                  sizes="112px"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
