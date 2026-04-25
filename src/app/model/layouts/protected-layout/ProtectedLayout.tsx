import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, verifyAuth } from '@/entities/auth'
import { ROUTES } from '@/shared/config/routes'
import { getAuthToken, type UserRole } from '@/shared/lib/cookies/auth-token'
import { ProtectedHeader } from './ui/ProtectedHeader'
import styles from './ProtectedLayout.module.css'

export const ProtectedLayout = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized)
  const role = useAuthStore((state) => state.role)
  const login = useAuthStore((state) => state.login)
  const setRole = useAuthStore((state) => state.setRole)
  const logout = useAuthStore((state) => state.logout)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      const token = getAuthToken()

      if (!token) {
        if (active) {
          setChecking(false)
        }
        return
      }

      try {
        const data = await verifyAuth()
        const normalizedRole = typeof data?.role === 'string' ? data.role.toUpperCase() : ''

        if (normalizedRole === 'USER' || normalizedRole === 'ADMIN') {
          const resolvedRole = normalizedRole as UserRole
          login(token, resolvedRole)
          setRole(resolvedRole)
        } else {
          logout()
        }
      } catch {
        logout()
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
  }, [login, logout, setRole])

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

  if (role !== 'USER' && role !== 'ADMIN') {
    return <Navigate to={ROUTES.auth} replace />
  }

  return (
    <div className={styles.page}>
      <ProtectedHeader role={role} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
