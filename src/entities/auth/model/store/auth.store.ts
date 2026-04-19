import { create } from 'zustand'
import {
  getAuthRole,
  getAuthToken,
  removeAuthRole,
  removeAuthToken,
  setAuthRole,
  setAuthToken,
  type UserRole,
} from '@/shared/lib/cookies/auth-token'

type AuthState = {
  isAuthorized: boolean
  role: UserRole | null
  setRole: (role: UserRole) => void
  login: (token: string, role: UserRole) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthorized: Boolean(getAuthToken()),
  role: getAuthRole(),
  setRole: (role) => {
    setAuthRole(role)
    set({ role })
  },
  login: (token, role) => {
    setAuthToken(token)
    setAuthRole(role)
    set({ isAuthorized: true, role })
  },
  logout: () => {
    removeAuthToken()
    removeAuthRole()
    set({ isAuthorized: false, role: null })
  },
}))
