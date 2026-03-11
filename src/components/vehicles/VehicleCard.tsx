'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Gauge, Settings2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import {
  formatPrice,
  formatMileage,
  formatMonthlyPayment,
} from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { FUEL_TYPES } from '@/lib/utils/constants'
import type { Vehicle } from '@/types'

export interface VehicleCardProps {
  vehicle: Vehicle
  index?: number
  className?: string
  priority?: boolean
}

export function VehicleCard({
  vehicle,
  index = 0,
  className,
  priority = false,
}: VehicleCardProps) {
  const coverImage =
    vehicle.images?.find((img) => img.is_cover) ?? vehicle.images?.[0]

  const fuelConfig = FUEL_TYPES.find((f) => f.value === vehicle.fuel_type)

  const isUnavailable =
    vehicle.status === 'riservata' || vehicle.status === 'venduta'

  const whatsappMessage = encodeURIComponent(
    `Ciao, sono interessato/a alla ${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${formatPrice(vehicle.price)}. Potete darmi maggiori informazioni?`
  )
  const whatsappUrl = `https://wa.me/39XXXXXXXXXX?text=${whatsappMessage}`

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[#E5E7EB]/50 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        'transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.4,0.25,1)]',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-[#E5E7EB]',
        'animate-fade-in-up',
        className
      )}
      style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
    >
      <Link
        href={`/auto/${vehicle.slug}`}
        className="block"
        aria-label={`${vehicle.brand} ${vehicle.model} - ${formatPrice(vehicle.price)}`}
      >
        {/* Image Area */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.25,0.4,0.25,1)] group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-50 text-text-muted">
              <Gauge className="h-12 w-12" />
            </div>
          )}

          {/* Gradient overlay for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Fuel type badge */}
          {fuelConfig && (
            <div className="absolute left-3 top-3">
              <Badge
                variant={vehicle.fuel_type}
                className="rounded-lg px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm"
              >
                {fuelConfig.label}
              </Badge>
            </div>
          )}

          {/* Status overlay */}
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#064E3B]/60">
              <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#0F1A14]">
                {vehicle.status === 'riservata' ? 'Riservata' : 'Venduta'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand */}
          <p className="font-mono text-[11px] font-medium uppercase tracking-[1.5px] text-text-muted mb-1">
            {vehicle.brand}
          </p>

          {/* Model */}
          <h3 className="truncate font-heading text-[17px] font-semibold leading-tight text-[#0F1A14] mb-3">
            {vehicle.model}
            {vehicle.version ? ` ${vehicle.version}` : ''}
          </h3>

          {/* Specs row */}
          <div className="flex items-center gap-3 font-mono text-[12px] text-[#4B5B52]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {vehicle.year}
            </span>
            <span className="text-[#D1D5DB]">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {formatMileage(vehicle.mileage)}
            </span>
            <span className="text-[#D1D5DB]">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5" />
              {vehicle.transmission === 'automatico' ? 'Auto' : 'Manuale'}
            </span>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-[#F3F4F6]" />

          {/* Price row */}
          <div className="flex items-end justify-between">
            <p className="font-heading text-[22px] font-bold text-[#065F46] transition-colors duration-300 group-hover:text-[#047857]">
              {formatPrice(vehicle.price)}
            </p>
            <p className="font-mono text-[12px] text-text-muted">
              da {formatMonthlyPayment(vehicle.price)}/mese
            </p>
          </div>
        </div>
      </Link>

      {/* CTA Buttons */}
      <div className="flex gap-2 px-5 pb-5 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:opacity-80 lg:translate-y-[2px]">
        <Link
          href={`/auto/${vehicle.slug}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#065F46] px-4 py-[10px] font-body text-[13px] font-semibold text-white transition-colors hover:bg-[#047857]"
        >
          Dettagli
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-[10px] font-body text-[13px] font-semibold text-white transition-colors hover:bg-[#20BD5A]"
          aria-label="Contatta su WhatsApp"
        >
          <MessageCircle className="mr-1.5 h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
