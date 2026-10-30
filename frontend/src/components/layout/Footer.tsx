import { Link } from 'react-router-dom'
import { useSiteConfig } from '../../hooks/useSiteConfig'
import { buildWhatsAppLink } from '../../lib/whatsapp'
import { Logo } from './Logo'

export function Footer() {
  const { config } = useSiteConfig()
  const year = new Date().getFullYear()

  const whatsappLink = config
    ? buildWhatsAppLink(config.whatsappNumber, 'Hola, quiero más información sobre los productos de Distribuidora Belocar.')
    : undefined

  return (
    <footer className="mt-16 bg-ink-900 text-ink-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink-300">
            Venta mayorista de vinos y otros productos en formato de cajas, para empresas y particulares.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Navegación</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li><Link to="/catalogo" className="transition-colors hover:text-white">Catálogo</Link></li>
            <li><Link to="/nosotros" className="transition-colors hover:text-white">Nosotros</Link></li>
            <li><Link to="/despachos-y-retiros" className="transition-colors hover:text-white">Despachos y retiros</Link></li>
            <li><Link to="/preguntas-frecuentes" className="transition-colors hover:text-white">Preguntas frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Contacto</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {config?.contactEmail && <li>{config.contactEmail}</li>}
            {config?.contactPhone && <li>{config.contactPhone}</li>}
            {config?.contactAddress && <li>{config.contactAddress}</li>}
            {whatsappLink && (
              <li>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  Escribir por WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-400">Aviso legal</p>
          <p className="mt-3 text-sm text-ink-300">
            Venta de bebidas alcohólicas solo para mayores de 18 años. Prohibida su venta a menores de edad.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-ink-400">
        © {year} Distribuidora Belocar. Todos los derechos reservados.
      </div>
    </footer>
  )
}
