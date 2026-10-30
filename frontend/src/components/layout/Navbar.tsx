import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Logo } from './Logo'

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/despachos-y-retiros', label: 'Despachos y retiros' },
  { to: '/contacto', label: 'Contacto' },
  { to: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
]

function navLinkClasses(isActive: boolean) {
  return `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? 'bg-brand-500/15 text-brand-400' : 'text-ink-200 hover:bg-white/5 hover:text-white'
  }`
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalBoxes } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-ink-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/cotizacion"
            className="relative inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            Mi cotización
            {totalBoxes > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1 text-xs font-bold text-brand-400 ring-2 ring-ink-900">
                {totalBoxes}
              </span>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menú de navegación"
            aria-expanded={menuOpen}
            className="rounded-md p-2 text-ink-200 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => navLinkClasses(isActive)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
