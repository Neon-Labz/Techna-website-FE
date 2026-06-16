'use client';
import PrivateHeader from '../../src/components/shared/PrivateHeader';
import WhatsAppButton from '../../src/components/shared/WhatsAppButton';
import ProtectedRoute from '../../src/components/auth/ProtectedRoute';

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
