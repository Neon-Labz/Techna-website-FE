'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Modules', path: '/modules' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-yellow-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-blue-900 leading-tight font-poppins">Techna</p>
              <p className="text-xs text-gray-500 leading-tight">Technical Institute</p>
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
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2 text-sm font-semibold text-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md"
            >
              Register
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { router.push('/login'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-semibold text-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-50"
                >
                  Login
                </button>
                <button
                  onClick={() => { router.push('/register'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
