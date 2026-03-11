import { CheckCircle } from '@/components/icons'
import type { VehicleFeatures as VehicleFeaturesType } from '@/types'

export interface VehicleFeaturesProps {
  features: VehicleFeaturesType
}

const CATEGORY_LABELS: Record<string, string> = {
  comfort: 'Comfort',
  sicurezza: 'Sicurezza',
  infotainment: 'Infotainment',
  altro: 'Altro',
}

const CATEGORY_ORDER = ['comfort', 'sicurezza', 'infotainment', 'altro']

export function VehicleFeatures({ features }: VehicleFeaturesProps) {
  const categories = CATEGORY_ORDER.filter((key) => {
    const items = features[key as keyof VehicleFeaturesType]
    return Array.isArray(items) && items.length > 0
  })

  if (categories.length === 0) {
    return (
      <p className="text-sm text-text-muted">
        Nessuna dotazione specificata.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {categories.map((key) => {
        const items = features[key as keyof VehicleFeaturesType]!
        return (
          <div key={key}>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {CATEGORY_LABELS[key] ?? key}
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-text-secondary"
                >
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-success" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
