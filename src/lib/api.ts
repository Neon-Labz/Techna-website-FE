import api from './axios';

// ─── Interfaces matching backend schema names ───────────────────────────────

export interface ApiResource {
  _id: string;
  title: string;
  fileType: 'video' | 'image' | 'pdf' | 'file';
  fileUrl: string;
  fileKey: string;
  url?: string;
  thumbnailUrl?: string;
  description?: string;
  uploadedAt?: string;
  isPublished?: boolean;
}

export interface ApiModule {
  _id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  description: string;
  duration: string;
  fee: number;
  batch: string;
  status: 'active' | 'inactive';
  resources?: ApiResource[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTeacher {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  experience: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiStudent {
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
  olResults?: {
    year: string;
    indexNumber: string;
    english?: string;
    mathematics?: string;
    science?: string;
    sinhala?: string;
    tamil?: string;
  }[];
  subjects?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiAttendance {
  _id: string;
  studentId: string;
  moduleId: string;
  moduleName: string;
  date: string;
  status: 'present' | 'absent';
  markedAt: string;
  sessionDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPayment {
  _id: string;
  studentId: string;
  studentName: string;
  moduleId: string;
  moduleName: string;
  amount: number;
  paidDate: string;
  method: 'cash' | 'bank' | 'online';
  status: 'paid' | 'pending' | 'overdue';
  receiptNo: string;
  batch: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiExamNotice {
  _id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  batch: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Module APIs ─────────────────────────────────────────────────────────────

export const getModules = (): Promise<ApiModule[]> =>
  api.get('/modules');

export const createModule = (data: Partial<ApiModule>): Promise<ApiModule> =>
  api.post('/modules', data);

export const updateModule = (id: string, data: Partial<ApiModule>): Promise<ApiModule> =>
  api.patch(`/modules/${id}`, data);

export const deleteModule = (id: string): Promise<{ message: string }> =>
  api.delete(`/modules/${id}`);

// ─── Teacher APIs ────────────────────────────────────────────────────────────

export const getTeachers = (): Promise<ApiTeacher[]> =>
  api.get('/teachers');

// ─── Student APIs ────────────────────────────────────────────────────────────

export const getStudents = (): Promise<ApiStudent[]> =>
  api.get('/students');

// ─── Attendance APIs ─────────────────────────────────────────────────────────

export const getAttendance = (params?: Record<string, string>): Promise<ApiAttendance[]> =>
  api.get('/attendance', { params });

export const createAttendance = (data: any): Promise<ApiAttendance> =>
  api.post('/attendance', data);

export const updateAttendance = (id: string, data: any): Promise<ApiAttendance> =>
  api.patch(`/attendance/${id}`, data);

export const deleteAttendance = (id: string): Promise<{ message: string }> =>
  api.delete(`/attendance/${id}`);

// ─── Module Resources APIs ───────────────────────────────────────────────────

export const addResourceUrl = (moduleId: string, data: any): Promise<any> =>
  api.post(`/modules/${moduleId}/add-resource-url`, data);

export const toggleResourcePublish = (moduleId: string, resourceId: string): Promise<any> =>
  api.patch(`/modules/${moduleId}/resources/${resourceId}/toggle-publish`);

// ─── Payment APIs ────────────────────────────────────────────────────────────

export const getPayments = (): Promise<ApiPayment[]> =>
  api.get('/payments');

export const createPayment = (data: any): Promise<ApiPayment> =>
  api.post('/payments', data);

export const updatePayment = (id: string, data: any): Promise<ApiPayment> =>
  api.patch(`/payments/${id}`, data);

// ─── Exam Notice APIs ────────────────────────────────────────────────────────

export const getExamNotices = (): Promise<ApiExamNotice[]> =>
  api.get('/exam-notices');

export const createExam = (data: any): Promise<ApiExamNotice> =>
  api.post('/exam-notices', data);

export const updateExam = (id: string, data: any): Promise<ApiExamNotice> =>
  api.patch(`/exam-notices/${id}`, data);

export const publishExam = (id: string): Promise<ApiExamNotice> =>
  api.patch(`/exam-notices/${id}/publish`);

export const unpublishExam = (id: string): Promise<ApiExamNotice> =>
  api.patch(`/exam-notices/${id}/unpublish`);

// ─── Error Helper ────────────────────────────────────────────────────────────

export function extractErrorMessage(err: any): string {
  if (err?.response?.data?.message) {
    const msg = err.response.data.message;
    if (Array.isArray(msg) && msg.length > 0) return String(msg[0]);
    return String(msg);
  }
  return 'Something went wrong. Please try again.';
}
