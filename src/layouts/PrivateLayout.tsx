import { Navigate, Outlet } from 'react-router-dom';
import PrivateHeader from '../components/shared/PrivateHeader';
import WhatsAppButton from '../components/shared/WhatsAppButton';
import { useAuthStore } from '../store/authStore';

export default function PrivateLayout() {
  const { hasHydrated, isAuthenticated, student, token } = useAuthStore();
  const hasValidSession = Boolean(isAuthenticated && student && token);

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
