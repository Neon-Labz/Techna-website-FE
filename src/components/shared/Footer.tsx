import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Techna Logo" width={150} height={40} className="rounded-full" />
              {/* <div>
                <p className="text-lg font-bold leading-tight">Techna</p>
                <p className="text-xs text-blue-300 leading-tight">Technical Institute</p>
              </div> */}
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              Smart Thinking Leads To Innovate. Empowering students through quality technical education in A/L Technology Stream.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all text-xs font-bold">FB</a>
              <a href="#" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all text-xs font-bold">YT</a>
              <a href="#" className="w-9 h-9 bg-blue-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all text-xs font-bold">IG</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'Modules', path: '/modules' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Login', path: '/login' },
                { label: 'Register', path: '/register' },
              ].map(link => (
                <li key={link.path}>
                  <Link href={link.path} className="text-blue-300 hover:text-white text-sm transition-colors flex items-center gap-1">
                    <span className="text-yellow-400">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wider">Subjects Offered</h4>
            <ul className="space-y-2">
              {[
                'Engineering Technology',
                'ICT',
                'Mathematics',
                'Bio Systems Technology',
                'Science For Technology',
                'Agricultural Science',
                'Geography',
              ].map(s => (
                <li key={s} className="text-blue-300 text-sm flex items-center gap-1">
                  <span className="text-yellow-400">›</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-yellow-400 font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-blue-300 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-yellow-400 shrink-0" />
                <span>No. 42, Main Street, Jaffna, Sri Lanka.</span>
              </li>
              <li className="flex items-center gap-3 text-blue-300 text-sm">
                <Phone className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>021-222-3456</span>
              </li>
              <li className="flex items-center gap-3 text-blue-300 text-sm">
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>info@techna.lk</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-blue-400 text-xs">
            © {new Date().getFullYear()} Techna Technical Institute. All Rights Reserved.
          </p>
          <p className="text-blue-400 text-xs">
            A/L Technology Stream | Smart Thinking Leads To Innovate
          </p>
        </div>
      </div>
    </footer>
  );
}
