import apiClient from '../lib/axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerStudent = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/students/register', formData);
  return response;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const studentLogin = async (email: string, password: string): Promise<any> => {
  const response = await apiClient.post('/auth/student/login', {
    email,
    password,
  });
  return response;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSession = async (token?: string): Promise<any> => {
  const response = await apiClient.get('/auth/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response;
};