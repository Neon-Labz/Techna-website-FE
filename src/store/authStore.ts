import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, Student } from '../types';

const isValidStudent = (data: unknown): data is Student => {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  // Reject error responses that were accidentally treated as student data
  if (obj.success === false || obj.message === 'Unauthorized') return false;
  return !!(obj.email || obj._id || obj.id);
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      student: null,
      token: null,
      login: (student: Student | null, token: string) => {
        // Always persist token + authenticated state.
        // Student profile is optional here — PDF handler fetches it fresh from API.
        const validStudent = isValidStudent(student) ? student : null;
        if (student !== null && !validStudent) {
          console.warn('login() received invalid student data — token saved, student cleared', student);
        }
        set({ isAuthenticated: true, token, student: validStudent });
      },
      logout: () =>
        set({ isAuthenticated: false, student: null, token: null }),
      updateStudent: (student: Student) => {
        if (!isValidStudent(student)) {
          console.warn('updateStudent() called with invalid data — ignoring', student);
          return;
        }
        set({ student });
      },
    }),
    {
      name: 'techna-auth',
    }
  )
);
