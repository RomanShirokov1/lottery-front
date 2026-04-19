import Cookies from 'js-cookie'

export type UserRole = 'user' | 'admin'

const AUTH_TOKEN_KEY = 'access_token'
const AUTH_ROLE_KEY = 'access_role'

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 })
}

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY)
}

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY)
}

export const setAuthRole = (role: UserRole) => {
  Cookies.set(AUTH_ROLE_KEY, role, { expires: 7 })
}

export const getAuthRole = (): UserRole | null => {
  const role = Cookies.get(AUTH_ROLE_KEY)
  if (role === 'user' || role === 'admin') {
    return role
  }
  return null
}

export const removeAuthRole = () => {
  Cookies.remove(AUTH_ROLE_KEY)
}
