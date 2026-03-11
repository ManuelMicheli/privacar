'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  CircleDot,
  Fuel,
  Gauge,
  MessageCircle,
  Phone,
  Settings2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatPrice, formatMileage, formatMonthlyPayment } from '@/lib/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/forms/ContactModal'
import { AppointmentModal } from '@/components/forms/AppointmentModal'
import type { Vehicle } from '@/types'

export interface VehicleInfoCardProps {
  vehicle: Vehicle
}

const PHONE_NUMBER = '3331234567'
const WHATSAPP_NUMBER = '393331234567'

export function VehicleInfoCard({ vehicle }: VehicleInfoCardProps) {
  const [contactOpen, setContactOpen] = useState(false)
  const [appointmentOpen, setAppointmentOpen] = useState(false)
  const pathname = usePathname()

  const vehicleName = [vehicle.brand, vehicle.model, vehicle.version]
    .filter(Boolean)
    .join(' ')

  const whatsappMessage = encodeURIComponent(
    `Ciao, sono interessato/a a ${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''} (${vehicle.year}) - ${typeof window !== 'undefined' ? window.location.origin : ''}${pathname}`
  )

  const specs = [
    {
      icon: Calendar,
      label: 'Anno',
      value: String(vehicle.year),
      show: true,
    },
    {
      icon: Gauge,
      label: 'Km',
      value: formatMileage(vehicle.mileage),
      show: true,
    },
    {
      icon: Fuel,
      label: 'Alimentazione',
      value: vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1),
      show: true,
    },
    {
      icon: Settings2,
      label: 'Cambio',
      value: vehicle.transmission === 'automatico' ? 'Automatico' : 'Manuale',
      show: true,
    },
    {
      icon: Zap,
      label: 'Potenza',
      value: vehicle.power_hp ? `${vehicle.power_hp} CV` : null,
      show: !!vehicle.power_hp,
    },
    {
      icon: CircleDot,
      label: 'Cilindrata',
      value: vehicle.engine_cc
        ? `${new Intl.NumberFormat('it-IT').format(vehicle.engine_cc)} cc`
        : null,
      show: !!vehicle.engine_cc,
    },
  ].filter((s) => s.show)

  return (
    <>
      <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-gray-100">
        {/* Title */}
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          {vehicle.brand} {vehicle.model}
          {vehicle.version && (
            <span className="mt-1 block text-lg font-semibold text-text-secondary">
              {vehicle.version}
            </span>
          )}
        </h1>

        {/* Fuel badge */}
        <div className="mt-3">
          <Badge variant={vehicle.fuel_type}>
            {vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}
          </Badge>
        </div>

        {/* Price */}
        <div className="mt-5">
          <p className="font-heading text-3xl font-bold text-primary">
            {formatPrice(vehicle.price)}
          </p>
          {vehicle.monthly_payment ? (
            <p className="mt-1 text-sm text-text-secondary">
              Finanziabile da {formatPrice(vehicle.monthly_payment)}/mese
            </p>
          ) : (
            <p className="mt-1 text-sm text-text-secondary">
              Finanziabile da {formatMonthlyPayment(vehicle.price)}/mese
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="my-5 border-gray-100" />

        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {specs.map((spec) => {
            const Icon = spec.icon
            return (
              <div key={spec.label} className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-bg-alt">
                  <Icon className="h-4 w-4 text-text-muted" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">{spec.label}</p>
                  <p className="text-sm font-medium text-text-primary">
                    {spec.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Divider */}
        <hr className="my-5 border-gray-100" />

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="whatsapp"
            size="md"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            className="w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Scrivici su WhatsApp
          </Button>

          <Button
            variant="outline"
            size="md"
            href={`tel:+39${PHONE_NUMBER}`}
            className="w-full"
          >
            <Phone className="h-4 w-4" />
            Chiama ora
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setContactOpen(true)}
            className="w-full"
          >
            Richiedi Informazioni
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setAppointmentOpen(true)}
            className="w-full"
          >
            Prenota un Appuntamento
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        vehicleId={vehicle.id}
        vehicleName={vehicleName}
      />

      <AppointmentModal
        isOpen={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
        vehicleId={vehicle.id}
        vehicleName={vehicleName}
      />
    </>
  )
}
