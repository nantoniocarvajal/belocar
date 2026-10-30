import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { fetchAdminQuotes } from '../../lib/api'
import type { QuoteSummary } from '../../types/quote'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'
import { EmptyState } from '../../components/ui/EmptyState'

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

export function AdminQuotesPage() {
  const { session } = useAdminAuth()
  const token = session!.token

  const [quotes, setQuotes] = useState<QuoteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    fetchAdminQuotes(token)
      .then(setQuotes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  if (loading) return <LoadingState label="Cargando cotizaciones..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Cotizaciones</h1>
      <p className="mt-1 text-sm text-ink-400">
        Solicitudes de cotización enviadas por los clientes desde el sitio, para seguimiento interno.
        El precio final siempre se conversa por WhatsApp.
      </p>

      {quotes.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Todavía no hay cotizaciones registradas" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-ink-500">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Comuna</th>
                <th className="px-4 py-3">Modalidad</th>
                <th className="px-4 py-3">Cajas</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3 text-ink-500">{formatDate(quote.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{quote.customerName}</p>
                    <p className="text-xs text-ink-400">{quote.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{CLIENT_TYPE_LABELS[quote.clientType]}</td>
                  <td className="px-4 py-3 text-ink-700">{quote.commune}</td>
                  <td className="px-4 py-3 text-ink-700">{FULFILLMENT_LABELS[quote.fulfillmentMode]}</td>
                  <td className="px-4 py-3 text-ink-700">
                    {quote.totalBoxes} ({quote.itemCount} producto{quote.itemCount === 1 ? '' : 's'})
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/cotizaciones/${quote.id}`}
                      className="text-sm font-bold text-brand-700 hover:text-brand-800"
                    >
                      Ver detalle
                    </Link>
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
