import api from '@/lib/axios';

export type Announcement = {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  audience: 'All Students';
  batch?: string;
  content: string;
  author?: string;
  createdAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

const unwrapData = <T,>(responseData: ApiResponse<T> | T): T => {
  if (
    responseData &&
    typeof responseData === 'object' &&
    'data' in responseData
  ) {
    return (responseData as ApiResponse<T>).data;
  }

  return responseData as T;
};

export const announcementApi = {
  getAll: async (): Promise<Announcement[]> => {
    const res = (await api.get<ApiResponse<Announcement[]> | Announcement[]>(
      '/announcements',
    )) as unknown as ApiResponse<Announcement[]> | Announcement[];

    return unwrapData<Announcement[]>(res);
  },
};
