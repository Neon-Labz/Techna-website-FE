import axios from 'axios';

const AUTH_STORAGE_KEY = 'edu-auth';

const PUBLIC_PATHS = ['/', '/about', '/contact', '/modules', '/programs'];

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// REQUEST interceptor — attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const authData = localStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        const token = JSON.parse(authData)?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (err) {
      console.error('Failed to read auth token:', err);
    }
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

        // Public pages-ல் 401 வந்தாலும் login-க்கு போகாதே
        const isPublicPath = PUBLIC_PATHS.some(
          (path) => currentPath === path || currentPath.startsWith(path + '/')
        );

        if (!isPublicPath) {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;