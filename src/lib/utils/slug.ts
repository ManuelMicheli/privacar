/**
 * Generates a URL slug from vehicle brand, model, version, and year.
 *
 * Example:
 *   generateSlug('Audi', 'A3 Sportback', '35 TDI S-Tronic', 2021)
 *   → "audi-a3-sportback-35-tdi-s-tronic-2021"
 */
export function generateSlug(
  brand: string,
  model: string,
  version: string | null | undefined,
  year: number
): string {
  const parts = [brand, model, version, String(year)]
    .filter((part): part is string => !!part)
    .join(' ')

  return parts
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (è → e, ü → u)
    .replace(/[^a-z0-9\s-]/g, '')    // remove special chars
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
}

/**
 * Ensures a slug is unique within a set of existing slugs by appending
 * a numeric suffix (-2, -3, ...) when a collision is detected.
 *
 * Example:
 *   ensureUniqueSlug('audi-a3-2021', ['audi-a3-2021', 'audi-a3-2021-2'])
 *   → "audi-a3-2021-3"
 */
export function ensureUniqueSlug(
  slug: string,
  existingSlugs: string[]
): string {
  const slugSet = new Set(existingSlugs)

  if (!slugSet.has(slug)) {
    return slug
  }

  let counter = 2
  while (slugSet.has(`${slug}-${counter}`)) {
    counter++
  }

  return `${slug}-${counter}`
}
