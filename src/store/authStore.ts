import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, Student } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      student: null,
      token: null,
      login: (student: Student, token: string) =>
        set({ isAuthenticated: true, student, token }),
      logout: () =>
        set({ isAuthenticated: false, student: null, token: null }),
      updateStudent: (student: Student) =>
        set({ student }),
    }),
    {
      name: 'techna-auth',
    }
  )
);
