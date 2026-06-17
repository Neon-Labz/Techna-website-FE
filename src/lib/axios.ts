import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

const readStoredToken = () => {
  if (typeof window === 'undefined') return null;

  const storages = [window.localStorage, window.sessionStorage];

  const directToken =
    storages.find((storage) => storage.getItem('token'))?.getItem('token') ||
    storages.find((storage) => storage.getItem('access_token'))?.getItem('access_token') ||
    storages.find((storage) => storage.getItem('accessToken'))?.getItem('accessToken');

  if (directToken) return directToken;

  const persistedAuth =
    window.localStorage.getItem('techna-auth') ||
    window.sessionStorage.getItem('techna-auth');

  if (!persistedAuth) return null;

  try {
    const parsed = JSON.parse(persistedAuth);
    return parsed?.state?.token || parsed?.token || null;
  } catch {
    return null;
  }
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

export default api;