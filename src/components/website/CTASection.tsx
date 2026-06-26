'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function CTASection() {
  const navigate = useRouter();
  return (
    <section className="w-full py-6 sm:py-8 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* iPhone SE — stacked layout */}
        <div
          className="flex sm:hidden flex-col items-center text-center gap-5 px-6 py-8"
          style={{
            background: 'linear-gradient(90deg, #0183CB 0%, #34BFF3 100%)',
            borderRadius: '16px',
          }}
        >
          {/* Icon */}
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.18)' }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-[20px] font-bold text-white leading-snug">
              Ready to Begin Your Technology Journey?
            </h2>
            <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Take the first step towards a successful career.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => navigate.push('/register')}
              className="w-full py-3 bg-white font-bold text-[13px] rounded-lg hover:bg-gray-50 transition"
              style={{ color: '#0183CB' }}
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate.push('/contact')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-transparent text-white font-semibold text-[13px] rounded-lg hover:bg-white/10 transition"
              style={{ border: '2px solid #fff' }}
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iPad Air — row layout, slightly compact */}
        <div
          className="hidden sm:flex lg:hidden flex-row items-center gap-5 px-8"
          style={{
            background: 'linear-gradient(90deg, #0183CB 0%, #34BFF3 100%)',
            height: '140px',
            borderRadius: '16px',
          }}
        >
          {/* Icon */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.18)' }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-[20px] font-bold text-white leading-snug">
              Ready to Begin Your Technology Journey?
            </h2>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Take the first step towards a successful career.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => navigate.push('/register')}
              className="px-6 py-2.5 bg-white font-bold text-[13px] rounded-lg hover:bg-gray-50 transition"
              style={{ color: '#0183CB' }}
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate.push('/contact')}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent text-white font-semibold text-[13px] rounded-lg hover:bg-white/10 transition"
              style={{ border: '2px solid #fff' }}
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nest Hub Max / Desktop — full row layout */}
        <div
          className="hidden lg:flex flex-row items-center gap-6 px-12"
          style={{
            background: 'linear-gradient(90deg, #0183CB 0%, #34BFF3 100%)',
            height: '176px',
            borderRadius: '16px',
          }}
        >
          {/* Icon */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.18)' }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-[24px] font-bold text-white">
              Ready to Begin Your Technology Journey?
            </h2>
            <p className="text-[14px] mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Take the first step towards a successful career.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 flex-shrink-0">
            <button
              onClick={() => navigate.push('/register')}
              className="px-9 py-3 bg-white font-bold text-[14px] rounded-lg hover:bg-gray-50 transition"
              style={{ color: '#0183CB' }}
            >
              Apply Now
            </button>
            <button
              onClick={() => navigate.push('/contact')}
              className="flex items-center gap-2 px-7 py-3 bg-transparent text-white font-semibold text-[14px] rounded-lg hover:bg-white/10 transition"
              style={{ border: '2px solid #fff' }}
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}