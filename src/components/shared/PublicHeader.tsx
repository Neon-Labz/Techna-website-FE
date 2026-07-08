'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Subjects', path: '/modules' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ✅ Mobile: ml-[-35px], Desktop: ml-[-60px] */}
        <Link
  href="/"
  className="flex items-center h-full flex-shrink-0 ml-[-35px] md:ml-[-60px]"
>
  <Image
    src="/new.png"
    alt="Techna Logo"
    width={220}
    height={70}
    className="block object-contain"
    priority
  />
</Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-6 lg:px-8 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#0183CB] text-white'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-[#0183CB]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2 text-sm font-semibold text-[#0183CB] border-2 border-[#0183CB] rounded-lg hover:bg-blue-50 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0183CB] rounded-lg hover:bg-[#0170ad] transition-all duration-200 shadow-md"
            >
              Register
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-[#0183CB] text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { router.push('/login'); setMenuOpen(false); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-[#0183CB] border-2 border-[#0183CB] rounded-lg hover:bg-blue-50"
                >
                  Login
                </button>
                <button
                  onClick={() => { router.push('/register'); setMenuOpen(false); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0183CB] rounded-lg hover:bg-[#0170ad]"
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