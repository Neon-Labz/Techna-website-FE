import Link from 'next/link';
import { Home, ChevronRight, FileText, UserCheck, ShieldCheck, RefreshCcw, Mail } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    title: 'Use of Website',
    description:
      'This website is provided for informational purposes about Techna Technical Institute\u2019s courses, admissions, and services. You agree not to misuse the site or its content.',
  },
  {
    icon: UserCheck,
    title: 'Admissions and Registration',
    description:
      'Information submitted through the Register/Contact forms will be used solely for admissions and communication purposes related to our courses.',
  },
  {
    icon: ShieldCheck,
    title: 'Intellectual Property',
    description:
      'All content on this website, including logos, text, and images, is the property of Techna Technical Institute unless otherwise stated.',
  },
  {
    icon: RefreshCcw,
    title: 'Changes to Terms',
    description:
      'We may update these terms from time to time. Continued use of the website indicates acceptance of any changes.',
  },
];

export default function TermsAndConditions() {
  return (
    <main className="w-full">
      {/* Hero Banner */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0183CB 0%, #34BFF3 100%)',
        }}
      >
        {/* decorative circles */}
        <div className="pointer-events-none absolute -left-10 -top-10 w-52 h-52 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute right-10 top-8 w-72 h-72 rounded-full border border-white/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-white">Terms and Conditions</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Terms and Conditions
          </h1>

          <p className="max-w-2xl mx-auto text-white/90 text-[15px] leading-relaxed">
            Please read these terms carefully before using the Techna Technical Institute
            website. By accessing our site, you agree to the conditions outlined below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-right">
            <span className="text-sm font-medium" style={{ color: '#0183CB' }}>
              {sections.length + 1} Sections
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: '#EAF6FD' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#0183CB' }} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {description}
                </p>
              </div>
            ))}

            {/* Contact card spans full width */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: '#EAF6FD' }}
              >
                <Mail className="w-6 h-6" style={{ color: '#0183CB' }} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                If you have any questions about these Terms and Conditions, contact us at{' '}
                <a
                  href="mailto:technatechnicalinstitute@gmail.com"
                  className="underline"
                  style={{ color: '#0183CB' }}
                >
                  technatechnicalinstitute@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}