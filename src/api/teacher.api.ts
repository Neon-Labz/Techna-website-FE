import api from '@/lib/axios';

export interface TeacherFromApi {
  _id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  subject: string | string[];
  qualification?: string;
  experience: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  degree?: string[];
  specializations?: string[];
  awards?: string[];
  achievements?: string[];
  biography?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const teacherApi = {
  getAll(): Promise<TeacherFromApi[]> {
    return api.get('/teachers');
  },

  create(payload: any): Promise<TeacherFromApi> {
    return api.post('/teachers', payload);
  },

  update(id: string, payload: any): Promise<TeacherFromApi> {
    return api.patch(`/teachers/${id}`, payload);
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/teachers/${id}`);
  },
};
