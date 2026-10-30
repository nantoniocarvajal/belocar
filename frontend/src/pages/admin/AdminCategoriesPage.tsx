import { useEffect, useState, type FormEvent } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from '../../lib/api'
import type { Category } from '../../types/catalog'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

export function AdminCategoriesPage() {
  const { session } = useAdminAuth()
  const token = session!.token

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [rowError, setRowError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    fetchAdminCategories(token)
      .then(setCategories)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    setCreateError(null)
    setCreating(true)
    try {
      const created = await createCategory(token, newName.trim())
      setCategories((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'No se pudo crear la categoría.')
    } finally {
      setCreating(false)
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
    setRowError(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const saveEditing = async (id: number) => {
    setPendingId(id)
    setRowError(null)
    try {
      const updated = await updateCategory(token, id, editingName.trim())
      setCategories((current) =>
        current.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name)),
      )
      cancelEditing()
    } catch (err) {
      setRowError(err instanceof Error ? err.message : 'No se pudo actualizar la categoría.')
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(
      `¿Eliminar la categoría "${category.name}"? Si tiene productos asignados, no se podrá eliminar.`,
    )
    if (!confirmed) return

    setPendingId(category.id)
    setRowError(null)
    try {
      await deleteCategory(token, category.id)
      setCategories((current) => current.filter((c) => c.id !== category.id))
    } catch (err) {
      setRowError(err instanceof Error ? err.message : 'No se pudo eliminar la categoría.')
    } finally {
      setPendingId(null)
    }
  }

  if (loading) return <LoadingState label="Cargando categorías..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-900">Categorías</h1>
      <p className="mt-1 text-sm text-ink-500">
        Crea, edita o elimina las categorías que se muestran como filtro en el catálogo.
      </p>

      <form onSubmit={handleCreate} className="mt-6 flex gap-3 rounded-xl border border-ink-100 bg-white p-4">
        <input
          type="text"
          required
          placeholder="Nombre de la nueva categoría"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <Button type="submit" disabled={creating}>
          {creating ? 'Creando...' : 'Agregar'}
        </Button>
      </form>
      {createError && <p className="mt-2 text-sm text-red-600">{createError}</p>}

      {rowError && <p className="mt-4 text-sm text-red-600">{rowError}</p>}

      {categories.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Todavía no hay categorías" />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-3 px-4 py-3">
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEditing(category.id)}
                      disabled={pendingId === category.id}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      Guardar
                    </button>
                    <button onClick={cancelEditing} className="text-sm font-medium text-ink-500 hover:underline">
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-ink-900">{category.name}</p>
                    <p className="text-xs text-ink-400">{category.slug}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(category)}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={pendingId === category.id}
                      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
