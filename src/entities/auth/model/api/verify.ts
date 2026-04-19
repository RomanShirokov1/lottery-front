import { api } from '@/shared/api/base'

export const verifyAuth = async () => {
  const response = await api.get('/auth/verify')
  return response.data
}
