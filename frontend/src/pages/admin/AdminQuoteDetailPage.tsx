import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { fetchAdminQuote } from '../../lib/api'
import type { QuoteDetail } from '../../types/quote'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

const CLIENT_TYPE_LABELS = { empresa: 'Empresa', particular: 'Particular' }
const FULFILLMENT_LABELS = { despacho: 'Despacho', retiro: 'Retiro' }

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AdminQuoteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { session } = useAdminAuth()
  const token = session!.token

  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchAdminQuote(token, Number(id))
      .then(setQuote)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, token])

  if (loading) return <LoadingState label="Cargando cotización..." />
  if (error || !quote) return <ErrorState message={error ?? 'Cotización no encontrada'} />

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/cotizaciones" className="text-sm font-bold text-brand-700 hover:text-brand-800">
        &larr; Volver a cotizaciones
      </Link>

      <h1 className="mt-4 text-2xl font-bold text-ink-900">Cotización #{quote.id}</h1>
      <p className="mt-1 text-sm text-ink-400">{formatDate(quote.createdAt)}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-100 bg-white p-5">
          <h2 className="font-semibold text-ink-900">Datos del cliente</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-ink-400">Nombre</dt>
              <dd className="font-medium text-ink-900">{quote.customerName}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Tipo de cliente</dt>
              <dd className="font-medium text-ink-900">{CLIENT_TYPE_LABELS[quote.clientType]}</dd>
            </div>
            {quote.companyName && (
              <div>
                <dt className="text-ink-400">Empresa</dt>
                <dd className="font-medium text-ink-900">{quote.companyName}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink-400">Teléfono</dt>
              <dd className="font-medium text-ink-900">{quote.phone}</dd>
            </div>
            {quote.email && (
              <div>
                <dt className="text-ink-400">Correo</dt>
                <dd className="font-medium text-ink-900">{quote.email}</dd>
              </div>
            )}
            <div>
              <dt className="text-ink-400">Comuna</dt>
              <dd className="font-medium text-ink-900">{quote.commune}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Modalidad</dt>
              <dd className="font-medium text-ink-900">{FULFILLMENT_LABELS[quote.fulfillmentMode]}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-5">
          <h2 className="font-semibold text-ink-900">Productos ({quote.items.length})</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {quote.items.map((item, index) => (
              <li key={index} className="border-b border-ink-100 pb-2 last:border-0">
                <p className="font-medium text-ink-900">{item.productName}</p>
                <p className="text-xs text-ink-400">
                  {item.productBrand} · {item.format} · {item.unitsPerBox} un. x caja
                </p>
                <p className="mt-1 text-ink-700">{item.boxes} caja(s)</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right font-semibold text-ink-900">
            Total de cajas: {quote.totalBoxes}
          </p>
        </div>
      </div>

      {quote.notes && (
        <div className="mt-6 rounded-xl border border-ink-100 bg-white p-5">
          <h2 className="font-semibold text-ink-900">Observaciones</h2>
          <p className="mt-2 text-sm text-ink-700">{quote.notes}</p>
        </div>
      )}
    </div>
  )
}
