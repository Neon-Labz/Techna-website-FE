'use client';
import { useRouter } from 'next/navigation';
import { ArrowRight, Award, Users, BookOpen, Star } from 'lucide-react';

export default function HeroSection() {
  const navigate = useRouter();

  const stats = [
    { icon: Users, value: '2,400+', label: 'Students Enrolled' },
    { icon: BookOpen, value: '7', label: 'Core Subjects' },
    { icon: Award, value: '98%', label: 'Pass Rate' },
    { icon: Star, value: '15+', label: 'Years of Excellence' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-blue-800/60" />

      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            A/L Technology Stream – Batch 2024
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Shape Your
            <span className="block text-yellow-400">Future with</span>
            <span className="block">Technology</span>
          </h1>

          <p className="text-lg text-blue-200 mb-8 max-w-xl leading-relaxed">
            Techna Technical Institute offers world-class A/L Technology Stream education. 
            <strong className="text-white"> Smart Thinking Leads To Innovate.</strong> Join us and unlock your potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <button
              onClick={() => navigate.push('/register')}
              className="flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 text-base"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate.push('/modules')}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-sm transition-all duration-300 text-base"
            >
              Explore Modules <BookOpen className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-blue-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300 animate-bounce">
        <div className="w-px h-8 bg-blue-300/50" />
        <div className="w-2 h-2 rounded-full bg-blue-300" />
      </div>
    </section>
  );
}
