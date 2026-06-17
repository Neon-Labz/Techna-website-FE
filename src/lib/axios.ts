import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Token reader (merged + improved)
const readStoredToken = () => {
  if (typeof window === 'undefined') return null;

  const storages = [window.localStorage, window.sessionStorage];

  const directToken =
    storages.find((s) => s.getItem('token'))?.getItem('token') ||
    storages.find((s) => s.getItem('access_token'))?.getItem('access_token') ||
    storages.find((s) => s.getItem('accessToken'))?.getItem('accessToken');

  if (directToken) return directToken;

  const persistedAuth =
    window.localStorage.getItem('edu-auth') ||
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

// 🚀 REQUEST interceptor
api.interceptors.request.use((config) => {
  const token = readStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 RESPONSE interceptor (401 handling + unwrap support)
api.interceptors.response.use(
  (response) => {
    // If backend sends { success, message, data }
    return response.data?.data ?? response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('edu-auth');
        localStorage.removeItem('techna-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;