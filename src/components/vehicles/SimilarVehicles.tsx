import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import type { Vehicle } from '@/types'

export interface SimilarVehiclesProps {
  vehicles: Vehicle[]
}

export function SimilarVehicles({ vehicles }: SimilarVehiclesProps) {
  if (vehicles.length === 0) return null

  return (
    <AnimateOnScroll variant="fade-up">
      <section>
        <h2 className="mb-6 font-heading text-3xl font-bold text-text-primary">
          Potrebbe interessarti anche
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.slice(0, 4).map((vehicle, index) => (
            <AnimateOnScroll key={vehicle.id} variant="fade-up" delay={index * 0.1}>
              <VehicleCard vehicle={vehicle} />
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </AnimateOnScroll>
  )
}
