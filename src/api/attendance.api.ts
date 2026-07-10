import api from '@/lib/axios';

export interface AttendanceRecord {
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

export const attendanceApi = {
  getAll(params?: Record<string, string>): Promise<AttendanceRecord[]> {
    return api.get('/attendance', { params });
  },

  create(payload: any): Promise<AttendanceRecord> {
    return api.post('/attendance', payload);
  },

  update(id: string, payload: any): Promise<AttendanceRecord> {
    return api.patch(`/attendance/${id}`, payload);
  },

  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/attendance/${id}`);
  },

  getByStudent(studentId: string): Promise<AttendanceRecord[]> {
    return api.get(`/attendance/student/${studentId}`);
  },
};
