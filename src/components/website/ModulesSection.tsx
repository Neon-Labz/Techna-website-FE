'use client';
import { Clock, Layers, Calendar, ArrowRight } from 'lucide-react';
import { mockModules } from '../../data/mockData';
import Link from 'next/link';

/* Proper capitalized subject display names */
const subjectDisplayNames: Record<string, string> = {
  'Engineering Technology': 'Engineering Technology',
  'Bio Systems Technology': 'Bio Systems Technology',
  'Science For Technology': 'Science For Technology',
  'Information Communication Technology': 'Computer Applications',
  'Mathematics': 'Mathematics',
  'Geography': 'Geography',
  'Agricultural Science': 'Agricultural Science',
};

/* Subject-related emojis - each emoji represents the subject */
const subjectEmojis: Record<string, string> = {
  'Engineering Technology': '⚙️',
  'Bio Systems Technology': '🧬',
  'Science For Technology': '🔬',
  'Information Communication Technology': '💻',
  'Mathematics': '📐',
  'Geography': '🌍',
  'Agricultural Science': '🌱',
};

/* Subject card descriptions */
const subjectDescriptions: Record<string, string> = {
  'Engineering Technology': 'Build a strong foundation in core engineering principles with hands-on learning.',
  'Bio Systems Technology': 'Develop biodiversity and business skills for tomorrow\'s global challenges.',
  'Science For Technology': 'Explore the world through discovery, research and innovation.',
  'Information Communication Technology': 'Innovate, code and transform ideas into digital solutions.',
  'Mathematics': 'Shape perspectives and create a better understanding of society and the universe.',
  'Geography': 'Drive business growth with knowledge, analytics and practical skills.',
  'Agricultural Science': 'Explore AI concepts and build intelligent systems for the future.',
};

export default function ModulesSection() {
  const subjects = mockModules;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - using contact_hero.png */}
      <div
        className="relative overflow-hidden h-[323px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/contact_hero.png')",
          backgroundColor: '#0183CB',
        }}
      >
        {/* Content container */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[64px] w-full max-w-[1280px] px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1 opacity-90 mb-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1">
              <path d="M2 6L8 1.5L14 6V13.5C14 13.8978 13.842 14.2794 13.5607 14.5607C13.2794 14.842 12.8978 15 12.5 15H3.5C3.10218 15 2.72064 14.842 2.43934 14.5607C2.15804 14.2794 2 13.8978 2 13.5V6Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-white text-sm font-normal">Home</span>
            <span className="text-white text-sm mx-1">/</span>
            <span className="text-white text-sm font-normal">Academics</span>
            <span className="text-white text-sm mx-1">/</span>
            <span className="text-white text-sm font-bold">Our Subject</span>
          </nav>

          {/* Heading */}
          <h1 className="text-center text-[48px] font-extrabold text-white leading-[48px] mt-2 font-['Hanken_Grotesk']">
            Our Subject
          </h1>

          {/* Decorative bar */}
          <div className="w-16 h-1 bg-white opacity-60 mx-auto mt-4"></div>

          {/* Subtitle */}
          <p className="text-center text-lg text-white opacity-90 leading-[29px] mt-5 max-w-[672px] mx-auto font-['Hanken_Grotesk']">
            Explore our wide range of industry-relevant Subject designed to build skills, knowledge and shape your future.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative" style={{ background: 'rgba(1, 131, 203, 0.05)' }}>
        <div className="max-w-[1280px] mx-auto px-10 py-16">
          {/* Section Header above cards */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[1.5px] text-[#34BFF3] font-['Inter'] mb-2">
                Academic Programs
              </p>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-[#1B1C1C] leading-tight font-['Montserrat']">
                Explore Our Subjects
              </h2>
              <div className="w-16 h-1 bg-[#0183CB] rounded-full mt-3"></div>
            </div>
            <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-[#C1C6D7] rounded-full px-4 py-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0183CB]"></span>
              <span className="text-sm font-semibold text-[#414754] font-['Inter']">
                {subjects.length} Subjects Available
              </span>
            </div>
          </div>

          {/* Subject Cards Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group bg-white border border-[#C1C6D7] rounded-xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#0183CB] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Subject-related Emoji */}
                <div className="mb-6">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#0183CB]/8 group-hover:bg-[#0183CB]/15 transition-colors">
                    <span className="text-[30px] leading-none" role="img" aria-label={subject.name}>
                      {subjectEmojis[subject.name] || '📚'}
                    </span>
                  </div>
                </div>

                {/* Title - Proper Capitalization */}
                <h3 className="text-[24px] font-bold text-[#1B1C1C] leading-8 font-['Montserrat'] mb-2 group-hover:text-[#0183CB] transition-colors">
                  {subjectDisplayNames[subject.name] || subject.name}
                </h3>

                {/* Description */}
                <p className="text-base text-[#414754] leading-[26px] font-['Inter'] mb-6">
                  {subjectDescriptions[subject.name] || subject.description}
                </p>

                {/* Divider + Meta */}
                <div className="border-t border-[#EFEDED] pt-4 mb-6">
                  <div className="flex items-center gap-5 flex-wrap">
                    {/* Duration - displayed as "2 Years" */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-[15px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">2 Years</span>
                    </div>
                    {/* Modules / Units */}
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-[15px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">12 Modules</span>
                    </div>
                    {/* Terms */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-[13.5px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">Term: 6</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="#"
                  className="w-full flex items-center justify-center gap-2 bg-[#0183CB] text-white font-bold text-base py-3 rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#016ba5] transition-colors font-['Inter']"
                >
                  Visit Teacher
                  <ArrowRight className="w-[19px] h-[9px]" strokeWidth={3} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
