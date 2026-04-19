import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'

export const RoleRedirect = () => {
  const role = useAuthStore((state) => state.role)

  if (role === 'admin') {
    return <Navigate to={ROUTES.adminRoot} replace />
  }

  return <Navigate to={ROUTES.userRoot} replace />
}
