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
  // GET /api/attendance — all attendance records
  getAll(params?: Record<string, string>): Promise<AttendanceRecord[]> {
    return api.get('/attendance', { params });
  },

  // POST /api/attendance — create attendance record
  create(payload: any): Promise<AttendanceRecord> {
    return api.post('/attendance', payload);
  },

  // PATCH /api/attendance/:id — update attendance record
  update(id: string, payload: any): Promise<AttendanceRecord> {
    return api.patch(`/attendance/${id}`, payload);
  },

  // DELETE /api/attendance/:id — delete attendance record
  delete(id: string): Promise<{ message: string }> {
    return api.delete(`/attendance/${id}`);
  },

  // GET /api/attendance/student/:studentId — get student attendance
  getByStudent(studentId: string): Promise<AttendanceRecord[]> {
    return api.get(`/attendance/student/${studentId}`);
  },
};
