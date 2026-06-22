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
  // GET /api/teachers — fetch all teachers
  getAll(): Promise<TeacherFromApi[]> {
    return api.get('/teachers');
  },

  // POST /api/teachers — create a new teacher
  create(payload: any): Promise<TeacherFromApi> {
    return api.post('/teachers', payload);
  },

  // PATCH /api/teachers/:id — update a teacher
  update(id: string, payload: any): Promise<TeacherFromApi> {
    return api.patch(`/teachers/${id}`, payload);
  },

  // DELETE /api/teachers/:id — delete a teacher
  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/teachers/${id}`);
  },
};
