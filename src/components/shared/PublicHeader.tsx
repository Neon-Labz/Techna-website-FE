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
    <header className="bg-white border-b border-[#F3F4F6] sticky top-0 z-40">
      <div className="max-w-[1376px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0">
            <Image src="/logo copy.png" alt="Techna Logo" width={105} height={40} className="rounded-full" />
            <div>
              <p className="text-lg font-bold text-[#1C398E] leading-tight">Techna</p>
              <p className="text-xs text-[#6A7282] leading-tight">Technical Institute</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-8 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-[#0183CB] text-white'
                    : 'text-[#0183CB] hover:bg-[#0183CB]/10'
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
              className="px-6 py-2.5 text-base font-medium text-[#0183CB] border-2 border-[#0183CB] rounded-md hover:bg-[#0183CB]/5 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2.5 text-base font-medium text-white bg-[#0183CB] rounded-md hover:bg-[#016ba5] transition-all duration-200 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]"
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
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-[#0183CB] text-white'
                      : 'text-[#0183CB] hover:bg-[#0183CB]/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { router.push('/login'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-medium text-[#0183CB] border-2 border-[#0183CB] rounded-md hover:bg-[#0183CB]/5"
                >
                  Login
                </button>
                <button
                  onClick={() => { router.push('/register'); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-medium text-white bg-[#0183CB] rounded-md hover:bg-[#016ba5]"
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
