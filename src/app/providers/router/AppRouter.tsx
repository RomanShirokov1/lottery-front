import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/routes/router'

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
