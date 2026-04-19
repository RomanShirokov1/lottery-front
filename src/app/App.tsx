import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/providers/router/AppRouter'

export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
