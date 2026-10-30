import { useSiteConfig } from '../../hooks/useSiteConfig'
import { LoadingState } from '../../components/ui/LoadingState'
import { ErrorState } from '../../components/ui/ErrorState'

export function ShippingPage() {
  const { config, loading, error } = useSiteConfig()

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-ink-900">Despachos y retiros</h1>

      {loading && <LoadingState label="Cargando información..." />}
      {!loading && error && <ErrorState message={error} />}

      {!loading && config && (
        <div className="mt-6 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-ink-900">Despacho</h2>
            <p className="mt-2 text-ink-600">{config.dispatchInfo}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink-900">Retiro</h2>
            <p className="mt-2 text-ink-600">{config.pickupInfo}</p>
          </section>
          <p className="text-sm text-ink-400">
            El valor final del transporte (cuando corresponda) y las zonas exactas se confirman por
            WhatsApp al momento de coordinar tu pedido.
          </p>
        </div>
      )}
    </div>
  )
}
