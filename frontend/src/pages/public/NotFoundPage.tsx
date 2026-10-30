import { Link } from 'react-router-dom'
import { buttonClasses } from '../../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-ink-900">404</h1>
      <p className="text-ink-500">La página que buscas no existe o fue movida.</p>
      <Link to="/" className={buttonClasses('primary')}>
        Volver al inicio
      </Link>
    </div>
  )
}
