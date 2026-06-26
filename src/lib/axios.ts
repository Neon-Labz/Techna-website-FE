import axios from 'axios';

const AUTH_STORAGE_KEYS = ['techna-auth', 'edu-auth'];

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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  timeout: 15000,
});

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const storages = [window.localStorage, window.sessionStorage];

  for (const storage of storages) {
    const directToken =
      storage.getItem('token') ||
      storage.getItem('access_token') ||
      storage.getItem('accessToken');

    if (directToken) return directToken;
  }

  for (const key of AUTH_STORAGE_KEYS) {
    const stored =
      window.localStorage.getItem(key) || window.sessionStorage.getItem(key);

    if (!stored) continue;

    try {
      const parsed = JSON.parse(stored);
      const token = parsed?.state?.token || parsed?.token;

      if (token) return token;
    } catch {
      // ignore invalid storage json
    }
  }

  return null;
};

api.interceptors.request.use((config) => {
  if (config.headers?.['X-Skip-Auth']) {
    delete config.headers['X-Skip-Auth'];
    return config;
  }

  if (config.headers?.Authorization) {
    return config;
  }

  const token = readStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;

      const isPublicPath = PUBLIC_PATHS.some(
        (path) => currentPath === path || currentPath.startsWith(path + '/'),
      );

      const isLoginPath =
        currentPath === '/login' || currentPath.includes('/login');

      if (!isPublicPath && !isLoginPath) {
        AUTH_STORAGE_KEYS.forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default api;