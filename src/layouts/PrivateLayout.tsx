import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import PrivateHeader from '../components/shared/PrivateHeader';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';

export default function PrivateLayout() {
  const {
    hasHydrated,
    isAuthenticated,
    student,
    token,
    updateStudent,
  } = useAuthStore();

  const hasValidSession = Boolean(isAuthenticated && student && token);

  useEffect(() => {
    if (!hasValidSession) return;

    let mounted = true;

    const refreshStudent = async () => {
      try {
        const refreshedStudent = await authApi.getSession();

        if (mounted && refreshedStudent?.email) {
          updateStudent(refreshedStudent);
        }
      } catch (error) {
        console.error('Failed to refresh student session:', error);
      }
    };

    void refreshStudent();

    return () => {
      mounted = false;
    };
  }, [hasValidSession, updateStudent]);

  if (!hasHydrated) return null;

  if (!hasValidSession) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <WhatsAppButton />
    </div>
  );
}