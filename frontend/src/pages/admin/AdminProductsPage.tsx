import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import {
  deleteProduct,
  fetchAdminProducts,
  reorderProducts,
  setProductFeatured,
  setProductPublished,
} from '../../lib/api'
import type { ProductAdmin } from '../../types/admin'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'
import { buttonClasses } from '../../components/ui/Button'

export function AdminProductsPage() {
  const { session } = useAdminAuth()
  const [products, setProducts] = useState<ProductAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const token = session!.token

  const load = () => {
    setLoading(true)
    setError(null)
    fetchAdminProducts(token)
      .then(setProducts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const togglePublished = async (product: ProductAdmin) => {
    setPendingId(product.id)
    try {
      const updated = await setProductPublished(token, product.id, !product.published)
      setProducts((current) => current.map((p) => (p.id === product.id ? updated : p)))
    } finally {
      setPendingId(null)
    }
  }

  const toggleFeatured = async (product: ProductAdmin) => {
    setPendingId(product.id)
    try {
      const updated = await setProductFeatured(token, product.id, !product.featured)
      setProducts((current) => current.map((p) => (p.id === product.id ? updated : p)))
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (product: ProductAdmin) => {
    const confirmed = window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return

    setPendingId(product.id)
    try {
      await deleteProduct(token, product.id)
      setProducts((current) => current.filter((p) => p.id !== product.id))
    } finally {
      setPendingId(null)
    }
  }

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= products.length) return

    const reordered = [...products]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    setProducts(reordered)

    try {
      await reorderProducts(token, reordered.map((p) => p.id))
    } catch {
      load()
    }
  }

  if (loading) return <LoadingState label="Cargando productos..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Productos</h1>
        <Link to="/admin/productos/nuevo" className={buttonClasses('primary')}>
          + Nuevo producto
        </Link>
      </div>
      <p className="mt-1 text-sm text-ink-400">
        Publica, destaca, edita, reordena o elimina productos.
      </p>

      {products.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no hay productos cargados"
            action={
              <Link to="/admin/productos/nuevo" className={buttonClasses('primary')}>
                Crear el primer producto
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-ink-500">
              <tr>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Publicado</th>
                <th className="px-4 py-3">Destacado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Mover hacia arriba"
                        className="text-ink-400 hover:text-ink-800 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === products.length - 1}
                        aria-label="Mover hacia abajo"
                        className="text-ink-400 hover:text-ink-800 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{product.name}</p>
                    <p className="text-xs text-ink-400">{product.brand}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{product.categoryName}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublished(product)}
                      disabled={pendingId === product.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.published ? 'bg-emerald-100 text-emerald-700' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      {product.published ? 'Publicado' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(product)}
                      disabled={pendingId === product.id}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.featured ? 'bg-amber-100 text-amber-700' : 'bg-ink-100 text-ink-500'
                      }`}
                    >
                      {product.featured ? 'Destacado' : 'Normal'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin/productos/${product.id}/editar`}
                        className="text-sm font-bold text-brand-700 hover:text-brand-800"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={pendingId === product.id}
                        className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
