import api from '@/lib/axios';

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

export const authApi = {
  /**
   * Login student with email and password
   */
  studentLogin: (email: string, password: string): Promise<LoginResponse> =>
    api.post('/auth/student/login', { email, password }),

  /**
   * Get the current session/user info using stored token
   */
  getSession: (): Promise<any> =>
    api.get('/auth/session'),

  /**
   * Logout the current user
   */
  logout: (): Promise<{ message: string }> =>
    api.post('/auth/logout'),
};
