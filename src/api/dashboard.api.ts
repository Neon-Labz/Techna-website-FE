import api from '@/lib/axios';

const getArrayData = (resData: any) => {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData?.results)) return resData.results;
  if (Array.isArray(resData?.modules)) return resData.modules;
  if (Array.isArray(resData?.notices)) return resData.notices;
  if (Array.isArray(resData?.resources)) return resData.resources;
  return [];
};

export const dashboardApi = {
  getNotices: async () => {
    const res = await api.get('/exam-notices/public');
    return getArrayData(res);
  },

  getModules: async () => {
    try {
      const res = await api.get('/modules/public');
      return getArrayData(res);
    } catch (error) {
      const res = await api.get('/modules');
      return getArrayData(res);
    }
  },

  getResults: async (studentId?: string, token?: string) => {
    if (!studentId) return [];

    const res = await api.get(`/exam-notices/student/${studentId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return getArrayData(res);
  },
};
