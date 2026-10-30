import { useSiteConfig } from '../../hooks/useSiteConfig'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { buttonClasses } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'

export function ContactPage() {
  const { config, loading } = useSiteConfig()

  const whatsappLink = config
    ? buildWhatsAppLink(config.whatsappNumber, 'Hola, quiero contactarme con Distribuidora Belocar.')
    : undefined

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-ink-900">Contacto</h1>
      <p className="mt-2 text-ink-600">
        La forma más rápida de coordinar tu pedido es por WhatsApp. También puedes escribirnos por
        correo o revisar nuestra dirección si prefieres retirar tu pedido.
      </p>

      {loading && <LoadingState label="Cargando datos de contacto..." />}

      {!loading && config && (
        <div className="mt-6 space-y-3 rounded-xl border border-ink-100 bg-white p-6">
          {config.contactPhone && (
            <p className="text-ink-800">
              <span className="font-semibold">Teléfono: </span>
              {config.contactPhone}
            </p>
          )}
          {config.contactEmail && (
            <p className="text-ink-800">
              <span className="font-semibold">Correo: </span>
              {config.contactEmail}
            </p>
          )}
          {config.contactAddress && (
            <p className="text-ink-800">
              <span className="font-semibold">Dirección: </span>
              {config.contactAddress}
            </p>
          )}

          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className={buttonClasses('whatsapp', 'mt-2')}>
              Escribir por WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  )
}
