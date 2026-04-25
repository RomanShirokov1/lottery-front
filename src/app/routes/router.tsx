import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdminGuard } from '@/app/model/guards/admin-guard/AdminGuard'
import { UserGuard } from '@/app/model/guards/user-guard/UserGuard'
import { AuthLayout } from '@/app/model/layouts/auth-layout/AuthLayout'
import { ProtectedLayout } from '@/app/model/layouts/protected-layout/ProtectedLayout'
import { RoleRedirect } from '@/app/model/redirects/role-redirect/RoleRedirect'
import { AdminDrawsPage } from '@/pages/admin-draws'
import { AdminLotteryTypesPage } from '@/pages/admin-lottery-types'
import { AdminReportsPage } from '@/pages/admin-reports'
import { AuthPage } from '@/pages/auth'
import { NotFoundPage } from '@/pages/not-found'
import { UserDrawsPage } from '@/pages/user-draws'
import { UserReportsPage } from '@/pages/user-reports'
import { UserTicketsPage } from '@/pages/user-tickets'
import { ROUTES } from '@/shared/config/routes'

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: ROUTES.home,
        element: <RoleRedirect />,
      },
      {
        element: <UserGuard />,
        children: [
          {
            path: ROUTES.userRoot,
            element: <Navigate to={ROUTES.userDraws} replace />,
          },
          {
            path: ROUTES.userDraws,
            element: <UserDrawsPage />,
          },
          {
            path: ROUTES.userTickets,
            element: <UserTicketsPage />,
          },
          {
            path: ROUTES.userReports,
            element: <UserReportsPage />,
          },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          {
            path: ROUTES.adminRoot,
            element: <Navigate to={ROUTES.adminDraws} replace />,
          },
          {
            path: ROUTES.adminDraws,
            element: <AdminDrawsPage />,
          },
          {
            path: ROUTES.adminLotteryTypes,
            element: <AdminLotteryTypesPage />,
          },
          {
            path: ROUTES.adminReports,
            element: <AdminReportsPage />,
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.auth,
    element: <AuthLayout />,
    children: [{ index: true, element: <AuthPage /> }],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
