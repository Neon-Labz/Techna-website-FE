'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrivateHeader from '../../components/shared/PrivateHeader';
import WhatsAppButton from '../../components/shared/WhatsAppButton';
import { useAuthStore } from '../../store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { hasHydrated, isAuthenticated, student, token } = useAuthStore();
  const router = useRouter();
  const hasValidSession = Boolean(isAuthenticated && student && token);

  useEffect(() => {
    if (hasHydrated && !hasValidSession) router.replace('/login');
  }, [hasHydrated, hasValidSession, router]);

  if (!hasHydrated || !hasValidSession) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <WhatsAppButton />
    </div>
  );
}
