import apiClient from '../lib/axios';

const getStoredToken = () => {
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

export const updateStudentProfile = async (
  studentId: string,
  payload: Record<string, unknown>,
): Promise<any> => {
  const endpoint = `/students/${studentId}`;
  const token = getStoredToken();
  const endpointUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${endpoint}`;

  try {
    const response = await apiClient.patch(endpoint, payload);

    return response;
  } catch (error) {
    throw error;
  }

  const response = await apiClient.patch(endpoint, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response;
};
