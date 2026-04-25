import { useLayoutEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'

export const UserGuard = () => {
  const navigate = useNavigate()
  const isAuthorized = useAuthStore((state) => state.isAuthorized)
  const role = useAuthStore((state) => state.role)
  const [allowed, setAllowed] = useState(false)

  useLayoutEffect(() => {
    if (!isAuthorized) {
      setAllowed(false)
      navigate(ROUTES.auth, { replace: true })
      return
    }

    if (role !== 'USER') {
      setAllowed(false)
      navigate(ROUTES.adminRoot, { replace: true })
      return
    }

    setAllowed(true)
  }, [isAuthorized, navigate, role])

  if (!allowed) {
    return null
  }

  return <Outlet />
}
