import { useEffect, useState, type FormEvent } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { fetchAdminSiteConfig, updateSiteConfig } from '../../lib/api'
import type { SiteConfig } from '../../types/catalog'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

const EMPTY: SiteConfig = {
  whatsappNumber: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  dispatchInfo: '',
  pickupInfo: '',
}

export function AdminSiteConfigPage() {
  const { session } = useAdminAuth()
  const token = session!.token

  const [form, setForm] = useState<SiteConfig>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAdminSiteConfig(token)
      .then(setForm)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const updateField = <K extends keyof SiteConfig>(field: K, value: SiteConfig[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const updated = await updateSiteConfig(token, form)
      setForm(updated)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la configuración.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingState label="Cargando configuración..." />
  if (error && !form.whatsappNumber) return <ErrorState message={error} />

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-900">Configuración del sitio</h1>
      <p className="mt-1 text-sm text-ink-400">
        Estos datos se muestran en el sitio público: número de WhatsApp, contacto y textos de
        despacho/retiro.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-ink-100 bg-white p-6">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {saved && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Guardado correctamente.</p>}

        <div>
          <label className="block text-sm font-medium text-ink-800">Número de WhatsApp *</label>
          <input
            type="text"
            required
            placeholder="Ej: 56912345678 (con código de país, sin espacios ni +)"
            value={form.whatsappNumber}
            onChange={(e) => updateField('whatsappNumber', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-800">Correo de contacto</label>
            <input
              type="email"
              value={form.contactEmail ?? ''}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-800">Teléfono de contacto</label>
            <input
              type="text"
              value={form.contactPhone ?? ''}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Dirección</label>
          <input
            type="text"
            value={form.contactAddress ?? ''}
            onChange={(e) => updateField('contactAddress', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Texto de despacho</label>
          <textarea
            rows={3}
            value={form.dispatchInfo ?? ''}
            onChange={(e) => updateField('dispatchInfo', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-800">Texto de retiro</label>
          <textarea
            rows={3}
            value={form.pickupInfo ?? ''}
            onChange={(e) => updateField('pickupInfo', e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </form>
    </div>
  )
}
