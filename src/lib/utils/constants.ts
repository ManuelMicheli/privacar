// ─── Car Brands ──────────────────────────────────────────────────────────────

export const BRANDS = [
  'Abarth',
  'Alfa Romeo',
  'Audi',
  'BMW',
  'Citroën',
  'Dacia',
  'DS',
  'Fiat',
  'Ford',
  'Honda',
  'Hyundai',
  'Jeep',
  'Kia',
  'Lancia',
  'Land Rover',
  'Mazda',
  'Mercedes-Benz',
  'Mini',
  'Nissan',
  'Opel',
  'Peugeot',
  'Porsche',
  'Renault',
  'Seat',
  'Skoda',
  'Smart',
  'Suzuki',
  'Tesla',
  'Toyota',
  'Volkswagen',
  'Volvo',
] as const

// ─── Fuel Types ──────────────────────────────────────────────────────────────

export const FUEL_TYPES = [
  {
    value: 'benzina' as const,
    label: 'Benzina',
    badgeClasses: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    value: 'diesel' as const,
    label: 'Diesel',
    badgeClasses: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    value: 'gpl' as const,
    label: 'GPL',
    badgeClasses: 'bg-green-50 text-green-700 border-green-200',
  },
  {
    value: 'metano' as const,
    label: 'Metano',
    badgeClasses: 'bg-teal-50 text-teal-700 border-teal-200',
  },
  {
    value: 'ibrida' as const,
    label: 'Ibrida',
    badgeClasses: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    value: 'elettrica' as const,
    label: 'Elettrica',
    badgeClasses: 'bg-violet-50 text-violet-700 border-violet-200',
  },
] as const

// ─── Transmission Types ──────────────────────────────────────────────────────

export const TRANSMISSION_TYPES = [
  { value: 'manuale' as const, label: 'Manuale' },
  { value: 'automatico' as const, label: 'Automatico' },
] as const

// ─── Sort Options ────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Più recenti' },
  { value: 'price_asc', label: 'Prezzo crescente' },
  { value: 'price_desc', label: 'Prezzo decrescente' },
  { value: 'mileage_asc', label: 'Km crescenti' },
] as const

// ─── Pagination ──────────────────────────────────────────────────────────────

export const ITEMS_PER_PAGE = 12

// ─── Body Types ──────────────────────────────────────────────────────────────

export const BODY_TYPES = [
  'Berlina',
  'SW (Station Wagon)',
  'SUV',
  'Coupé',
  'Cabrio',
  'Monovolume',
  'Citycar',
  'Crossover',
  'Pick-up',
  'Furgone',
] as const

// ─── Emission Classes ────────────────────────────────────────────────────────

export const EMISSION_CLASSES = [
  'Euro 6d',
  'Euro 6d-TEMP',
  'Euro 6c',
  'Euro 6b',
  'Euro 6',
  'Euro 5',
  'Euro 4',
  'Euro 3',
] as const
