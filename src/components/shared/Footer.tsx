import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full" style={{ background: '#fff' }}>
      {/* Main Footer */}
      <div
        className="w-full"
        style={{ background: '#fff', borderTop: '1px solid #e5e7eb' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/techna-logo.png" alt="Techna Logo" width={48} height={48} className="rounded-full" />
                <div>
                  <p className="text-lg font-bold leading-tight" style={{ color: '#1C398E' }}>Techna</p>
                  <p className="text-xs leading-tight" style={{ color: '#34BFF3' }}>Technical Institute</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#34BFF3' }}>
                Smart Thinking Leads To Innovate. Empowering students through quality technical education in A/L Technology Stream.
              </p>
              <div className="flex gap-3">
                <div className="flex gap-3">
  {/* Facebook */}
  <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: '#0183CB' }}>
    <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  </a>

  {/* YouTube */}
  <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: '#0183CB' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <polygon points="10,8 16,12 10,16" fill="white"/>
    </svg>
  </a>

  {/* LinkedIn */}
  <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: '#0183CB' }}>
    <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  </a>

  {/* Instagram */}
  <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all" style={{ background: '#0183CB' }}>
    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  </a>
</div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider" style={{ color: '#0183CB' }}>Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Modules', path: '/modules' },
                  { label: 'Contact Us', path: '/contact' },
                  { label: 'Login', path: '/login' },
                  { label: 'Register', path: '/register' },
                ].map(link => (
                  <li key={link.path}>
                    <Link href={link.path} className="text-sm transition-colors" style={{ color: '#34BFF3' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subjects */}
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider" style={{ color: '#0183CB' }}>Subjects Offered</h4>
              <ul className="space-y-3">
                {[
                  'Engineering Technology',
                  'ICT',
                  'Mathematics',
                  'Bio Systems Technology',
                  'Science For Technology',
                  'Agricultural Science',
                  'Geography',
                ].map(s => (
                  <li key={s} className="text-sm" style={{ color: '#34BFF3' }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-5 text-sm uppercase tracking-wider" style={{ color: '#0183CB' }}>Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm" style={{ color: '#34BFF3' }}>
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#34BFF3' }} />
                  <span>3rd Floor, Veerasingam Hall, Main Street, Jaffna.</span>
                </li>
                <li className="flex items-center gap-3 text-sm" style={{ color: '#34BFF3' }}>
                  <Phone className="w-4 h-4 shrink-0" style={{ color: '#34BFF3' }} />
                  <span>077 170 3549</span>
                </li>
                <li className="flex items-center gap-3 text-sm" style={{ color: '#34BFF3' }}>
                  <Mail className="w-4 h-4 shrink-0" style={{ color: '#34BFF3' }} />
                  <span>sivasakthy22@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full py-4" style={{ background: '#0183CB' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white">
            © {new Date().getFullYear()} Techna Technical Institute. All Rights Reserved.
          </p>
          <p className="text-xs text-white">
            Developed by NeonLabz
          </p>
        </div>
      </div>
    </footer>
  );
}