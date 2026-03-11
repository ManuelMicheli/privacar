import { getFeaturedVehicles, getVehicleCount } from '@/lib/queries/vehicles'
import { HeroSection } from '@/components/home/HeroSection'
import { BrandMarquee } from '@/components/home/BrandMarquee'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TrustSection } from '@/components/home/TrustSection'
import { CtaBanner } from '@/components/home/CtaBanner'
import { ReviewsCarousel } from '@/components/home/ReviewsCarousel'
import { HeroSearchBar } from '@/components/filters/HeroSearchBar'

export default async function HomePage() {
  const [featuredVehicles, vehicleCount] = await Promise.all([
    getFeaturedVehicles(),
    getVehicleCount(),
  ])

  return (
    <>
      <HeroSection vehicleCount={vehicleCount} />
      <BrandMarquee />
      <section className="bg-white px-4 pb-12 pt-2 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <HeroSearchBar />
        </div>
      </section>
      <FeaturedSection vehicles={featuredVehicles} />
      <ServicesSection />
      <TrustSection />
      <CtaBanner />
      <ReviewsCarousel />
    </>
  )
}
