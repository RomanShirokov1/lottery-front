import { AxiosError } from 'axios'
import { api } from '@/shared/api/base'

type AuthPayload = {
  email: string
  password: string
}

type AuthResponse = {
  token: string
}

type ApiErrorResponse = {
  message?: string
}

export const registerByEmail = async (payload: AuthPayload) => {
  const response = await api.post<AuthResponse>('/auth/register', payload)
  return response.data
}

export const loginByEmail = async (payload: AuthPayload) => {
  const response = await api.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return axiosError.response?.data?.message ?? fallback
  }

  return fallback
}
