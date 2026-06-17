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

const authStorage: StateStorage = {
  getItem: (name) => {
    const localValue = getBrowserStorage('local')?.getItem(name);
    if (localValue) {
      authStorageTarget = 'local';
      return localValue;
    }

    const sessionValue = getBrowserStorage('session')?.getItem(name) || null;
    if (sessionValue) authStorageTarget = 'session';
    return sessionValue;
  },
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      if (!parsed?.state?.token || !parsed?.state?.student) {
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
      login: (student: Student, token: string, rememberMe = false) => {
        authStorageTarget = rememberMe ? 'local' : 'session';
        writeToken(token, rememberMe);
        set({ isAuthenticated: true, student, token });
      },
      logout: () => {
        removeAuthData(getBrowserStorage('local'));
        removeAuthData(getBrowserStorage('session'));
        set({ isAuthenticated: false, student: null, token: null });
      },
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
      updateStudent: (student: Student) =>
        set({ student }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        isAuthenticated: Boolean(state.isAuthenticated && state.student && state.token),
        student: state.student,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const hasValidSession = Boolean(state.isAuthenticated && state.student && state.token);
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
