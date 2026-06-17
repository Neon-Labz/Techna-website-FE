import api from '@/lib/axios';

export interface ExamNotice {
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
