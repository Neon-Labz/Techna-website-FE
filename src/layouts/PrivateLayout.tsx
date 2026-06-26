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
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <PrivateHeader />
      <main className="mx-auto w-full max-w-7xl min-w-0 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
      <WhatsAppButton />
    </div>
  );
}
