import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, verifyAuth } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'

export const ProtectedLayout = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized)
  const setRole = useAuthStore((state) => state.setRole)
  const logout = useAuthStore((state) => state.logout)
  const [checking, setChecking] = useState(true)
  const strictVerify = import.meta.env.VITE_AUTH_VERIFY_STRICT === 'true'

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      if (!isAuthorized) {
        if (active) {
          setChecking(false)
        }
        return
      }

      try {
        const data = await verifyAuth()
        const role = data?.role

        if (role === 'user' || role === 'admin') {
          setRole(role)
        }
      } catch {
        if (strictVerify) {
          logout()
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    bootstrap()

    return () => {
      active = false
    }
  }, [isAuthorized, logout, setRole, strictVerify])

  if (checking) {
    return (
      <div className="page-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthorized) {
    return <Navigate to={ROUTES.auth} replace />
  }

  return <Outlet />
}
