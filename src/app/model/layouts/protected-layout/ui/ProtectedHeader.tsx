import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/auth'
import { type UserRole } from '@/shared/lib/cookies/auth-token'
import { ROUTES } from '@/shared/config/routes'
import { classNames } from '@/shared/lib/class-names/classNames'
import styles from './ProtectedHeader.module.css'

type NavItem = {
  label: string
  to: string
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  USER: [
    { label: 'Тиражи', to: ROUTES.userDraws },
    { label: 'Билеты', to: ROUTES.userTickets },
  ],
  ADMIN: [
    { label: 'Тиражи', to: ROUTES.adminDraws },
    { label: 'Типы лотерей', to: ROUTES.adminLotteryTypes },
    { label: 'Отчеты', to: ROUTES.adminReports },
  ],
}

type ProtectedHeaderProps = {
  role: UserRole
}

export const ProtectedHeader = ({ role }: ProtectedHeaderProps) => {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()
  const navItems = NAV_ITEMS[role]

  const handleLogout = () => {
    logout()
    navigate(ROUTES.auth, { replace: true })
  }

  return (
    <header className={styles.header}>
      <div className={styles.brand}>Lottery Panel</div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              classNames(styles.link, isActive && styles.linkActive)
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.actions}>
        <span className={styles.role}>{role}</span>
        <button type="button" className={styles.logout} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </header>
  )
}
