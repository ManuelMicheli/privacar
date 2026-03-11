import { cn } from '@/lib/utils/cn'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import type { Vehicle } from '@/types'

interface VehicleGridProps {
  vehicles: Vehicle[]
  columns?: 2 | 3
  className?: string
}

export function VehicleGrid({
  vehicles,
  columns = 3,
  className,
}: VehicleGridProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-bg-alt px-8 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-text-primary">
          Nessuna vettura trovata
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Prova a modificare i filtri di ricerca.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 md:grid-cols-2',
        columns === 3 && 'lg:grid-cols-3',
        columns === 2 && 'lg:grid-cols-2',
        className
      )}
    >
      {vehicles.map((vehicle, index) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          index={index}
          priority={index < 3}
        />
      ))}
    </div>
  )
}
