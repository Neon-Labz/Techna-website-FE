'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function CTASection() {
  const navigate = useRouter();
  return (
    <section className="w-full py-8 bg-white">
      <div
        className="mx-auto flex flex-row items-center gap-6 px-12 max-w-7xl"
        style={{
          background: 'linear-gradient(90deg, #0183CB 0%, #34BFF3 100%)',
          height: '176px',
          borderRadius: '16px',
        }}
      >
        {/* Icon Box */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.18)' }}
        >
          <GraduationCap className="w-6 h-6 text-white" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">
            Ready to Begin Your Technology Journey?
          </h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Take the first step towards a successful career.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 flex-shrink-0">
          <button
            onClick={() => navigate.push('/register')}
            className="px-9 py-3 bg-white font-bold text-sm rounded-lg hover:bg-gray-50 transition"
            style={{ color: '#0183CB' }}
          >
            Apply Now
          </button>
          <button
            onClick={() => navigate.push('/contact')}
            className="flex items-center gap-2 px-7 py-3 bg-transparent text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition"
            style={{ border: '2px solid #fff' }}
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}