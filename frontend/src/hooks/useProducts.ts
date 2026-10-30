import { useEffect, useState } from 'react'
import { fetchProducts, type ProductSearchParams } from '../lib/api'
import type { ProductSummary } from '../types/catalog'

interface UseProductsResult {
  products: ProductSummary[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useProducts(params: ProductSearchParams): UseProductsResult {
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProducts(params)
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q, params.category, params.brand, params.featured, reloadToken])

  return { products, loading, error, reload: () => setReloadToken((t) => t + 1) }
}
