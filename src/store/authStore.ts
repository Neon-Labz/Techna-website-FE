import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { AuthState, Student } from '../types';

const AUTH_STORAGE_KEY = 'techna-auth';
const TOKEN_STORAGE_KEYS = ['token', 'access_token', 'accessToken'];

// 'local'  -> "Remember me" ON: session is persisted and survives a page refresh.
// 'memory' -> "Remember me" OFF: nothing is persisted, so a refresh logs the user out.
let authStorageTarget: 'local' | 'memory' = 'memory';

const getLocalStorage = () =>
  typeof window === 'undefined' ? null : window.localStorage;

const getSessionStorage = () =>
  typeof window === 'undefined' ? null : window.sessionStorage;

const removeAuthData = (storage: Storage | null) => {
  if (!storage) return;
  storage.removeItem(AUTH_STORAGE_KEY);
  TOKEN_STORAGE_KEYS.forEach((key) => storage.removeItem(key));
};

const clearAllAuthStorages = () => {
  removeAuthData(getLocalStorage());
  removeAuthData(getSessionStorage());
};

const writeToken = (token: string, rememberMe: boolean) => {
  // Always clear any stale tokens from both storages first.
  clearAllAuthStorages();

  // Only persist the raw token when "Remember me" is enabled.
  // Otherwise the token lives in-memory (zustand state) only and is
  // cleared on refresh.
  if (rememberMe) {
    getLocalStorage()?.setItem('token', token);
  }
};

const isValidStudent = (data: unknown): data is Student => {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  if (obj.success === false || obj.message === 'Unauthorized') return false;

  return !!(obj.email || obj._id || obj.studentId);
};

const authStorage: StateStorage = {
  getItem: (name) => {
    // Only localStorage persists a session across refreshes
    // (the "Remember me" case). sessionStorage is intentionally ignored
    // so that non-remembered sessions are dropped on refresh.
    return getLocalStorage()?.getItem(name) ?? null;
  },

  setItem: (name, value) => {
    // When "Remember me" is OFF we keep auth in-memory only, so skip
    // persisting entirely. A refresh then has no stored session and the
    // user is logged out.
    if (authStorageTarget !== 'local') {
      return;
    }

    try {
      const parsed = JSON.parse(value);

      if (!parsed?.state?.token) {
        clearAllAuthStorages();
        return;
      }
    } catch {
      return;
    }

    getLocalStorage()?.setItem(name, value);
  },

  removeItem: () => {
    clearAllAuthStorages();
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
        authStorageTarget = rememberMe ? 'local' : 'memory';

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
        clearAllAuthStorages();

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
          clearAllAuthStorages();
          state.logout();
        }

        state.setHasHydrated(true);
      },
    }
  )
);