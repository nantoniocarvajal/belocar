import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductBySlug } from '../../lib/api'
import type { ProductDetail } from '../../types/catalog'
import { useCart } from '../../context/CartContext'
import { QuantitySelector } from '../../components/product/QuantitySelector'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { Button } from '../../components/ui/Button'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [boxes, setBoxes] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setAdded(false)

    fetchProductBySlug(slug)
      .then((data) => {
        if (!cancelled) setProduct(data)
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
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <LoadingState label="Cargando producto..." />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <ErrorState message={error ?? 'Producto no encontrado'} onRetry={() => navigate(0)} />
      </div>
    )
  }

  const images = [product.mainImageUrl, ...product.additionalImageUrls]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/catalogo" className="text-sm font-bold text-brand-700 hover:text-brand-800">
        &larr; Volver al catálogo
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-sand-100">
            <img src={images[0]} alt={product.name} className="h-full w-full object-contain p-3" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(1).map((image) => (
                <div key={image} className="h-16 w-16 overflow-hidden rounded-lg bg-sand-100">
                  <img src={image} alt={product.name} className="h-full w-full object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">{product.brand}</p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900 sm:text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-ink-500">{product.categoryName}</p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            {product.varietal && (
              <div>
                <dt className="text-ink-500">Cepa</dt>
                <dd className="font-medium text-ink-900">{product.varietal}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink-500">Formato</dt>
              <dd className="font-medium text-ink-900">{product.format}</dd>
            </div>
            <div>
              <dt className="text-ink-500">Unidades por caja</dt>
              <dd className="font-medium text-ink-900">{product.unitsPerBox}</dd>
            </div>
          </dl>

          <p className="mt-5 text-ink-600">{product.fullDescription}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <QuantitySelector value={boxes} onChange={setBoxes} />
            <Button
              onClick={() => {
                addItem(product, boxes)
                setAdded(true)
              }}
            >
              Agregar a mi cotización
            </Button>
          </div>

          {added && (
            <p className="mt-3 text-sm font-medium text-emerald-700">
              Agregado. <Link to="/cotizacion" className="underline">Ver mi cotización</Link>
            </p>
          )}

          <p className="mt-6 text-xs text-ink-400">
            No mostramos precios ni stock disponible en el sitio: la cotización final se entrega por
            WhatsApp según la cantidad de cajas solicitadas.
          </p>
        </div>
      </div>
    </div>
  )
}
