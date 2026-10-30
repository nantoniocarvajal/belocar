import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { ProductCard } from '../../components/product/ProductCard'
import { ProductFilters } from '../../components/product/ProductFilters'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const categorySlug = searchParams.get('categoria') ?? ''
  const brand = searchParams.get('marca') ?? ''

  const { categories } = useCategories()
  const { products, loading, error, reload } = useProducts({
    q: search || undefined,
    category: categorySlug || undefined,
    brand: brand || undefined,
  })
  // Lista completa (sin filtros) solo para no achicar las opciones de marca al filtrar.
  const { products: allProducts } = useProducts({})

  const brands = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.brand))).sort(),
    [allProducts],
  )

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink-900">Catálogo</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Todos los productos se venden por caja completa. Agrega los que te interesen a tu cotización
        y coordinamos precio y condiciones por WhatsApp.
      </p>

      <div className="mt-6">
        <ProductFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value)
            updateParam('q', value)
          }}
          categorySlug={categorySlug}
          onCategoryChange={(value) => updateParam('categoria', value)}
          brand={brand}
          onBrandChange={(value) => updateParam('marca', value)}
          categories={categories}
          brands={brands}
        />
      </div>

      <div className="mt-8">
        {loading && <LoadingState label="Cargando catálogo..." />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && products.length === 0 && (
          <EmptyState
            title="No encontramos productos con esos filtros"
            description="Prueba con otra búsqueda o revisa otra categoría."
          />
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
