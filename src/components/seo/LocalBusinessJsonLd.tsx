export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'Privacar Rho',
    description:
      'Agenzia di compravendita auto tra privati a Rho (MI). Vetture selezionate, garantite e finanziabili.',
    url: 'https://privacar-rho.it',
    telephone: '+39 02 9309876',
    email: 'rho@privacar.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Madonna, 23',
      addressLocality: 'Rho',
      addressRegion: 'MI',
      postalCode: '20017',
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.5298,
      longitude: 9.0399,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '12:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '15:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '12:30',
      },
    ],
    priceRange: '€€',
    image: 'https://privacar-rho.it/images/logo-privacar.svg',
    sameAs: [
      'https://facebook.com/privacarrho',
      'https://instagram.com/privacarrho',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
