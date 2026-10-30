import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import {
  createProduct,
  fetchAdminCategories,
  fetchAdminProduct,
  updateProduct,
  uploadImage,
  type ProductFormValues,
} from '../../lib/api'
import type { Category } from '../../types/catalog'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'

const EMPTY_FORM: ProductFormValues = {
  name: '',
  brand: '',
  categoryId: 0,
  varietal: '',
  shortDescription: '',
  fullDescription: '',
  format: '',
  unitsPerBox: 12,
  mainImageUrl: '',
  additionalImageUrls: [],
  featured: false,
  published: false,
  displayOrder: null,
  internalNotes: '',
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const { session } = useAdminAuth()
  const navigate = useNavigate()
  const token = session!.token

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductFormValues>(EMPTY_FORM)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [uploadingMain, setUploadingMain] = useState(false)
  const [uploadingExtra, setUploadingExtra] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAdminCategories(token).then(setCategories).catch(() => setCategories([]))
  }, [token])

  useEffect(() => {
    if (!isEditing || !id) return
    setLoading(true)
    fetchAdminProduct(token, Number(id))
      .then((product) => {
        setForm({
          name: product.name,
          brand: product.brand,
          categoryId: product.categoryId,
          varietal: product.varietal ?? '',
          shortDescription: product.shortDescription,
          fullDescription: product.fullDescription,
          format: product.format,
          unitsPerBox: product.unitsPerBox,
          mainImageUrl: product.mainImageUrl,
          additionalImageUrls: product.additionalImageUrls,
          featured: product.featured,
          published: product.published,
          displayOrder: product.displayOrder,
          internalNotes: product.internalNotes ?? '',
        })
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isEditing, token])

  const updateField = <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleMainImageUpload = async (file: File) => {
    setUploadingMain(true)
    try {
      const url = await uploadImage(token, file)
      updateField('mainImageUrl', url)
    } catch {
      setError('No se pudo subir la imagen principal.')
    } finally {
      setUploadingMain(false)
    }
  }

  const handleExtraImageUpload = async (file: File) => {
    setUploadingExtra(true)
    try {
      const url = await uploadImage(token, file)
      updateField('additionalImageUrls', [...form.additionalImageUrls, url])
    } catch {
      setError('No se pudo subir la imagen.')
    } finally {
      setUploadingExtra(false)
    }
  }

  const removeExtraImage = (url: string) => {
    updateField('additionalImageUrls', form.additionalImageUrls.filter((u) => u !== url))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!form.categoryId) {
      setError('Selecciona una categoría.')
      return
    }

    setSaving(true)
    try {
      const payload: ProductFormValues = {
        ...form,
        varietal: form.varietal.trim() || '',
        internalNotes: form.internalNotes.trim() || '',
      }
      if (isEditing && id) {
        await updateProduct(token, Number(id), payload)
      } else {
        await createProduct(token, payload)
      }
      navigate('/admin/productos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Cargando producto..." />

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border border-ink-100 bg-white p-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-800">Nombre *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-800">Marca o viña *</label>
            <input
              type="text"
              required
              value={form.brand}
              onChange={(e) => updateField('brand', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-800">Categoría *</label>
            <select
              required
              value={form.categoryId || ''}
              onChange={(e) => updateField('categoryId', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-800">Cepa (opcional)</label>
            <input
              type="text"
              value={form.varietal}
              onChange={(e) => updateField('varietal', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-800">Formato *</label>
            <input
              type="text"
              required
              placeholder="ej: 750 ml"
              value={form.format}
              onChange={(e) => updateField('format', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-800">Unidades por caja *</label>
            <input
              type="number"
              required
              min={1}
              value={form.unitsPerBox}
              onChange={(e) => updateField('unitsPerBox', Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Descripción breve *</label>
          <textarea
            required
            maxLength={300}
            rows={2}
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Descripción completa *</label>
          <textarea
            required
            rows={4}
            value={form.fullDescription}
            onChange={(e) => updateField('fullDescription', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Imagen principal *</label>
          <div className="mt-1 flex items-center gap-3">
            {form.mainImageUrl && (
              <img src={form.mainImageUrl} alt="" className="h-16 w-16 rounded-lg bg-sand-100 object-contain p-1" />
            )}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingMain}
              onChange={(e) => e.target.files?.[0] && handleMainImageUpload(e.target.files[0])}
              className="text-sm"
            />
            {uploadingMain && <span className="text-xs text-ink-400">Subiendo...</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Imágenes adicionales (opcional)</label>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {form.additionalImageUrls.map((url) => (
              <div key={url} className="relative">
                <img src={url} alt="" className="h-16 w-16 rounded-lg bg-sand-100 object-contain p-1" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(url)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                  aria-label="Quitar imagen"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingExtra}
              onChange={(e) => e.target.files?.[0] && handleExtraImageUpload(e.target.files[0])}
              className="text-sm"
            />
            {uploadingExtra && <span className="text-xs text-ink-400">Subiendo...</span>}
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateField('published', e.target.checked)}
            />
            Publicado (visible en el sitio)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Destacado
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Notas internas (opcional, no se muestran en el sitio)</label>
          <textarea
            rows={2}
            value={form.internalNotes}
            onChange={(e) => updateField('internalNotes', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
