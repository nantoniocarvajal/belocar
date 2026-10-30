import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useSiteConfig } from '../../hooks/useSiteConfig'
import { buildQuoteMessage, buildWhatsAppLink } from '../../lib/whatsapp'
import { submitQuote } from '../../lib/api'
import type { CustomerDetails } from '../../types/quote'
import { QuantitySelector } from '../../components/product/QuantitySelector'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'

const INITIAL_CUSTOMER: CustomerDetails = {
  name: '',
  clientType: 'particular',
  companyName: '',
  phone: '',
  email: '',
  commune: '',
  fulfillmentMode: 'despacho',
  notes: '',
}

type FormErrors = Partial<Record<keyof CustomerDetails, string>>

export function CartPage() {
  const { items, totalBoxes, updateBoxes, removeItem, clearCart } = useCart()
  const { config } = useSiteConfig()
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = <K extends keyof CustomerDetails>(field: K, value: CustomerDetails[K]) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}
    if (!customer.name.trim()) nextErrors.name = 'Ingresa tu nombre.'
    if (!customer.phone.trim()) nextErrors.phone = 'Ingresa un teléfono de contacto.'
    if (!customer.commune.trim()) nextErrors.commune = 'Ingresa tu comuna o ciudad.'
    if (customer.clientType === 'empresa' && !customer.companyName.trim()) {
      nextErrors.companyName = 'Ingresa el nombre de la empresa.'
    }
    return nextErrors
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || items.length === 0 || !config) {
      return
    }

    setSubmitting(true)
    try {
      await submitQuote(items, customer)
    } catch {
      // Si falla el guardado interno, igual dejamos que el cliente continue por WhatsApp:
      // esa conversacion es lo esencial del flujo, el registro interno es secundario.
    } finally {
      setSubmitting(false)
    }

    const message = buildQuoteMessage(items, customer)
    const link = buildWhatsAppLink(config.whatsappNumber, message)
    window.open(link, '_blank', 'noopener,noreferrer')
    clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Tu cotización está vacía"
          description="Agrega productos desde el catálogo para armar tu solicitud de cotización."
          action={
            <Link to="/catalogo" className="text-sm font-bold text-brand-700 hover:text-brand-800">
              Ir al catálogo
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink-900">Mi cotización</h1>
      <p className="mt-2 text-ink-500">
        Revisa las cantidades, completa tus datos y envía la solicitud. Se abrirá WhatsApp con un
        mensaje ya ordenado para continuar la cotización. No se muestran precios ni se procesan pagos
        en esta página.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Productos ({items.length})</h2>
            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Vaciar cotización
            </button>
          </div>

          <ul className="mt-4 space-y-4">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-4 rounded-xl border border-ink-100 bg-white p-4"
              >
                <img
                  src={item.mainImageUrl}
                  alt={item.name}
                  className="h-20 w-20 flex-shrink-0 rounded-lg bg-sand-100 object-contain p-1"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div>
                    <p className="font-semibold text-ink-900">{item.name}</p>
                    <p className="text-xs text-ink-500">
                      {item.brand} · {item.format} · {item.unitsPerBox} un. x caja
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <QuantitySelector
                      value={item.boxes}
                      onChange={(value) => updateBoxes(item.productId, value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-right text-sm font-semibold text-ink-900">
            Total de cajas: {totalBoxes}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-ink-100 bg-white p-6">
          <h2 className="text-lg font-semibold text-ink-900">Tus datos</h2>

          <div>
            <label className="block text-sm font-medium text-ink-800">Nombre *</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <span className="block text-sm font-medium text-ink-800">Tipo de cliente *</span>
            <div className="mt-1 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="radio"
                  name="clientType"
                  checked={customer.clientType === 'particular'}
                  onChange={() => updateField('clientType', 'particular')}
                />
                Particular
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="radio"
                  name="clientType"
                  checked={customer.clientType === 'empresa'}
                  onChange={() => updateField('clientType', 'empresa')}
                />
                Empresa
              </label>
            </div>
          </div>

          {customer.clientType === 'empresa' && (
            <div>
              <label className="block text-sm font-medium text-ink-800">Nombre de la empresa *</label>
              <input
                type="text"
                value={customer.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-800">Teléfono *</label>
              <input
                type="tel"
                value={customer.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-800">Correo (opcional)</label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-800">Comuna o ciudad *</label>
            <input
              type="text"
              value={customer.commune}
              onChange={(e) => updateField('commune', e.target.value)}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
            {errors.commune && <p className="mt-1 text-xs text-red-600">{errors.commune}</p>}
          </div>

          <div>
            <span className="block text-sm font-medium text-ink-800">Modalidad preferida *</span>
            <div className="mt-1 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="radio"
                  name="fulfillmentMode"
                  checked={customer.fulfillmentMode === 'despacho'}
                  onChange={() => updateField('fulfillmentMode', 'despacho')}
                />
                Despacho
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="radio"
                  name="fulfillmentMode"
                  checked={customer.fulfillmentMode === 'retiro'}
                  onChange={() => updateField('fulfillmentMode', 'retiro')}
                />
                Retiro
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-800">Observaciones (opcional)</label>
            <textarea
              value={customer.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="whatsapp" className="w-full" disabled={!config || submitting}>
            {submitting ? 'Enviando...' : 'Enviar solicitud por WhatsApp'}
          </Button>
        </form>
      </div>
    </div>
  )
}
