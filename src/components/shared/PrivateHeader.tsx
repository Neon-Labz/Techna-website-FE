'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logoutApi } from '../../api/auth.api';
import Image from 'next/image';

export default function PrivateHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { student, logout } = useAuthStore();
  const studentData = student as any;
  const profileImage =
    studentData?.profilePhoto || studentData?.avatar || studentData?.profileImage || '';

  const navLinks = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Profile', path: '/dashboard/profile' },
    { label: 'Results', path: '/dashboard/results' },
    { label: 'Payments', path: '/dashboard/payments' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore backend errors — still clear local session
    }
    logout();
    setDropdownOpen(false);
    router.replace('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-950 to-blue-900 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-0">
            <Image src="/techna-logo.png" alt="Techna Logo" width={105} height={40} className="rounded-full" />
            <div>
              <p className="text-lg font-bold text-white leading-tight">Techna</p>
              <p className="text-xs text-blue-300 leading-tight">Student Portal</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <div className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={student?.fullNameEnglish || 'Profile photo'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-blue-900" />
                  )}
                </div>
                <span className="text-sm font-medium">{student?.fullNameEnglish?.split(' ')[0] || 'Student'}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-blue-900">{student?.fullNameEnglish}</p>
                    <p className="text-xs text-gray-500">{student?.admissionNumber}</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-all"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <div className="flex flex-col gap-1 pt-3">
              <div className="px-4 py-3 bg-white/10 rounded-lg mb-2 flex items-center gap-3">
                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={student?.fullNameEnglish || 'Profile photo'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-blue-900" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{student?.fullNameEnglish}</p>
                  <p className="text-xs text-blue-300">{student?.admissionNumber}</p>
                </div>
              </div>
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-300 hover:bg-white/10 rounded-lg"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
