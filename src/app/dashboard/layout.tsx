'use client';

import { useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import PrivateHeader from '../../components/shared/PrivateHeader';
import WhatsAppButton from '../../components/shared/WhatsAppButton';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '../../store/authStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, updateStudent } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    const refreshStudent = async () => {
      try {
        const student = await authApi.getSession();

        if (mounted && student?.email) {
          updateStudent(student);
        }
      } catch (error) {
        console.error('Failed to refresh student session:', error);
      }
    };

    void refreshStudent();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, updateStudent]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-gray-50">
        <PrivateHeader />
        <main className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
        <WhatsAppButton />
      </div>
    </ProtectedRoute>
  );
}
