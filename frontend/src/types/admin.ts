export interface ProductAdmin {
  id: number
  name: string
  slug: string
  brand: string
  categoryId: number
  categoryName: string
  varietal: string | null
  shortDescription: string
  fullDescription: string
  format: string
  unitsPerBox: number
  mainImageUrl: string
  additionalImageUrls: string[]
  featured: boolean
  published: boolean
  displayOrder: number
  internalNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  token: string
  username: string
  expiresAt: string
}
