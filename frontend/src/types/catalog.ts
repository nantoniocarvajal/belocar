export interface Category {
  id: number
  name: string
  slug: string
}

export interface ProductSummary {
  id: number
  name: string
  slug: string
  brand: string
  categoryName: string
  categorySlug: string
  format: string
  unitsPerBox: number
  mainImageUrl: string
  shortDescription: string
  featured: boolean
}

export interface ProductDetail {
  id: number
  name: string
  slug: string
  brand: string
  categoryName: string
  categorySlug: string
  varietal: string | null
  shortDescription: string
  fullDescription: string
  format: string
  unitsPerBox: number
  mainImageUrl: string
  additionalImageUrls: string[]
  featured: boolean
}

export interface SiteConfig {
  whatsappNumber: string
  contactEmail: string | null
  contactPhone: string | null
  contactAddress: string | null
  dispatchInfo: string | null
  pickupInfo: string | null
}
