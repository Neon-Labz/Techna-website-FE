import api from '@/lib/axios';

const getArrayData = (resData: any) => {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData?.results)) return resData.results;
  if (Array.isArray(resData?.modules)) return resData.modules;
  if (Array.isArray(resData?.notices)) return resData.notices;
  return [];
};

export const dashboardApi = {
  getNotices: async () => {
    const res = await api.get('/exam-notices/public');
    return getArrayData(res.data);
  },

  getModules: async () => {
    try {
      const res = await api.get('/modules/public');
      return getArrayData(res.data);
    } catch (error) {
      const res = await api.get('/modules');
      return getArrayData(res.data);
    }
  },

  getResults: async () => {
    return [];
  },
};
