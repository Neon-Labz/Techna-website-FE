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
  getAll(): Promise<ExamNotice[]> {
    return api.get('/exam-notices');
  },

  getPublished(): Promise<ExamNotice[]> {
    return api.get('/exam-notices/public');
  },

  create(payload: any): Promise<ExamNotice> {
    return api.post('/exam-notices', payload);
  },

  update(id: string, payload: any): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}`, payload);
  },

  publish(id: string): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}/publish`);
  },

  unpublish(id: string): Promise<ExamNotice> {
    return api.patch(`/exam-notices/${id}/unpublish`);
  },

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
