'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection() {
  const navigate = useRouter();
  return (
    <section className="py-16 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 leading-tight">
              Ready to Begin Your<br />
              <span className="underline decoration-blue-950/30">Technology Journey?</span>
            </h2>
            <p className="text-blue-900 mt-2 text-base">
              Apply now for Batch 2024 and secure your seat at Techna Technical Institute.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => navigate.push('/register')}
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:0212223456"
              className="flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-blue-950 font-semibold rounded-xl transition-all duration-200 border-2 border-blue-950/10"
            >
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
