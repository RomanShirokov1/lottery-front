import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'access_token';

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, { expires: 7 });
};

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
};
