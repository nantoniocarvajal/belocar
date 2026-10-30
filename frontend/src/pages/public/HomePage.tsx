import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useSiteConfig } from '../../hooks/useSiteConfig'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { ProductCard } from '../../components/product/ProductCard'
import { LoadingState } from '../../components/ui/LoadingState'
import { buttonClasses } from '../../components/ui/Button'
import { HeroCarousel } from '../../components/home/HeroCarousel'

const STEPS = [
  {
    number: '01',
    title: 'Arma tu cotización',
    description: 'Recorre el catálogo y agrega los productos que te interesan, indicando cuántas cajas necesitas de cada uno.',
  },
  {
    number: '02',
    title: 'Envía tu solicitud',
    description: 'Completa tus datos y envía la solicitud. Se abre WhatsApp con un mensaje ya ordenado para ti.',
  },
  {
    number: '03',
    title: 'Coordinamos contigo',
    description: 'Te respondemos por WhatsApp con precios, disponibilidad, transporte y forma de pago por transferencia.',
  },
]

export function HomePage() {
  const { products, loading } = useProducts({ featured: true })
  const { config } = useSiteConfig()

  const whatsappLink = config
    ? buildWhatsAppLink(config.whatsappNumber, 'Hola, quiero cotizar productos de Distribuidora Belocar.')
    : undefined

  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-300">
              Venta mayorista por cajas
            </span>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
              Vinos y productos seleccionados, al por mayor.
            </h1>
            <p className="max-w-xl text-base text-ink-200 sm:text-lg">
              En Distribuidora Belocar liquidamos vinos y otros productos por caja completa, a empresas
              y particulares. Cotiza online y coordinamos precio, transporte y pago por WhatsApp.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo" className={buttonClasses('secondary')}>
                Ver catálogo
              </Link>
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noreferrer" className={buttonClasses('whatsapp')}>
                  Contactar por WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <HeroCarousel />
          </div>
        </div>
      </section>

      <section className="bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">Productos destacados</h2>
            <Link to="/catalogo" className="text-sm font-bold text-brand-700 hover:text-brand-800">
              Ver todo el catálogo →
            </Link>
          </div>

          {loading ? (
            <LoadingState label="Cargando productos destacados..." />
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border-l-4 border-brand-500 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink-900">Sobre Distribuidora Belocar</h2>
            <p className="mt-3 text-ink-600">
              Distribuidora Belocar es una liquidadora mayorista chilena dedicada a la venta de vinos
              y otros productos por caja completa. Trabajamos tanto con empresas como con personas
              particulares que buscan buenos precios comprando por volumen.
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-brand-500 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-ink-900">Despachos y retiros</h2>
            <p className="mt-3 text-ink-600">
              Contamos con zonas de despacho, algunas con envío gratuito y otras donde cotizamos el
              valor del transporte según tu comuna. También puedes retirar tu pedido coordinando día y
              hora por WhatsApp.
            </p>
            <Link to="/despachos-y-retiros" className="mt-3 inline-block text-sm font-bold text-brand-700 hover:text-brand-800">
              Ver detalle de despachos y retiros →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {STEPS.map((step) => (
              <div key={step.number} className="flex items-start gap-3 sm:flex-1">
                <span className="font-display text-2xl font-black text-brand-300">{step.number}</span>
                <div>
                  <p className="font-display text-sm font-bold text-ink-900">{step.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
