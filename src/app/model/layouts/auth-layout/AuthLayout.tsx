import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'

export const AuthLayout = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized)
  const role = useAuthStore((state) => state.role)

  if (isAuthorized) {
    return (
      <Navigate
        to={role === 'ADMIN' ? ROUTES.adminRoot : ROUTES.userRoot}
        replace
      />
    )
  }

  return <Outlet />
}
