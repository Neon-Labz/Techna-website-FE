import api from '@/lib/axios';

export interface StudentFromApi {
  _id: string;
  studentId: string;
  qrToken: string;
  qrCode?: string;
  email: string;
  phone: string;
  batch: string;
  modules: string[];
  status: 'pending' | 'approved' | 'rejected';
  enrolledAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  avatar?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  dob?: string;
  fullNameTamil?: string;
  fullNameEnglish?: string;
  nicNo?: string;
  school?: string;
  whatsappNo?: string;
  parentsNo?: string;
  permanentAddress?: string;
  administrativeDistrict?: string;
  fixedTelephone?: string;
  residingSince?: string;
  race?: string;
  religion?: string;
  citizenByDescent?: string;
  contactAddress?: string;
  postalCode?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  contactPerson?: string;
  guardianAddress?: string;
  guardianFixedTel?: string;
  guardianMobile?: string;
  olCategory?: string;
  olYear?: string;
  olIndexNumber?: string;
  olNameUsed?: string;
  olResults?: any[];
  subjects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const studentApi = {
  // POST /api/students/register — public register
  register(payload: any): Promise<StudentFromApi> {
    return api.post('/students/register', payload);
  },

  // GET /api/students — all students
  getAll(): Promise<StudentFromApi[]> {
    return api.get('/students');
  },

  // GET /api/students/:id — get student profile
  getById(id: string): Promise<StudentFromApi> {
    return api.get(`/students/${id}`);
  },

  // PATCH /api/students/:id — update student profile
  update(id: string, payload: Partial<StudentFromApi>): Promise<StudentFromApi> {
    return api.patch(`/students/${id}`, payload);
  },

  // DELETE /api/students/:id — delete student
  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/students/${id}`);
  },

  // PATCH /api/students/:id/approve — approve registration
  approve(id: string): Promise<StudentFromApi> {
    return api.patch(`/students/${id}/approve`);
  },

  // PATCH /api/students/:id/reject — reject registration
  reject(id: string, payload: { reason: string }): Promise<StudentFromApi> {
    return api.patch(`/students/${id}/reject`, payload);
  },

  // GET /api/students/:id/enrolment-history — enrolment history
  getEnrolmentHistory(id: string): Promise<any> {
    return api.get(`/students/${id}/enrolment-history`);
  },
};
export { studentApi as studentApiInstance };
