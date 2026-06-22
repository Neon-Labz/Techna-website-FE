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
  const endpointUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`;

  console.log('[Profile update] token being used:', token);
  console.log('[Profile update] endpoint URL:', endpointUrl);
  console.log('[Profile update] request payload:', payload);

  try {
    const response = await apiClient.patch(endpoint, payload);

    console.log('[Profile update] response body:', response);

    return response;
  } catch (error) {
    const response = (error as {
      response?: {
        status?: number;
        data?: unknown;
        config?: { headers?: { Authorization?: unknown } };
      };
      config?: { headers?: { Authorization?: unknown } };
    })?.response;
    const requestConfig = (error as { config?: { headers?: { Authorization?: unknown } } })?.config;

    console.log(
      '[Profile update] Authorization header sent:',
      response?.config?.headers?.Authorization || requestConfig?.headers?.Authorization,
    );
    console.log('[Profile update] response status:', response?.status);
    console.log('[Profile update] response body:', response?.data);
    console.log('[Profile update] failed endpoint URL:', endpointUrl);

    throw error;
  }

  const response = await apiClient.patch(endpoint, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return response;
};
