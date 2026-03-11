import type { Vehicle } from '@/types'

const fuelTypeMap: Record<string, string> = {
  benzina: 'https://schema.org/Gasoline',
  diesel: 'https://schema.org/Diesel',
  gpl: 'https://schema.org/Gasoline',
  metano: 'https://schema.org/NaturalGas',
  ibrida: 'https://schema.org/HybridElectricity',
  elettrica: 'https://schema.org/Electricity',
}

const transmissionMap: Record<string, string> = {
  manuale: 'https://schema.org/ManualTransmission',
  automatico: 'https://schema.org/AutomaticTransmission',
}

export interface VehicleJsonLdProps {
  vehicle: Vehicle
}

export function VehicleJsonLd({ vehicle }: VehicleJsonLdProps) {
  const coverImage =
    vehicle.images?.find((img) => img.is_cover) || vehicle.images?.[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: [vehicle.brand, vehicle.model, vehicle.version]
      .filter(Boolean)
      .join(' '),
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'KMT',
    },
    fuelType: fuelTypeMap[vehicle.fuel_type] || vehicle.fuel_type,
    vehicleTransmission:
      transmissionMap[vehicle.transmission] || vehicle.transmission,
    color: vehicle.color_exterior || undefined,
    numberOfDoors: vehicle.doors || undefined,
    vehicleSeatingCapacity: vehicle.seats || undefined,
    vehicleEngine: vehicle.engine_cc
      ? {
          '@type': 'EngineSpecification',
          engineDisplacement: {
            '@type': 'QuantitativeValue',
            value: vehicle.engine_cc,
            unitCode: 'CMQ',
          },
          ...(vehicle.power_kw && {
            enginePower: {
              '@type': 'QuantitativeValue',
              value: vehicle.power_kw,
              unitCode: 'KWT',
            },
          }),
        }
      : undefined,
    ...(vehicle.drive_type && { driveWheelConfiguration: vehicle.drive_type }),
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'EUR',
      availability:
        vehicle.status === 'disponibile'
          ? 'https://schema.org/InStock'
          : vehicle.status === 'riservata'
            ? 'https://schema.org/LimitedAvailability'
            : 'https://schema.org/SoldOut',
      seller: {
        '@type': 'AutoDealer',
        name: 'Privacar Rho',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Via Madonna, 23',
          addressLocality: 'Rho',
          addressRegion: 'MI',
          postalCode: '20017',
          addressCountry: 'IT',
        },
      },
    },
    image: coverImage?.url || undefined,
    url: `https://privacar-rho.it/auto/${vehicle.slug}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
