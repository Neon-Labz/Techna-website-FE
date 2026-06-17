import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { AuthState, Student } from '../types';

const AUTH_STORAGE_KEY = 'techna-auth';
const TOKEN_STORAGE_KEYS = ['token', 'access_token', 'accessToken'];

let authStorageTarget: 'local' | 'session' = 'session';

const getBrowserStorage = (target: 'local' | 'session') => {
  if (typeof window === 'undefined') return null;
  return target === 'local' ? window.localStorage : window.sessionStorage;
};

const removeAuthData = (storage: Storage | null) => {
  if (!storage) return;
  storage.removeItem(AUTH_STORAGE_KEY);
  TOKEN_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
};

const writeToken = (token: string, rememberMe: boolean) => {
  const targetStorage = getBrowserStorage(rememberMe ? 'local' : 'session');
  const otherStorage = getBrowserStorage(rememberMe ? 'session' : 'local');

  removeAuthData(otherStorage);
  targetStorage?.setItem('token', token);
};

const isValidStudent = (data: unknown): data is Student => {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (obj.success === false || obj.message === 'Unauthorized') return false;

  return !!(obj.email || obj._id || obj.id || obj.studentId);
};

const authStorage: StateStorage = {
  getItem: (name) => {
    const localValue = getBrowserStorage('local')?.getItem(name);

    if (localValue) {
      authStorageTarget = 'local';
      return localValue;
    }

    const sessionValue = getBrowserStorage('session')?.getItem(name) || null;

    if (sessionValue) {
      authStorageTarget = 'session';
    }

    return sessionValue;
  },

  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);

      if (!parsed?.state?.token) {
        removeAuthData(getBrowserStorage('local'));
        removeAuthData(getBrowserStorage('session'));
        return;
      }
    } catch {
      return;
    }

    getBrowserStorage(authStorageTarget)?.setItem(name, value);
  },

  removeItem: (name) => {
    getBrowserStorage('local')?.removeItem(name);
    getBrowserStorage('session')?.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      student: null,
      token: null,
      hasHydrated: false,

      login: (student: Student | null, token: string, rememberMe = false) => {
        authStorageTarget = rememberMe ? 'local' : 'session';

        const validStudent = isValidStudent(student) ? student : null;

        if (student !== null && !validStudent) {
          console.warn(
            'login() received invalid student data — token saved, student cleared',
            student
          );
        }

        writeToken(token, rememberMe);

        set({
          isAuthenticated: true,
          student: validStudent,
          token,
        });
      },

      logout: () => {
        removeAuthData(getBrowserStorage('local'));
        removeAuthData(getBrowserStorage('session'));

        set({
          isAuthenticated: false,
          student: null,
          token: null,
        });
      },

      updateStudent: (student: Student) => {
        if (!isValidStudent(student)) {
          console.warn('updateStudent() called with invalid data — ignoring', student);
          return;
        }

        set({ student });
      },

      setHasHydrated: (hasHydrated: boolean) => {
        set({ hasHydrated });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),

      partialize: (state) => ({
        isAuthenticated: Boolean(state.isAuthenticated && state.token),
        student: state.student,
        token: state.token,
      }),

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const hasValidSession = Boolean(state.isAuthenticated && state.token);

        if (!hasValidSession) {
          removeAuthData(getBrowserStorage('local'));
          removeAuthData(getBrowserStorage('session'));
          state.logout();
        }

        state.setHasHydrated(true);
      },
    }
  )
);