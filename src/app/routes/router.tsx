import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'
import { ROUTES } from '@/shared/config/routes'

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
