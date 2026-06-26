'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { hasHydrated, isAuthenticated, student } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for the persisted auth state to finish hydrating from storage.
    // Without this, a page refresh/reopen redirects to /login before the
    // remembered token in localStorage is loaded, breaking "Remember me".
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (student?.status && student.status !== 'approved') {
      router.replace('/pending');
      return;
    }
    setIsChecking(false);
  }, [hasHydrated, isAuthenticated, student, router]);

  if (!hasHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
}
