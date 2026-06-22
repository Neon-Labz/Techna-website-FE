import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white">
      <div className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="flex flex-col items-start text-left">
              <div className="w-[240px] h-[72px] flex items-start justify-start overflow-hidden">
                <Image
                 src="/new.png"
                  alt="Techna Logo"
                  width={240}
                  height={240}
                  className="object-contain object-left -mt-[82px] -ml-[45px]"
                />
              </div>

              <p
                className="text-[14px] leading-[23px] mt-0 mb-3 text-left"
                style={{ color: '#34BFF3' }}
              >
                Smart Thinking Leads To Innovate.
                <br />
                Build Your Dreams with Technology
              </p>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: '#0183CB' }}
                >
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: '#0183CB' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M10 8L16 12L10 16V8Z" fill="white" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: '#0183CB' }}
                >
                  <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: '#0183CB' }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: '#0183CB' }}
              >
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Subjects', path: '/modules' },
                  { label: 'Contact Us', path: '/contact' },
                  { label: 'Login', path: '/login' },
                  { label: 'Register', path: '/register' },
                ].map(link => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-[14px]"
                      style={{ color: '#34BFF3' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: '#0183CB' }}
              >
                Subjects Offered
              </h4>
              <ul className="space-y-4">
                {[
                  'Engineering Technology',
                  'Bio Systems Technology',
                  'Science For Technology',
                  'ICT',
                  'Agricultural Science',
                  'Mathematics',
                  'Geography',
                ].map(subject => (
                  <li
                    key={subject}
                    className="text-[14px]"
                    style={{ color: '#34BFF3' }}
                  >
                    {subject}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4
                className="font-bold mb-5 text-[18px] uppercase"
                style={{ color: '#0183CB' }}
              >
                Contact Us
              </h4>
              <ul className="space-y-5">
                <li
                  className="flex items-start gap-3 text-[14px]"
                  style={{ color: '#34BFF3' }}
                >
                  <MapPin className="w-5 h-5 shrink-0" />
                  <span>Veerasingam Hall, 3rd Floor, Jaffna</span>
                </li>

                <li
                  className="flex items-center gap-3 text-[14px]"
                  style={{ color: '#34BFF3' }}
                >
                  <Phone className="w-5 h-5 shrink-0" />
                  <a href="tel:0771703549">0771703549</a>
                </li>

                <li
                  className="flex items-start gap-3 text-[14px]"
                  style={{ color: '#34BFF3' }}
                >
                  <Mail className="w-5 h-5 shrink-0" />
                  <a
                    href="mailto:technatechnicalinstitute@gmail.com"
                    className="break-all"
                  >
                    technatechnicalinstitute@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-4" style={{ background: '#0183CB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} Techna Technical Institute. All Rights Reserved.
          </p>
          <p className="text-xs text-white">Developed by NeonLabz</p>
        </div>
      </div>
    </footer>
  );
}
