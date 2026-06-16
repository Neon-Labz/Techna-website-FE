import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import PrivateHeader from '../components/shared/PrivateHeader';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';

export default function PrivateLayout() {
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

  if (!isAuthenticated) {
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
