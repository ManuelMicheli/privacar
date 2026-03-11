import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVehicleBySlug, getSimilarVehicles } from '@/lib/queries/vehicles'
import { VehicleGallery } from '@/components/vehicles/VehicleGallery'
import { VehicleInfoCard } from '@/components/vehicles/VehicleInfoCard'
import { VehicleSpecs } from '@/components/vehicles/VehicleSpecs'
import { SimilarVehicles } from '@/components/vehicles/SimilarVehicles'
import { VehicleBreadcrumb } from '@/components/vehicles/VehicleBreadcrumb'
import { VehicleJsonLd } from '@/components/seo/VehicleJsonLd'

interface VehiclePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) {
    return { title: 'Veicolo non trovato' }
  }

  const title = [vehicle.brand, vehicle.model, vehicle.version, vehicle.year]
    .filter(Boolean)
    .join(' ')

  const description = `${vehicle.brand} ${vehicle.model}${vehicle.version ? ` ${vehicle.version}` : ''} del ${vehicle.year} con ${new Intl.NumberFormat('it-IT').format(vehicle.mileage)} km. ${vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1)}, cambio ${vehicle.transmission}. Disponibile presso Privacar Rho.`

  const coverImage = vehicle.images?.find((img) => img.is_cover) ?? vehicle.images?.[0]

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Privacar Rho`,
      description,
      type: 'website',
      locale: 'it_IT',
      images: coverImage ? [{ url: coverImage.url, alt: title }] : undefined,
    },
  }
}

export default async function VehiclePage({ params }: VehiclePageProps) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)

  if (!vehicle) {
    notFound()
  }

  const similarVehicles = await getSimilarVehicles(vehicle)

  return (
    <>
      <VehicleJsonLd vehicle={vehicle} />

      <div className="mx-auto px-4 py-6 md:py-10 lg:px-12 2xl:px-20">
        {/* Breadcrumb */}
        <VehicleBreadcrumb brand={vehicle.brand} model={vehicle.model} />

        {/* Two-column layout */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Gallery — 60% */}
          <div className="lg:col-span-3">
            <VehicleGallery
              images={vehicle.images ?? []}
              brand={vehicle.brand}
              model={vehicle.model}
            />
          </div>

          {/* Info Card — 40% */}
          <div className="lg:col-span-2">
            <VehicleInfoCard vehicle={vehicle} />
          </div>
        </div>

        {/* Full-width specs / description / features */}
        <div className="mt-12">
          <VehicleSpecs vehicle={vehicle} />
        </div>

        {/* Similar vehicles */}
        {similarVehicles.length > 0 && (
          <div className="mt-16">
            <SimilarVehicles vehicles={similarVehicles} />
          </div>
        )}
      </div>
    </>
  )
}
