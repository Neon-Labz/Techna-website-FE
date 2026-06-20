import api from '@/lib/axios';

export interface StudentResultsResponse {
  student: {
    studentId?: string;
    fullNameEnglish?: string;
    email?: string;
    admissionNumber?: string;
    nicNo?: string;
    whatsappNo?: string;
    batch?: string;
    modules?: string[];
  };
  results: ExamNotice[];
  summary: {
    totalResults: number;
    passed: number;
    failed: number;
    averageScore: number;
  };
}

export interface ExamNotice {
  _id: string | null;
  title: string | null;
  moduleId?: string;
  moduleName: string;
  examType?: string | null;
  batch: string;
  date: string | null;
  startTime?: string | null;
  endTime?: string | null;
  venue?: string | null;
  semester?: string | null;
  description?: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  // Result fields — null when not yet published
  marks?: number | null;
  maxMarks?: number | null;
  grade?: string | null;
  result?: string | null;
  hasResult?: boolean;
}

export const examApi = {
  // GET /api/exam-notices — fetch all exam notices
  getAll(): Promise<ExamNotice[]> {
    return api.get('/exam-notices');
  },

  // GET /api/exam-notices/public — fetch published notices
  getPublished(): Promise<ExamNotice[]> {
    return api.get('/exam-notices/public');
  },

  // POST /api/exam-notices — create exam notice
  create(payload: any): Promise<ExamNotice> {
    return api.post('/exam-notices', payload);
  },

  // PATCH /api/exam-notices/:id — update exam notice
  update(id: string, payload: any): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}`, payload);
  },

  // PATCH /api/exam-notices/:id/publish — publish exam notice
  publish(id: string): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}/publish`);
  },

  // PATCH /api/exam-notices/:id/unpublish — unpublish exam notice
  unpublish(id: string): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}/unpublish`);
  },

  // DELETE /api/exam-notices/:id — delete exam notice
  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/exam-notices/${id}`);
  },
};
export { examApi as examNoticeApi };

export const getResultsByStudentId = async (
  studentId: string,
  token?: string,
): Promise<StudentResultsResponse> => {
  return api.get(`/exam-notices/student/${studentId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
