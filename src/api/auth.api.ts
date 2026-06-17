import apiClient from '../lib/axios';

export const registerStudent = async (formData: FormData) => {
  const response = await apiClient.post('/students/register', formData);
  return response.data;
};

export const studentLogin = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/student/login', {
    email,
    password,
  });
  return response.data;
};

export const getSession = async (token?: string) => {
  const response = await apiClient.get('/auth/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};