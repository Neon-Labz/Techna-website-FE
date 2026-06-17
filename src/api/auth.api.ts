import api from '@/lib/axios';

// --------------------
// Types
// --------------------

export interface LoginResponse {
  access_token: string;
  role: string;
}

export interface SessionResponse {
  _id?: string;
  studentId?: string;
  fullNameEnglish?: string;
  fullNameTamil?: string;
  email?: string;
  role?: string;
  phone?: string;
  createdAt?: string;
}

// --------------------
// Auth API
// --------------------

export const authApi = {
  /**
   * Student register
   */
  registerStudent: (formData: FormData): Promise<any> =>
    api.post('/students/register', formData),

  /**
   * Student login
   */
  studentLogin: (email: string, password: string): Promise<LoginResponse> =>
    api.post('/auth/student/login', { email, password }),

  /**
   * Get current session
   */
  getSession: (): Promise<SessionResponse> =>
    api.get('/auth/session'),

  /**
   * Logout user
   */
  logout: (): Promise<{ message: string }> =>
    api.post('/auth/logout'),
};