import axios from 'axios';

const AUTH_STORAGE_KEY = 'techna-auth';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/modules',
  '/programs',
  '/login',
  '/register',
  '/pending',
];

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const storages = [window.localStorage, window.sessionStorage];

  const directToken =
    storages.find((storage) => storage.getItem('token'))?.getItem('token') ||
    storages.find((storage) => storage.getItem('access_token'))?.getItem('access_token') ||
    storages.find((storage) => storage.getItem('accessToken'))?.getItem('accessToken');

  if (directToken) return directToken;

  const persistedAuth =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ||
    window.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!persistedAuth) return null;

  try {
    const parsed = JSON.parse(persistedAuth);
    return parsed?.state?.token || parsed?.token || null;
  } catch {
    return null;
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// REQUEST interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE interceptor — unwrap { success, message, data } envelope
api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;

        // Don't redirect to login on public pages
        const isPublicPath = PUBLIC_PATHS.some(
          (path) => currentPath === path || currentPath.startsWith(path + '/')
        );

        if (!isPublicPath) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
