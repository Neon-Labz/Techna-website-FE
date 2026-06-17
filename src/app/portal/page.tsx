'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, CreditCard, Trophy, User, ClipboardList } from 'lucide-react';

export default function PortalPage() {
  const { student } = useAuthStore();

  const cards = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'bg-blue-50 text-blue-700' },
    { label: 'Exam Schedule', href: '/portal/results', icon: ClipboardList, color: 'bg-orange-50 text-orange-700' },
    { label: 'Payments', href: '/dashboard/payments', icon: CreditCard, color: 'bg-green-50 text-green-700' },
    { label: 'Results', href: '/dashboard/results', icon: Trophy, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Profile', href: '/dashboard/profile', icon: User, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
          {student?.fullNameEnglish && (
            <p className="text-gray-500 mt-1">Welcome back, {student.fullNameEnglish}</p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cards.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
