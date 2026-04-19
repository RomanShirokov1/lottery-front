import { createBrowserRouter } from 'react-router-dom'
import { AdminGuard } from '@/app/model/guards/admin-guard/AdminGuard'
import { UserGuard } from '@/app/model/guards/user-guard/UserGuard'
import { AuthLayout } from '@/app/model/layouts/auth-layout/AuthLayout'
import { ProtectedLayout } from '@/app/model/layouts/protected-layout/ProtectedLayout'
import { RoleRedirect } from '@/app/model/redirects/role-redirect/RoleRedirect'
import { AdminDashboardPage } from '@/pages/admin-dashboard'
import { AuthPage } from '@/pages/auth'
import { NotFoundPage } from '@/pages/not-found'
import { UserDashboardPage } from '@/pages/user-dashboard'
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
            element: <UserDashboardPage />,
          },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          {
            path: ROUTES.adminRoot,
            element: <AdminDashboardPage />,
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
