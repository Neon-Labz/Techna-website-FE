'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Image from 'next/image';
import { authApi } from '@/api/auth.api';

export default function PrivateHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { student, token, logout } = useAuthStore();

  const fullName =
    student?.fullNameEnglish?.trim() ||
    student?.name?.trim() ||
    'Student';

  const firstName = fullName?.split(' ')?.[0] || 'Student';

  const admissionNo =
    student?.admissionNumber?.trim() ||
    student?.studentId?.trim() ||
    '-';

  const email = student?.email?.trim() || '-';

  const navLinks = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Profile', path: '/dashboard/profile' },
    { label: 'Results', path: '/dashboard/results' },
    { label: 'Payments', path: '/dashboard/payments' },
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
    router.push('/');
    setDropdownOpen(false);
    setMenuOpen(false);
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
      <div className="mx-auto w-full max-w-[1215px] px-3">
          <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2 -ml-5">
            <Image
              src="/logo.png"
              alt="Techna Logo"
              width={95}
              height={36}
              className="h-auto w-[88px] object-contain sm:w-[95px]"
              priority
            />

           <div className="leading-tight">
              <h1 className="text-xl font-semibold text-[#0183CB]">
                Techna
              </h1>
              <p className="text-sm font-medium text-[#0183CB]">
                Student Portal
              </p>
            </div>
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

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-full p-2 text-[#0183CB] hover:bg-gray-100 hover:text-sky-600"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-[#0183CB] hover:bg-gray-100"
              >
                <User className="h-4 w-4 shrink-0 text-sky-600" />
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
                    <p className="truncate text-xs text-gray-500">
                      {admissionNo}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {email}
                    </p>
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

          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            <div className="mb-2 rounded-lg bg-sky-50 px-4 py-3">
              <p className="truncate text-sm font-semibold text-gray-900">
                {fullName}
              </p>
              <p className="truncate text-xs text-gray-500">
                {admissionNo}
              </p>
              <p className="truncate text-xs text-gray-500">
                {email}
              </p>
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
