'use client';

import PrivateHeader from '../../components/shared/PrivateHeader';
import WhatsAppButton from '../../components/shared/WhatsAppButton';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <PrivateHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <WhatsAppButton />
      </div>
    </ProtectedRoute>
  );
}