import type { Category, ProductDetail, ProductSummary, SiteConfig } from '../types/catalog'
import type { LoginResponse, ProductAdmin } from '../types/admin'
import type { CustomerDetails, QuoteDetail, QuoteItem, QuoteSummary } from '../types/quote'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export class ApiClientError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface ApiErrorBody {
  message?: string
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Error de red (${response.status})`
    try {
      const body = (await response.json()) as ApiErrorBody
      if (body.message) {
        message = body.message
      }
    } catch {
      // el cuerpo no era JSON, se usa el mensaje generico
    }
    throw new ApiClientError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

// --- Publico ---

export function fetchCategories(): Promise<Category[]> {
  return apiFetch('/api/categories')
}

export function fetchSiteConfig(): Promise<SiteConfig> {
  return apiFetch('/api/config')
}

export interface ProductSearchParams {
  q?: string
  category?: string
  brand?: string
  featured?: boolean
}

export function fetchProducts(params: ProductSearchParams = {}): Promise<ProductSummary[]> {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.category) query.set('category', params.category)
  if (params.brand) query.set('brand', params.brand)
  if (params.featured) query.set('featured', 'true')

  const queryString = query.toString()
  return apiFetch(`/api/products${queryString ? `?${queryString}` : ''}`)
}

export function fetchProductBySlug(slug: string): Promise<ProductDetail> {
  return apiFetch(`/api/products/${slug}`)
}

export function submitQuote(items: QuoteItem[], customer: CustomerDetails): Promise<{ id: number }> {
  return apiFetch('/api/quotes', {
    method: 'POST',
    body: JSON.stringify({
      customerName: customer.name,
      clientType: customer.clientType,
      companyName: customer.companyName,
      phone: customer.phone,
      email: customer.email,
      commune: customer.commune,
      fulfillmentMode: customer.fulfillmentMode,
      notes: customer.notes,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        brand: item.brand,
        format: item.format,
        unitsPerBox: item.unitsPerBox,
        boxes: item.boxes,
      })),
    }),
  })
}

// --- Admin: autenticacion ---

export function adminLogin(username: string, password: string): Promise<LoginResponse> {
  return apiFetch('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

// --- Admin: productos ---

export interface ProductFormValues {
  name: string
  brand: string
  categoryId: number
  varietal: string
  shortDescription: string
  fullDescription: string
  format: string
  unitsPerBox: number
  mainImageUrl: string
  additionalImageUrls: string[]
  featured: boolean
  published: boolean
  displayOrder: number | null
  internalNotes: string
}

export function fetchAdminProducts(token: string): Promise<ProductAdmin[]> {
  return apiFetch('/api/admin/products', { headers: authHeaders(token) })
}

export function fetchAdminProduct(token: string, id: number): Promise<ProductAdmin> {
  return apiFetch(`/api/admin/products/${id}`, { headers: authHeaders(token) })
}

export function createProduct(token: string, values: ProductFormValues): Promise<ProductAdmin> {
  return apiFetch('/api/admin/products', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(values),
  })
}

export function updateProduct(
  token: string,
  id: number,
  values: ProductFormValues,
): Promise<ProductAdmin> {
  return apiFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(values),
  })
}

export function setProductPublished(
  token: string,
  id: number,
  published: boolean,
): Promise<ProductAdmin> {
  return apiFetch(`/api/admin/products/${id}/publish?published=${published}`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
}

export function setProductFeatured(
  token: string,
  id: number,
  featured: boolean,
): Promise<ProductAdmin> {
  return apiFetch(`/api/admin/products/${id}/feature?featured=${featured}`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
}

export function reorderProducts(token: string, orderedProductIds: number[]): Promise<void> {
  return apiFetch('/api/admin/products/reorder', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ orderedProductIds }),
  })
}

export function deleteProduct(token: string, id: number): Promise<void> {
  return apiFetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

// --- Admin: categorias ---

export function fetchAdminCategories(token: string): Promise<Category[]> {
  return apiFetch('/api/admin/categories', { headers: authHeaders(token) })
}

export function createCategory(token: string, name: string): Promise<Category> {
  return apiFetch('/api/admin/categories', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  })
}

export function updateCategory(token: string, id: number, name: string): Promise<Category> {
  return apiFetch(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  })
}

export function deleteCategory(token: string, id: number): Promise<void> {
  return apiFetch(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

// --- Admin: configuracion del sitio ---

export function fetchAdminSiteConfig(token: string): Promise<SiteConfig> {
  return apiFetch('/api/admin/config', { headers: authHeaders(token) })
}

export function updateSiteConfig(token: string, config: SiteConfig): Promise<SiteConfig> {
  return apiFetch('/api/admin/config', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(config),
  })
}

// --- Admin: cotizaciones ---

export function fetchAdminQuotes(token: string): Promise<QuoteSummary[]> {
  return apiFetch('/api/admin/quotes', { headers: authHeaders(token) })
}

export function fetchAdminQuote(token: string, id: number): Promise<QuoteDetail> {
  return apiFetch(`/api/admin/quotes/${id}`, { headers: authHeaders(token) })
}

// --- Admin: subida de imagenes ---

export async function uploadImage(token: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })

  if (!response.ok) {
    throw new ApiClientError(response.status, 'No se pudo subir la imagen')
  }

  const body = (await response.json()) as { url: string }
  return body.url.startsWith('http') ? body.url : `${API_BASE_URL}${body.url}`
}
