'use client';
import { useRouter } from 'next/navigation';
import { GraduationCap, Clock, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PendingApprovalPage() {
  const { student, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <GraduationCap className="w-9 h-9 text-yellow-400" />
          </div>

          <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Approval Pending</h1>

          {student?.fullNameEnglish && (
            <p className="text-blue-700 font-medium mb-1">{student.fullNameEnglish}</p>
          )}

          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Your account is currently under review. Our admin team will approve your
            registration shortly. You will be able to access the student portal once
            your account is approved.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-amber-700 text-xs font-medium">
              If you believe this is a mistake, please contact the administration office.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">Techna Institute of Technology</p>
        </div>
      </div>
    </div>
  );
}
