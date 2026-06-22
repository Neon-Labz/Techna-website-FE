'use client';
import { Clock, Layers, Calendar, ArrowRight } from 'lucide-react';
import { Clock, Layers, Calendar, ArrowRight } from 'lucide-react';
import { mockModules } from '../../data/mockData';
import Link from 'next/link';

/* Display names in uppercase for card titles */
const subjectDisplayNames: Record<string, string> = {
  'ENGINEERING TECHNOLOGY': 'ENGINEERING TECHNOLOGY',
  'BIO SYSTEMS TECHNOLOGY': 'BIO SYSTEMS TECHNOLOGY',
  'SCIENCE FOR TECHNOLOGY': 'SCIENCE FOR TECHNOLOGY',
  'INFORMATION COMMUNICATION TECHNOLOGY': 'COMPUTER APPLICATIONS',
  'MATHEMATICS': 'MATHEMATICS',
  'GEOGRAPHY': 'GEOGRAPHY',
  'AGRICULTURAL SCIENCE': 'AGRICULTURAL SCIENCE',
};

/* Subject-related emojis */
const subjectEmojis: Record<string, string> = {
  'ENGINEERING TECHNOLOGY': '⚙️',
  'BIO SYSTEMS TECHNOLOGY': '🧬',
  'SCIENCE FOR TECHNOLOGY': '🔬',
  'INFORMATION COMMUNICATION TECHNOLOGY': '💻',
  'MATHEMATICS': '📐',
  'GEOGRAPHY': '🌍',
  'AGRICULTURAL SCIENCE': '🌱',
};

/* Subject card descriptions */
const subjectDescriptions: Record<string, string> = {
  'ENGINEERING TECHNOLOGY': 'Build a strong foundation in core engineering principles with hands-on learning.',
  'BIO SYSTEMS TECHNOLOGY': 'Develop biodiversity and business skills for tomorrow\'s global challenges.',
  'SCIENCE FOR TECHNOLOGY': 'Explore the world through discovery, research and innovation.',
  'INFORMATION COMMUNICATION TECHNOLOGY': 'Innovate, code and transform ideas into digital solutions.',
  'MATHEMATICS': 'Shape perspectives and create a better understanding of society and the universe.',
  'GEOGRAPHY': 'Drive business growth with knowledge, analytics and practical skills.',
  'AGRICULTURAL SCIENCE': 'Explore AI concepts and build intelligent systems for the future.',
};

export default function ModulesSection() {
  const subjects = mockModules;
  const subjects = mockModules;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden h-[323px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/contact_hero.png')",
          backgroundColor: '#0183CB',
        }}
      >
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
      <div className="relative bg-[#f0f8ff]">
        <div className="max-w-[1280px] mx-auto px-10 py-16">
          {/* Section Header */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-[#f7fbff] border border-[#d6e8f5] rounded-xl p-7 flex flex-col justify-between hover:shadow-lg hover:border-[#0183CB] transition-all duration-300"
              >
                {/* Emoji Icon */}
                <div className="mb-5">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-[#e2eef7]">
                    <span className="text-[24px] leading-none" role="img" aria-label={subject.name}>
                      {subjectEmojis[subject.name] || '📚'}
                    </span>
                  </div>
                </div>

                {/* Title - Bold blue */}
                <h3 className="text-[20px] font-bold text-[#0183CB] leading-7 font-['Montserrat'] mb-3">
                  {subjectDisplayNames[subject.name] || subject.name}
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#555] leading-[22px] font-['Inter'] mb-5 flex-grow">
                  {subjectDescriptions[subject.name] || subject.description}
                </p>

                {/* Meta info row */}
                <div className="flex items-center gap-4 mb-5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-[14px] h-[14px] text-[#0183CB]" />
                    <span className="text-[13px] text-[#555] font-['Inter']">2 Years</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-[14px] h-[14px] text-[#0183CB]" />
                    <span className="text-[13px] text-[#555] font-['Inter']">12 Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-[14px] h-[14px] text-[#0183CB]" />
                    <span className="text-[13px] text-[#555] font-['Inter']">Term: 6</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="#"
                  className="w-full flex items-center justify-center gap-2 bg-[#0183CB] text-white font-semibold text-[15px] py-3 rounded-lg hover:bg-[#016ba5] transition-colors font-['Inter']"
                >
                  Visit Teacher
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              </div>
            ))}
          </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
