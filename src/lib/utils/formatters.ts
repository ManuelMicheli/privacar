/**
 * Formats a price in Euro with Italian locale (no decimals).
 * Example: 28900 → "€ 28.900"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formats mileage with Italian thousands separator and " km" suffix.
 * Example: 45000 → "45.000 km"
 */
export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('it-IT').format(km)} km`
}

/**
 * Formats a date string or Date object in Italian dd/MM/yyyy format.
 * Example: "2024-03-15" → "15/03/2024"
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Calculates an approximate monthly payment (price / 48 months)
 * and formats it in Euro with Italian locale (no decimals).
 * Example: 28900 → "€ 602"
 */
export function formatMonthlyPayment(price: number): string {
  const monthly = price / 48
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monthly)
}
