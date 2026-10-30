import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export function ProtectedRoute() {
  const { session } = useAdminAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
