import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST interceptor — attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const authData = localStorage.getItem('edu-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        const token = parsed?.state?.token;
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

// RESPONSE interceptor — unwrap backend's
// { success, message, data } envelope automatically,
// AND handle 401 by redirecting to login
api.interceptors.response.use(
  (response) => {
    // Unwrap one level: { success, message, data } -> data
    return response.data?.data ?? response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('edu-auth');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
