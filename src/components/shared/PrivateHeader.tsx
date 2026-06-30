'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '@/api/auth.api';
import NotificationBell from './NotificationBell';

export default function PrivateHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const { student, token, logout } = useAuthStore();
  const studentData = student as any;

  const fullName =
    studentData?.fullNameEnglish?.trim() ||
    studentData?.name?.trim() ||
    'Student';

  const firstName = fullName?.split(' ')?.[0] || 'Student';
  const studentId = studentData?.studentId?.trim() || '-';
  const email = studentData?.email?.trim() || '-';

  const profileImage =
    studentData?.profilePhoto ||
    studentData?.avatar ||
    studentData?.profileImage ||
    '';

  const navLinks = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Profile', path: '/dashboard/profile' },
    { label: 'Results', path: '/dashboard/results' },
    { label: 'Payments', path: '/dashboard/payments' },
    { label: 'Notifications', path: '/dashboard/notifications' },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    router.replace('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto w-full max-w-[1250px] px-2">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="Techna Logo"
              width={150}
              height={60}
              className="h-auto w-[125px] object-contain sm:w-[145px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-[#0183CB] hover:bg-sky-50 hover:text-sky-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 pr-8 md:flex">
            <NotificationBell />

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-[#0183CB] hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-yellow-400">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4 text-blue-900" />
                  )}
                </div>

                <span className="max-w-[120px] truncate text-xs font-semibold uppercase">
                  {firstName}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-100 bg-sky-50 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {fullName}
                    </p>
                    <p className="truncate text-xs text-gray-500">{studentId}</p>
                    <p className="truncate text-xs text-gray-500">{email}</p>
                  </div>

                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-sky-50"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <NotificationBell />
            <button
              type="button"
              aria-label="Toggle menu"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-sky-50 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-yellow-400">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-900" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {fullName}
                </p>
                <p className="truncate text-xs text-gray-500">{studentId}</p>
                <p className="truncate text-xs text-gray-500">{email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-sky-500 text-white'
                      : 'text-gray-600 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}