import { NavLink, Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { Logo } from '../layout/Logo'

export function AdminLayout() {
  const { session, logout } = useAdminAuth()

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="bg-ink-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo showWordmark={false} />
              <span className="text-sm font-bold text-ink-200">Admin</span>
            </div>
            <nav className="hidden gap-1 sm:flex">
              <NavLink
                to="/admin/productos"
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`
                }
              >
                Productos
              </NavLink>
              <NavLink
                to="/admin/categorias"
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`
                }
              >
                Categorías
              </NavLink>
              <NavLink
                to="/admin/cotizaciones"
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`
                }
              >
                Cotizaciones
              </NavLink>
              <NavLink
                to="/admin/configuracion"
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-semibold ${isActive ? 'bg-brand-500/15 text-brand-400' : 'text-ink-200 hover:bg-white/5 hover:text-white'}`
                }
              >
                Configuración
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-300 sm:inline">{session?.username}</span>
            <button onClick={logout} className="rounded-md bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/20">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
