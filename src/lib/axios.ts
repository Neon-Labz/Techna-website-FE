import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
  if (config.headers?.['X-Skip-Auth']) {
    delete config.headers['X-Skip-Auth'];
    return config;
  }

  if (config.headers?.Authorization) {
    return config;
  }

  const auth = localStorage.getItem('techna-auth');

  if (auth) {
    const parsed = JSON.parse(auth);
    const token = parsed?.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
