import apiClient from '../lib/axios';

export const registerStudent = async (formData: FormData): Promise<any> => {
  return apiClient.post('/students/register', formData);
};

export const studentLogin = async (email: string, password: string): Promise<any> => {
  return apiClient.post('/auth/student/login', {
    email,
    password,
  });
};

export const getSession = async (token?: string): Promise<any> => {
  return apiClient.get('/auth/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
  return apiClient.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
};

export const logoutApi = async (): Promise<any> => {
  return apiClient.post('/auth/logout');
};
