import apiClient from '../lib/axios';

export type AuthApiResult = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  applicationReference?: string;
  reference?: string;
  student?: AuthApiResult;
  user?: AuthApiResult;
  profile?: AuthApiResult;
  result?: AuthApiResult;
  data?: AuthApiResult;
  email?: string;
  _id?: string;
  id?: string;
  [key: string]: unknown;
};

export const registerStudent = async (formData: FormData): Promise<AuthApiResult> => {
  const response = await apiClient.post('/students/register', formData);
  return response as unknown as AuthApiResult;
};

export const studentLogin = async (
  email: string,
  password: string
): Promise<AuthApiResult> => {
  const response = await apiClient.post('/auth/student/login', {
    email,
    password,
  });

  return response as unknown as AuthApiResult;
};

export const getSession = async (token?: string): Promise<AuthApiResult> => {
  const response = await apiClient.get('/auth/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response as unknown as AuthApiResult;
};
